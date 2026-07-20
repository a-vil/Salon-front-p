import { useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/useAuth'
import type { UserRole } from '../types/auth'

interface DashboardLayoutProps {
  role: UserRole
  children: ReactNode
  actions?: ReactNode
  clientName?: string
}

interface NavItem {
  to: string
  label: string
  detail: string
  icon: string
}

const adminNav: NavItem[] = [
  { to: '/admin', label: 'Resumen', detail: 'Panel general', icon: 'A' },
  { to: '/admin/clientes', label: 'Clientes', detail: 'Base activa', icon: 'C' },
  { to: '/admin/pagos', label: 'Pagos', detail: 'Sumar puntos', icon: 'P' },
  { to: '/admin/movimientos', label: 'Movimientos', detail: 'Auditoria', icon: 'M' },
  { to: '/admin/recompensas', label: 'Recompensas', detail: 'Catalogo', icon: 'R' },
  { to: '/admin/canjes', label: 'Canjes', detail: 'Pendientes', icon: 'K' },
]

const clientNav: NavItem[] = [
  { to: '/cliente', label: 'Cuenta', detail: '', icon: '◫' },
  { to: '/cliente/movimientos', label: 'Movimientos', detail: '', icon: '◎' },
  { to: '/cliente/recompensas', label: 'Recompensas', detail: '', icon: '◌' },
  { to: '/cliente/canjes', label: 'Canjes', detail: '', icon: '◇' },
]

export function DashboardLayout({ role, children, actions, clientName }: DashboardLayoutProps) {
  const navigate = useNavigate()
  const { logout, clientDisplayName } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navItems = role === 'admin' ? adminNav : clientNav
  const sidebarName = role === 'cliente' ? clientDisplayName : (clientName ?? 'Admin')

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-frame">
      <header className="mobile-topbar">
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setIsSidebarOpen((current) => !current)}
          aria-label={isSidebarOpen ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={isSidebarOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="mobile-topbar-brand">
          <span>MS</span>
          <strong>Fide Salon</strong>
        </div>
      </header>

      <button
        type="button"
        className={`sidebar-backdrop${isSidebarOpen ? ' open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-label="Cerrar menu"
      />

      <div className="dashboard-shell">
        <aside className={`sidebar${isSidebarOpen ? ' open' : ''}`}>
          <div className="brand-mark">MS</div>
          <h1>Fide Salon</h1>
          <p>
            {role === 'admin'
              ? 'Control operativo del programa de fidelizacion del salon.'
              : 'Tu espacio para revisar puntos, recompensas y solicitudes de canje.'}
          </p>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin' || item.to === '/cliente'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="nav-link-main">
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-account">
              <div className="sidebar-account-info">
                <strong>{sidebarName}</strong>
              </div>
              <button type="button" className="sidebar-action sidebar-settings">
                <span className="nav-link-main">
                  <span className="nav-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </span>
                  <span className="nav-text">Configuracion</span>
                </span>
              </button>

              <button type="button" className="sidebar-action sidebar-logout" onClick={handleLogout}>
                <span className="nav-link-main">
                  <span className="nav-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <path d="M16 17l5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                  </span>
                  <span className="nav-text">Cerrar sesion</span>
                </span>
              </button>
            </div>
          </div>
        </aside>

        <div className="content-column">
          {actions ? <div className="surface-panel">{actions}</div> : null}
          {children}
        </div>
      </div>
    </div>
  )
}
