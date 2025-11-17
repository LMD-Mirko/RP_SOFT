/**
 * Hook personalizado para manejar el estado del Dashboard
 * Contiene la lógica de estado y datos mock del dashboard
 */

import { useState, useMemo } from 'react'

// Datos mock para el dashboard
const mockPracticantes = [
  {
    id: 1,
    nombre: 'Carlos Alberto Mendoza Silva',
    dni: '74567890',
    programa: 'Desarrollo de Software',
    fase: 'Documentación',
    estado: 'Onboarding'
  },
  {
    id: 2,
    nombre: 'María Elena Rodríguez García',
    dni: '73456789',
    programa: 'Administración de Empresas',
    fase: 'Prácticas',
    estado: 'Activo'
  },
  {
    id: 3,
    nombre: 'José Luis Fernández Torres',
    dni: '72345678',
    programa: 'Ingeniería Industrial',
    fase: 'Evaluación',
    estado: 'Activo'
  },
  {
    id: 4,
    nombre: 'Ana Patricia Vásquez López',
    dni: '71234567',
    programa: 'Marketing Digital',
    fase: 'Completado',
    estado: 'Finalizado'
  },
  {
    id: 5,
    nombre: 'Roberto Carlos Jiménez Ruiz',
    dni: '70123456',
    programa: 'Contabilidad',
    fase: 'Completado',
    estado: 'Finalizado'
  },
  {
    id: 6,
    nombre: 'Lucía Fernanda Castro Morales',
    dni: '69012345',
    programa: 'Recursos Humanos',
    fase: 'Documentación',
    estado: 'Onboarding'
  }
]

const mockKPIs = [
  {
    id: 'total',
    title: 'Total practicantes',
    value: '6',
    description: '2 onboarding, 2 activos, 2 finalizados',
    iconColor: '#3B82F6'
  },
  {
    id: 'pendientes',
    title: 'Pendientes de Revisión',
    value: '1',
    description: 'Requieren atención',
    iconColor: '#FB923C'
  },
  {
    id: 'observados',
    title: 'Observados',
    value: '1',
    description: 'Con errores',
    iconColor: '#EF4444'
  },
  {
    id: 'listos',
    title: 'Listos para Enviar',
    value: '1',
    description: 'Firmados',
    iconColor: '#22C55E'
  }
]

const mockTabs = [
  { id: 'onboarding', label: 'Onboarding', count: 2 },
  { id: 'activos', label: 'Activos', count: 2 },
  { id: 'finalizados', label: 'Finalizados', count: 2 }
]

export function useDashboard() {
  // Estados del dashboard
  const [searchTerm, setSearchTerm] = useState('')
  const [filterValue, setFilterValue] = useState('Todos los estados')
  const [activeTab, setActiveTab] = useState('onboarding')

  // Filtrar practicantes según el tab activo y término de búsqueda
  const filteredPracticantes = useMemo(() => {
    let filtered = mockPracticantes

    // Filtrar por tab activo
    switch (activeTab) {
      case 'onboarding':
        filtered = filtered.filter(p => p.estado === 'Onboarding')
        break
      case 'activos':
        filtered = filtered.filter(p => p.estado === 'Activo')
        break
      case 'finalizados':
        filtered = filtered.filter(p => p.estado === 'Finalizado')
        break
      default:
        break
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(term) ||
        p.dni.includes(term) ||
        p.programa.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [activeTab, searchTerm])

  // Handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value)
  }

  const handleFilterChange = (value) => {
    setFilterValue(value)
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  const handleDownload = () => {
    console.log('Descargando datos...')
    // Aquí iría la lógica de descarga
  }

  // Datos calculados
  const totalPracticantes = mockPracticantes.length
  const currentTabData = mockTabs.find(tab => tab.id === activeTab)

  return {
    // Estados
    searchTerm,
    filterValue,
    activeTab,
    
    // Datos
    kpis: mockKPIs,
    tabs: mockTabs,
    practicantes: filteredPracticantes,
    totalPracticantes,
    currentTabData,
    
    // Handlers
    handleSearchChange,
    handleFilterChange,
    handleTabChange,
    handleDownload
  }
}
