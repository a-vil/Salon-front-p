import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import api from '../api/client'
import { TOKEN_STORAGE_KEY } from '../lib/constants'
import type { AuthResponse, ClientProfile, LoginPayload, RegisterPayload, User } from '../types/auth'
import { AuthContext } from './AuthContext'
import type { AuthContextValue } from './AuthContext'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY))
  const [isLoading, setIsLoading] = useState(true)
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null)

  const refreshClientProfile = useCallback(async (currentUser: User) => {
  if (currentUser.rol !== 'cliente') {
    setClientProfile(null)
    return
  }
  const response = await api.get<ClientProfile>('/clientes/mi-cuenta')
  setClientProfile(response.data)
}, [])

  const applyAuthResponse = useCallback(async (data: AuthResponse) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token)
    setToken(data.access_token)
    setUser(data.user)
    await refreshClientProfile(data.user)
    return data.user
  }, [refreshClientProfile])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const refreshMe = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)

    if (!storedToken) {
      setToken(null)
      setUser(null)
      return null
    }

    try {
      setToken(storedToken)
      const { data } = await api.get<User>('/auth/me')
      setUser(data)
      await refreshClientProfile(data)
      return data
    } catch {
      logout()
      return null
    }
  }, [logout, refreshClientProfile])

  const login = useCallback(async (payload: LoginPayload) => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload)
    return applyAuthResponse(data)
  }, [applyAuthResponse])

  const register = useCallback(async (payload: RegisterPayload) => {
    const { data } = await api.post<AuthResponse>('/auth/register', payload)
    return applyAuthResponse(data)
  }, [applyAuthResponse])

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await refreshMe()
      } finally {
        setIsLoading(false)
      }
    }

    void bootstrap()
  }, [refreshMe])

  const clientDisplayName = clientProfile
  ? `${clientProfile.nombre ?? 'Cliente'} ${clientProfile.apellido ?? ''}`.trim()
  : 'Cliente'


  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      clientProfile,
      clientDisplayName,
      login,
      register,
      logout,
      refreshMe,      
    }),
    [user, token, isLoading, clientProfile, clientDisplayName, login, register, logout, refreshMe],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
