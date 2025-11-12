import { createContext, useContext, useState } from 'react'

const PracticantesContext = createContext()

export function PracticantesProvider({ children }) {
  const [practicantes, setPracticantes] = useState([
    {
      id: 1,
      nombres: 'Jared',
      apellidos: 'Fernandez',
      servidor: 'Gto Py de Medina',
      proyecto: 'Innovación',
      sala: '-',
      estado: 'No evaluado',
      nota: '-'
    }
  ])

  const addPracticante = (practicante) => {
    setPracticantes(prev => [...prev, { ...practicante, id: Date.now() }])
  }

  const updatePracticante = (id, updates) => {
    setPracticantes(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    )
  }

  return (
    <PracticantesContext.Provider value={{ practicantes, addPracticante, updatePracticante }}>
      {children}
    </PracticantesContext.Provider>
  )
}

export function usePracticantes() {
  const context = useContext(PracticantesContext)
  if (!context) {
    throw new Error('usePracticantes must be used within PracticantesProvider')
  }
  return context
}
