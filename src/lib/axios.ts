import axios from 'axios'

const API_BASE_URL = 'https://api.escuelajs.co/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: inject Bearer token
api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('auth_tokens')
    if (tokens) {
      try {
        const parsed = JSON.parse(tokens) as { access_token: string }
        config.headers.Authorization = `Bearer ${parsed.access_token}`
      } catch {
        localStorage.removeItem('auth_tokens')
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor: handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const tokens = localStorage.getItem('auth_tokens')
        if (tokens) {
          const parsed = JSON.parse(tokens) as { refresh_token: string }
          const refreshResponse = await axios.post<{ access_token: string; refresh_token: string }>(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken: parsed.refresh_token },
          )

          localStorage.setItem('auth_tokens', JSON.stringify(refreshResponse.data))
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`
          return api(originalRequest)
        }
      } catch {
        localStorage.removeItem('auth_tokens')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default api
