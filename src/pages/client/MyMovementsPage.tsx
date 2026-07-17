import { useEffect, useState } from 'react'

import api from '../../api/client'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import type { PointsHistory } from '../../types/auth'

export function MyMovementsPage() {
  const [history, setHistory] = useState<PointsHistory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setError(null)
        const response = await api.get<PointsHistory>('/puntos/mis-movimientos')
        setHistory(response.data)
      } catch {
        setError('No se pudo cargar tu historial de movimientos.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchHistory()
  }, [])

  return (
    <DashboardLayout
      role="cliente"
      clientName="Mis movimientos"
    >
      {isLoading ? <div className="info-banner"><p>Cargando movimientos...</p></div> : null}
      {error ? <div className="message error">{error}</div> : null}

      {history ? (
        <>
          <section className="movement-ledger">
            <header className="movement-ledger-heading">
              <h2>Historial de movimientos</h2>
            </header>

            <article className="movement-balance-card">
              <div>
                <span>Total puntos acumulados</span>
                <strong>{history.saldo_puntos.toLocaleString()}</strong>
                <small>pts</small>
              </div>
              <div className="movement-balance-mark" aria-hidden="true">MS</div>
            </article>

            {history.movimientos.length > 0 ? (
              <section className="movement-log-card">
                <div className="movement-log-head">
                  <div>
                    <h3>Registro de actividad</h3>
                  </div>
                </div>

                <div className="movement-log-table">
                  <div className="movement-log-row movement-log-row-head">
                    <span>Fecha</span>
                    <span>Servicio</span>
                    <span>Valor</span>
                    <span>Movimiento</span>
                  </div>

                  {history.movimientos.map((movement) => (
                    <article key={movement.id} className="movement-log-row">
                      <time>{new Date(movement.fecha_movimiento).toLocaleDateString()}</time>

                      <div className="movement-log-service">
                        <strong>{movement.descripcion ?? 'Movimiento registrado'}</strong>
                      </div>

                      <span className="movement-log-value">
                        {movement.monto_compra ? `S/ ${movement.monto_compra}` : 'Sin monto'}
                      </span>

                      <strong className={movement.tipo === 'canje' ? 'movement-points danger' : 'movement-points'}>
                        {movement.puntos > 0 ? `+${movement.puntos}` : movement.puntos} pts
                      </strong>
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <section className="empty-state">
                <h3>Aun no hay movimientos</h3>
                <p>Cuando registres pagos o confirmes un canje, tu historial empezara a verse aqui.</p>
              </section>
            )}
          </section>
        </>
      ) : null}
    </DashboardLayout>
  )
}
