import axios from 'axios'
import { store } from '../store'
import { sessionExpired } from '../store/slices/authSlice'
import { showAlert } from '../store/slices/uiSlice'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.e-grcp.internal/v1'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request Interceptor — attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth?.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error

    if (!response) {
      // Network error
      store.dispatch(showAlert({
        type: 'error',
        message: 'Network error. Please check your connection.',
      }))
      return Promise.reject(new Error('Network Error'))
    }

    const { status, data } = response

    switch (status) {
      case 401:
        store.dispatch(sessionExpired())
        return Promise.reject(new Error('Session expired. Please log in again.'))

      case 403:
        return Promise.reject(new Error('Access denied. You do not have permission.'))

      case 404:
        return Promise.reject(new Error('Resource not found.'))

      case 422:
        return Promise.reject(new Error(data?.message || 'Validation failed.'))

      case 429:
        return Promise.reject(new Error('Too many requests. Please try again later.'))

      case 500:
      case 502:
      case 503:
        store.dispatch(showAlert({
          type: 'error',
          message: 'Server error. Our team has been notified.',
        }))
        return Promise.reject(new Error('Server error. Please try again.'))

      default:
        return Promise.reject(new Error(data?.message || 'An unexpected error occurred.'))
    }
  }
)

export default apiClient
