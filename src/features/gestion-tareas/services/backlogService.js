import { api, ApiError } from '../../../shared/services/api'

export const listBacklog = async () => {
  try {
    return await api.get('/api/backlog/backlog/')
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error listando backlog', 0, null)
  }
}

export const getBacklogItem = async (id) => {
  try {
    return await api.get(`/api/backlog/backlog/${id}/`)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error obteniendo ítem', 0, null)
  }
}

export const createBacklogItem = async (payload) => {
  try {
    return await api.post('/api/backlog/backlog/', payload)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error creando ítem', 0, null)
  }
}

export const updateBacklogItem = async (id, payload) => {
  try {
    return await api.put(`/api/backlog/backlog/${id}/`, payload)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error actualizando ítem', 0, null)
  }
}

export const patchBacklogItem = async (id, payload) => {
  try {
    return await api.patch(`/api/backlog/backlog/${id}/`, payload)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error actualizando parcialmente ítem', 0, null)
  }
}

export const deleteBacklogItem = async (id) => {
  try {
    return await api.delete(`/api/backlog/backlog/${id}/`)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error eliminando ítem', 0, null)
  }
}

export const assignBacklogItemToSprint = async (id, payload) => {
  try {
    return await api.post(`/api/backlog/backlog/${id}/assign_to_sprint/`, payload)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error asignando ítem a sprint', 0, null)
  }
}

