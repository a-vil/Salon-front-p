export type UserRole = 'admin' | 'cliente'

export interface User {
  id: number
  correo: string | null
  celular: string | null
  rol: UserRole
  activo: boolean
  cliente_id: number | null
  created_at: string
  updated_at: string
}

export interface LoginPayload {
  identificador: string
  password: string
}

export interface RegisterPayload {
  nombre: string
  apellido: string
  fecha_naci: string
  password: string
  correo?: string
  celular?: string
  dni?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}
export interface ClientPoints {
  cliente_id: number
  nombre: string | null
  apellido: string | null
  activo_cliente: boolean
  fecha_desactivacion: string | null
  saldo_puntos: number
  estado_cuenta: string
}
export interface PointMovement {
  id: number
  tipo: string
  puntos: number
  monto_compra: number | null
  descripcion: string | null
  fecha_movimiento: string
}

export interface PointsHistory {
  cliente_id: number
  activo_cliente: boolean
  fecha_desactivacion: string | null
  saldo_puntos: number
  movimientos: PointMovement[]
}
export interface Reward {
  id: number
  nombre: string
  descripcion: string | null
  puntos_requeridos: number
  activo: boolean
}
export interface Redeem {
  id: number
  cliente_id: number
  recompensa_id: number
  recompensa_nombre: string
  cantidad: number
  puntos_usados: number
  saldo_puntos_actual: number
  fecha_canje: string
  estado: string
}
export interface Client {
  id: number
  nombre: string | null
  apellido: string | null
  dni: string | null
  celular: string | null
  correo: string | null
  fecha_naci: string | null
  activo: boolean
  fecha_desactivacion: string | null
  created_at: string
  updated_at: string
}
export interface AdminMovement {
  id: number
  cliente_id: number
  nombre: string | null
  apellido: string | null
  tipo: string
  puntos: number
  monto_compra: number | null
  descripcion: string | null
  fecha_movimiento: string
}

export interface GlobalHistory {
  movimientos: AdminMovement[]
}

export interface ClientProfile {
  id: number
  nombre: string | null
  apellido: string | null
  dni: string | null
  celular: string | null
  correo: string | null
  fecha_naci: string | null
  activo: boolean
  fecha_desactivacion: string | null
  created_at: string
  updated_at: string
}