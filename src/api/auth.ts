import api from '../lib/axios'
import type { AuthTokens, User } from '../types'

export async function login(email: string, password: string): Promise<AuthTokens> {
  const response = await api.post<AuthTokens>('/auth/login', { email, password })
  return response.data
}

export async function getProfile(): Promise<User> {
  const response = await api.get<User>('/auth/profile')
  return response.data
}

export async function refreshToken(token: string): Promise<AuthTokens> {
  const response = await api.post<AuthTokens>('/auth/refresh-token', {
    refreshToken: token,
  })
  return response.data
}
