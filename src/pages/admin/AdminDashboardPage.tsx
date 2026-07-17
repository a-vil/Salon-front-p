import { Link } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { DashboardLayout } from '../../layouts/DashboardLayout'

export function AdminDashboardPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout
      role="admin"
    >
      <section className="admin-summary-hero">
        <div className="admin-summary-copy">
          <span className="admin-overline">Resumen administrativo</span>
          <h2>Operacion activa</h2>
          <p>
            Gestiona pagos, clientes, movimientos y canjes desde un panel compacto conectado al backend.
          </p>
        </div>

        <div className="admin-session-card">
          <span>Sesion activa</span>
          <strong>{user?.correo ?? 'Administrador'}</strong>
        </div>
      </section>

      <section className="admin-action-grid">
        <article className="admin-action-card accent">
          <span>01</span>
          <h3>Registrar pago</h3>
          <p>Convierte una compra del cliente en puntos acumulados de forma inmediata.</p>
          <Link to="/admin/pagos">Ir al registro</Link>
        </article>
        <article className="admin-action-card">
          <span>02</span>
          <h3>Clientes</h3>
          <p>Consulta la base activa y revisa los datos de cada cliente registrado.</p>
          <Link to="/admin/clientes">Ver clientes</Link>
        </article>
        <article className="admin-action-card">
          <span>03</span>
          <h3>Movimientos</h3>
          <p>Audita acumulaciones y canjes con visibilidad global del sistema.</p>
          <Link to="/admin/movimientos">Revisar historial</Link>
        </article>
        <article className="admin-action-card warning">
          <span>04</span>
          <h3>Canjes pendientes</h3>
          <p>Confirma o cancela solicitudes cuando el cliente ya este frente al negocio.</p>
          <Link to="/admin/canjes">Gestionar canjes</Link>
        </article>
      </section>
    </DashboardLayout>
  )
}
