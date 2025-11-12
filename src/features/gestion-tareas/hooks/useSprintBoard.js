import { useEffect, useState } from 'react'
import { getSprintStats, getSprintColumns, getMembers, saveColumns } from '../services/sprint.service'

export function useSprintBoard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [columns, setColumns] = useState([])
  const [members, setMembers] = useState([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [s, c, m] = await Promise.all([
        getSprintStats(),
        getSprintColumns(),
        getMembers(),
      ])
      setStats(s)
      setColumns(c)
      setMembers(m)
      setLoading(false)
    }
    load()
  }, [])

  function moveCardWithin(columnId, cardId, targetCardId) {
    if (!columnId || !cardId || !targetCardId || cardId === targetCardId) return
    setColumns((prev) => {
      const next = prev.map((col) => {
        if (col.id !== columnId) return col
        const list = [...(col.cards || [])]
        const fromIndex = list.findIndex((c) => c.id === cardId)
        const toIndex = list.findIndex((c) => c.id === targetCardId)
        if (fromIndex === -1 || toIndex === -1) return col
        const [moved] = list.splice(fromIndex, 1)
        const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex
        list.splice(insertIndex, 0, moved)
        return { ...col, cards: list }
      })
      saveColumns(next)
      return next
    })
  }

  function addCard(columnId, data) {
    setColumns((prev) => {
      const next = prev.map((col) => {
        if (col.id !== columnId) return col
        const newCard = {
          id: data.id,
          tags: data.tags || [],
          titulo: data.titulo || '',
          puntos: Number(data.puntos || 0),
          progreso: data.progreso || { done: 0, total: 17 },
          owner: data.owner || (members[0]?.iniciales || 'NA'),
        }
        return { ...col, cards: [newCard, ...(col.cards || [])] }
      })
      saveColumns(next)
      return next
    })
  }

  function moveCard(fromColumnId, toColumnId, cardId) {
    if (!fromColumnId || !toColumnId || !cardId) return
    setColumns((prev) => {
      let movedCard = null
      const without = prev.map((col) => {
        if (col.id !== fromColumnId) return col
        const remaining = []
        for (const c of col.cards || []) {
          if (!movedCard && c.id === cardId) {
            movedCard = c
          } else {
            remaining.push(c)
          }
        }
        return { ...col, cards: remaining }
      })
      if (!movedCard) return prev
      const next = without.map((col) => {
        if (col.id !== toColumnId) return col
        return { ...col, cards: [movedCard, ...(col.cards || [])] }
      })
      saveColumns(next)
      return next
    })
  }

  function updateCard(columnId, cardId, patch) {
    setColumns((prev) => {
      const next = prev.map((col) => {
        if (col.id !== columnId) return col
        return {
          ...col,
          cards: (col.cards || []).map((c) => (c.id === cardId ? { ...c, ...patch } : c)),
        }
      })
      saveColumns(next)
      return next
    })
  }

  function deleteCard(columnId, cardId) {
    setColumns((prev) => {
      const next = prev.map((col) => {
        if (col.id !== columnId) return col
        return { ...col, cards: (col.cards || []).filter((c) => c.id !== cardId) }
      })
      saveColumns(next)
      return next
    })
  }

  return {
    loading,
    stats,
    columns,
    members,
    addCard,
    moveCard,
    updateCard,
    deleteCard,
    moveCardWithin,
    addColumn(title = 'Nueva columna') {
      const id = 'col-' + Math.random().toString(36).slice(2, 8)
      setColumns((prev) => {
        const next = [...prev, { id, titulo: title, cards: [] }]
        saveColumns(next)
        return next
      })
    },
    renameColumn(columnId, newTitle) {
      if (!newTitle?.trim()) return
      setColumns((prev) => {
        const next = prev.map((c) => (c.id === columnId ? { ...c, titulo: newTitle.trim() } : c))
        saveColumns(next)
        return next
      })
    },
    deleteColumn(columnId) {
      setColumns((prev) => {
        const next = prev.filter((c) => c.id !== columnId)
        saveColumns(next)
        return next
      })
    },
    moveColumn(columnId, targetColumnId) {
      if (!columnId || !targetColumnId || columnId === targetColumnId) return
      setColumns((prev) => {
        const list = [...prev]
        const fromIndex = list.findIndex((c) => c.id === columnId)
        const toIndex = list.findIndex((c) => c.id === targetColumnId)
        if (fromIndex === -1 || toIndex === -1) return prev
        const [moved] = list.splice(fromIndex, 1)
        const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex
        list.splice(insertIndex, 0, moved)
        saveColumns(list)
        return list
      })
    },
  }
}