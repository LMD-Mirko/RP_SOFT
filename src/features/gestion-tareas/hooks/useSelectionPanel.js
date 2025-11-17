import { useEffect, useMemo, useState } from 'react'
import { getApplicants, getStages, getStatuses } from '../services/selection.service'

export function useSelectionPanel() {
  const [loading, setLoading] = useState(true)
  const [applicants, setApplicants] = useState([])
  const [stages, setStages] = useState([])
  const [statuses, setStatuses] = useState([])

  const [query, setQuery] = useState('')
  const [stage, setStage] = useState('Todas las etapas')
  const [status, setStatus] = useState('Todos los Estados')

  const [detailId, setDetailId] = useState(null)
  const [startTestId, setStartTestId] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [data, stg, sts] = await Promise.all([
        getApplicants(),
        getStages(),
        getStatuses(),
      ])
      setApplicants(data)
      setStages(stg)
      setStatuses(sts)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return applicants.filter((a) => {
      const matchesQ = !q ||
        a.nombre.toLowerCase().includes(q) ||
        a.correo.toLowerCase().includes(q)
      const matchesStage = stage === 'Todas las etapas' || a.etapa === stage
      const matchesStatus = status === 'Todos los Estados' || a.estado === status
      return matchesQ && matchesStage && matchesStatus
    })
  }, [applicants, query, stage, status])

  const stats = useMemo(() => {
    const total = applicants.length
    const formularios = applicants.filter((a) => a.etapa === 'Formulario Enviado').length
    const enPrueba = applicants.filter((a) => a.estado === 'En Prueba').length
    const aprobados = applicants.filter((a) => a.estado === 'Aprobado').length
    return { total, formularios, enPrueba, aprobados }
  }, [applicants])

  const openDetails = (id) => setDetailId(id)
  const closeDetails = () => setDetailId(null)
  const openStartTest = (id) => setStartTestId(id)
  const closeStartTest = () => setStartTestId(null)

  return {
    loading,
    applicants: filtered,
    stages,
    statuses,
    query,
    setQuery,
    stage,
    setStage,
    status,
    setStatus,
    stats,
    detailId,
    openDetails,
    closeDetails,
    startTestId,
    openStartTest,
    closeStartTest,
  }
}
