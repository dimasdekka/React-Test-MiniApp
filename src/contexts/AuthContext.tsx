import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { login as apiLogin, getProfile } from '../api/auth'
import type { User, AuthTokens } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKENS_KEY = 'auth_tokens'
const USER_KEY = 'auth_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_KEY)
    if (saved) {
      try {
        return JSON.parse(saved) as User
      } catch {
        return null
      }
    }
    return null
  })
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = user !== null

  const checkAuth = useCallback(async () => {
    const tokens = localStorage.getItem(TOKENS_KEY)
    if (!tokens) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const profile = await getProfile()
      setUser(profile)
      localStorage.setItem(USER_KEY, JSON.stringify(profile))
    } catch {
      setUser(null)
      localStorage.removeItem(TOKENS_KEY)
      localStorage.removeItem(USER_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  const login = async (email: string, password: string) => {
    const tokens: AuthTokens = await apiLogin(email, password)
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))

    const profile = await getProfile()
    setUser(profile)
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(TOKENS_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider')
  }
  return context
}
