import { api, ApiError } from '../../../shared/services/api'

export const listSprints = async () => {
  try {
    return await api.get('/api/sprints/')
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error listando sprints', 0, null)
  }
}

export const getSprint = async (id) => {
  try {
    return await api.get(`/api/sprints/${id}/`)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error obteniendo sprint', 0, null)
  }
}

export const createSprint = async (payload) => {
  try {
    return await api.post('/api/sprints/', payload)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error creando sprint', 0, null)
  }
}

export const updateSprint = async (id, payload) => {
  try {
    return await api.put(`/api/sprints/${id}/`, payload)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error actualizando sprint', 0, null)
  }
}

export const patchSprint = async (id, payload) => {
  try {
    return await api.patch(`/api/sprints/${id}/`, payload)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error actualizando parcialmente sprint', 0, null)
  }
}

export const deleteSprint = async (id) => {
  try {
    return await api.delete(`/api/sprints/${id}/`)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error eliminando sprint', 0, null)
  }
}

export const addItemToSprint = async (id, payload) => {
  try {
    return await api.post(`/api/sprints/${id}/add_item/`, payload)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error agregando ítem al sprint', 0, null)
  }
}

export const closeSprint = async (id) => {
  try {
    return await api.post(`/api/sprints/${id}/close/`)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error cerrando sprint', 0, null)
  }
}

export const listSprintTasks = async () => {
  try {
    return await api.get('/api/sprint-tasks/')
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error listando tareas de sprint', 0, null)
  }
}

