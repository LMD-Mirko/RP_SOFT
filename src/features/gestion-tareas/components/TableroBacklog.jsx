import { useEffect, useState } from 'react'
import { listBacklog } from '../services/backlogService'

export function TableroBacklog() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await listBacklog()
        if (!mounted) return
        const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : []
        setItems(list)
      } catch (e) {
        setError(e.message || 'Error cargando backlog')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return <div style={{ padding: 24 }}>Cargando...</div>
  }

  if (error) {
    return <div style={{ padding: 24, color: '#b00020' }}>Error: {error}</div>
  }

  if (!items.length) {
    return <div style={{ padding: 24 }}>No hay ítems de backlog</div>
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Tablero Backlog</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
        {items.map((it) => (
          <div key={it.id || it.uuid || it.title} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: '#6b7280' }}>{it.id || it.uuid}</span>
              <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, background: '#f3f4f6', color: '#374151' }}>{it.priority || it.status}</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>{it.title}</h3>
            {it.description && <p style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>{it.description}</p>}
            <div style={{ marginTop: 8, display: 'flex', gap: 12, fontSize: 13, color: '#4b5563' }}>
              <span>Puntos: {it.story_points ?? 0}</span>
              <span>Estado: {it.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

