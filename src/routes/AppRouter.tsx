import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { useAuth } from '../context/useAuth'
import { AccumulatePointsPage } from '../pages/admin/AccumulatePointsPage'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminRewardsPage } from '../pages/admin/AdminRewardsPage'
import { ClientsPage } from '../pages/admin/ClientsPage'
import { GlobalMovementsPage } from '../pages/admin/GlobalMovementsPage'
import { PendingRedeemsPage } from '../pages/admin/PendingRedeemsPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ClientDashboardPage } from '../pages/client/ClientDashboardPage'
import { MyMovementsPage } from '../pages/client/MyMovementsPage'
import { MyRedeemsPage } from '../pages/client/MyRedeemsPage'
import { RewardsPage } from '../pages/client/RewardsPage'
import type { UserRole } from '../types/auth'

function LoadingState({ title, description }: { title: string; description: string }) {
  return (
    <div className="loading-shell">
      <div className="loading-card">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

function PublicOnlyRoute() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <LoadingState title="Cargando" description="Validando tu sesion actual..." />
  }

  if (isAuthenticated && user) {
    return <Navigate to={user.rol === 'admin' ? '/admin' : '/cliente'} replace />
  }

  return <Outlet />
}

function ProtectedRoute({ role }: { role?: UserRole }) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <LoadingState title="Cargando" description="Preparando tu panel..." />
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.rol !== role) {
    return <Navigate to={user.rol === 'admin' ? '/admin' : '/cliente'} replace />
  }

  return <Outlet />
}

function HomeRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <LoadingState title="Cargando" description="Abriendo tu espacio de trabajo..." />
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={user.rol === 'admin' ? '/admin' : '/cliente'} replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/clientes" element={<ClientsPage />} />
        <Route path="/admin/movimientos" element={<GlobalMovementsPage />} />
        <Route path="/admin/recompensas" element={<AdminRewardsPage />} />
        <Route path="/admin/canjes" element={<PendingRedeemsPage />} />
        <Route path="/admin/pagos" element={<AccumulatePointsPage />} />
      </Route>

      <Route element={<ProtectedRoute role="cliente" />}>
        <Route path="/cliente" element={<ClientDashboardPage />} />
        <Route path="/cliente/puntos" element={<Navigate to="/cliente" replace />} />
        <Route path="/cliente/movimientos" element={<MyMovementsPage />} />
        <Route path="/cliente/recompensas" element={<RewardsPage />} />
        <Route path="/cliente/canjes" element={<MyRedeemsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
