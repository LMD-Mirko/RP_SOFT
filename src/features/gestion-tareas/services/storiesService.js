import { api, ApiError } from '../../../shared/services/api'

export const listStories = async () => {
  try {
    return await api.get('/api/historias/stories/')
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error listando historias', 0, null)
  }
}

export const getStory = async (id) => {
  try {
    return await api.get(`/api/historias/stories/${id}/`)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error obteniendo historia', 0, null)
  }
}

export const createStory = async (payload) => {
  try {
    return await api.post('/api/historias/stories/', payload)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error creando historia', 0, null)
  }
}

export const updateStory = async (id, payload) => {
  try {
    return await api.put(`/api/historias/stories/${id}/`, payload)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error actualizando historia', 0, null)
  }
}

export const patchStory = async (id, payload) => {
  try {
    return await api.patch(`/api/historias/stories/${id}/`, payload)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error actualizando parcialmente historia', 0, null)
  }
}

export const deleteStory = async (id) => {
  try {
    return await api.delete(`/api/historias/stories/${id}/`)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error eliminando historia', 0, null)
  }
}

export const closeStory = async (id) => {
  try {
    return await api.post(`/api/historias/stories/${id}/close/`)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error cerrando historia', 0, null)
  }
}

export const estimateStory = async (id, points) => {
  try {
    return await api.post(`/api/historias/stories/${id}/estimate/`, { points })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error estimando historia', 0, null)
  }
}

export const listStoriesByBacklog = async (backlogId) => {
  try {
    return await api.get(`/api/historias/stories/by-backlog/`, { params: { backlog_id: backlogId } })
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error listando historias por backlog', 0, null)
  }
}

