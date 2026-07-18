import { useContext } from 'react'

import { AuthContext } from './AuthContextDef'
import type { AuthContextValue } from './AuthContextDef'

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}
