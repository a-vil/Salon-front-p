import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../../api/client'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import type { ClientPoints, PointsHistory, PointMovement } from '../../types/auth'

function formatMovementLabel(movement: PointMovement) {
  if (movement.tipo === 'canje') {
    return movement.descripcion ?? 'Canje confirmado'
  }

  return movement.descripcion ?? 'Acumulacion registrada'
}

export function ClientDashboardPage() {
  const [points, setPoints] = useState<ClientPoints | null>(null)
  const [history, setHistory] = useState<PointsHistory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setError(null)
        const [pointsResponse, historyResponse] = await Promise.all([
          api.get<ClientPoints>('/puntos/mis-puntos'),
          api.get<PointsHistory>('/puntos/mis-movimientos'),
        ])
        setPoints(pointsResponse.data)
        setHistory(historyResponse.data)
      } catch {
        setError('No se pudo cargar tu panel de cliente.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchDashboard()
  }, [])

  const recentMovements = useMemo(() => history?.movimientos.slice(0, 3) ?? [], [history])

  const currentPoints = points?.saldo_puntos ?? 0
  const nextTarget = currentPoints === 0 ? 50 : Math.ceil(currentPoints / 50) * 50
  const targetValue = nextTarget === currentPoints ? nextTarget + 50 : nextTarget
  const remainingPoints = Math.max(targetValue - currentPoints, 0)
  const progress = targetValue > 0 ? Math.min((currentPoints / targetValue) * 100, 100) : 0

  return (
    <DashboardLayout
      role="cliente"
      clientName={`${points?.nombre ?? 'Cliente'} ${points?.apellido ?? ''}`.trim()}
    >
      {isLoading ? <div className="info-banner"><p>Cargando panel...</p></div> : null}
      {error ? <div className="message error">{error}</div> : null}

      {!isLoading && !error && points && history ? (
        <>
          <section className="loyalty-hero-grid">
            <article className="loyalty-standing-card">
              <div className="loyalty-standing-copy">
                <span className="status-pill">Saldo actual</span>
                <div className="loyalty-standing-value">
                  <strong>{currentPoints}</strong>
                  <span>pts</span>
                </div>
              </div>

              <div className="loyalty-standing-badge" aria-hidden="true">
                <span>?</span>
              </div>

              <div className="loyalty-progress-block">
                <div className="loyalty-progress-head">
                  <span>Progreso de cuenta</span>
                  <strong>{remainingPoints} pts restantes</strong>
                </div>
                <div className="loyalty-progress-track">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            </article>

            <div className="loyalty-side-metrics">
              <article className="loyalty-side-card">
                <span>Movimientos registrados</span>
                <strong>{history.movimientos.length}</strong>
                <p>Actividad acumulada en tu historial.</p>
              </article>

              <article className="loyalty-side-card accent">
                <span>Estado de cuenta</span>
                <strong>{points.activo_cliente ? 'Activa' : 'Inactiva'}</strong>
                <p>Tu cuenta figura como {points.estado_cuenta.toLowerCase()}.</p>
              </article>
            </div>
          </section>

          <section className="surface-panel">
            <div className="page-header loyalty-page-header">
              <div>
                <h2>Actividad reciente</h2>
                <p>Revisa rapidamente tus ultimos movimientos sin salir del panel principal.</p>
              </div>
              <Link className="inline-link" to="/cliente/movimientos">Ver historial completo</Link>
            </div>

            {recentMovements.length > 0 ? (
              <div className="visit-history-list">
                {recentMovements.map((movement) => (
                  <article key={movement.id} className="visit-history-item">
                    <div className="visit-history-icon">{movement.tipo === 'canje' ? '↻' : '↑'}</div>
                    <div className="visit-history-copy">
                      <h3>{formatMovementLabel(movement)}</h3>
                      <p>
                        {new Date(movement.fecha_movimiento).toLocaleDateString()} · {movement.tipo === 'canje' ? 'Canje confirmado' : 'Puntos acumulados'}
                      </p>
                    </div>
                    <div className="visit-history-meta">
                      <span>{movement.monto_compra ? `S/ ${movement.monto_compra}` : 'Sin monto'}</span>
                      <strong>{movement.puntos > 0 ? `+${movement.puntos}` : movement.puntos} pts</strong>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <section className="empty-state">
                <h3>Aun no hay movimientos</h3>
                <p>Cuando registres pagos o confirmes un canje, aqui veras tu actividad mas reciente.</p>
              </section>
            )}
          </section>
        </>
      ) : null}
    </DashboardLayout>
  )
}
