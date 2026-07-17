import { createContext } from 'react'

import type { ClientProfile, LoginPayload, RegisterPayload, User } from '../types/auth'

export interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  clientProfile: ClientProfile | null
  clientDisplayName: string
  login: (payload: LoginPayload) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => void
  refreshMe: () => Promise<User | null>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
