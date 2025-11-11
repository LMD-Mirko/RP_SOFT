import { useEffect, useState } from 'react'
import { changePassword, getProfile, updateProfile } from '../services/profile.service'

export function useUserProfile() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const p = await getProfile()
    setProfile(p)
    setLoading(false)
  }

  const save = async (data) => {
    setSaving(true)
    const updated = await updateProfile(data)
    setProfile(updated)
    setSaving(false)
    setEditing(false)
  }

  const updatePassword = async (payload) => {
    return changePassword(payload)
  }

  useEffect(() => {
    load()
  }, [])

  return { loading, profile, editing, setEditing, save, saving, reload: load, updatePassword }
}
