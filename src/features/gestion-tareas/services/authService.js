import { api, ApiError } from '../../../shared/services/api'

export const registerUser = async (payload) => {
  try {
    return await api.post('/api/auth/register/', payload)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(error.message || 'Error registrando usuario', 0, null)
  }
}
