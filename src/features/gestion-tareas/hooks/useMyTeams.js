import { useEffect, useState } from 'react'
import { getMyTeams } from '../services/my-teams.service'

export function useMyTeams() {
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState([])

  const load = async () => {
    setLoading(true)
    const data = await getMyTeams()
    setTeams(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  return { loading, teams, reload: load }
}
