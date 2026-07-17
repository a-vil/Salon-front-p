import axios from 'axios'
import { useEffect, useState } from 'react'

import api from '../../api/client'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import type { GlobalHistory } from '../../types/auth'

interface DeleteMovementResponse {
  movimiento_id: number
  cliente_id: number
  saldo_puntos: number
  detail: string
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') {
      return detail
    }
  }

  return fallback
}

export function GlobalMovementsPage() {
  const [history, setHistory] = useState<GlobalHistory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRevertingId, setIsRevertingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fetchHistory = async () => {
    try {
      setError(null)
      const response = await api.get<GlobalHistory>('/puntos/movimientos')
      setHistory(response.data)
    } catch {
      setError('No se pudo cargar el historial global.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchHistory()
  }, [])

  const handleRevertMovement = async (movementId: number) => {
    const confirmed = window.confirm('¿Seguro que quieres revertir este movimiento? Esta accion descontara los puntos acumulados.')
    if (!confirmed) {
      return
    }

    setError(null)
    setSuccessMessage(null)
    setIsRevertingId(movementId)

    try {
      const response = await api.delete<DeleteMovementResponse>(`/puntos/movimientos/${movementId}`)
      setSuccessMessage(response.data.detail)
      await fetchHistory()
    } catch (error) {
      setError(getErrorMessage(error, 'No se pudo revertir el movimiento.'))
    } finally {
      setIsRevertingId(null)
    }
  }

  return (
    <DashboardLayout role="admin">
      {isLoading ? <div className="info-banner"><p>Cargando movimientos...</p></div> : null}
      {error ? <div className="message error">{error}</div> : null}
      {successMessage ? <div className="message success">{successMessage}</div> : null}

      {history ? (
        <section className="surface-panel">
          <div className="page-header">
            <div>
              <h2>Historial del sistema</h2>
              <p>{history.movimientos.length} movimientos visibles en esta consulta.</p>
            </div>
          </div>

          {history.movimientos.length > 0 ? (
            <>
              <div className="table-wrap admin-movements-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Tipo</th>
                      <th>Puntos</th>
                      <th>Monto</th>
                      <th>Descripcion</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.movimientos.map((movement) => (
                      <tr key={movement.id}>
                        <td data-label="Cliente">
                          <strong>{`${movement.nombre ?? 'Cliente'} ${movement.apellido ?? ''}`.trim()}</strong>
                          <div className="list-meta">ID {movement.cliente_id}</div>
                        </td>
                        <td data-label="Tipo">{movement.tipo}</td>
                        <td data-label="Puntos">{movement.puntos}</td>
                        <td data-label="Monto">{movement.monto_compra ?? 'No aplica'}</td>
                        <td data-label="Descripcion">{movement.descripcion ?? 'Sin descripcion'}</td>
                        <td data-label="Fecha">{new Date(movement.fecha_movimiento).toLocaleString()}</td>
                        <td data-label="Acciones">
                          {movement.tipo === 'acumulacion' ? (
                            <button
                              type="button"
                              className="button-danger"
                              onClick={() => void handleRevertMovement(movement.id)}
                              disabled={isRevertingId === movement.id}
                            >
                              {isRevertingId === movement.id ? 'Revirtiendo...' : 'Revertir movimiento'}
                            </button>
                          ) : (
                            <span className="list-meta">No disponible</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-mobile-movement-list">
                {history.movimientos.map((movement) => (
                  <article key={movement.id} className="admin-mobile-movement-card">
                    <div className="admin-mobile-movement-head">
                      <div>
                        <h3>{`${movement.nombre ?? 'Cliente'} ${movement.apellido ?? ''}`.trim()}</h3>
                        <p>ID {movement.cliente_id} · {movement.tipo}</p>
                      </div>
                      <time>{new Date(movement.fecha_movimiento).toLocaleDateString()}</time>
                    </div>

                    <div className="admin-mobile-movement-meta">
                      <strong>{movement.puntos > 0 ? `+${movement.puntos}` : movement.puntos} pts</strong>
                      <span>{movement.monto_compra ? `S/ ${movement.monto_compra}` : 'Sin monto'}</span>
                    </div>

                    <p className="admin-mobile-movement-description">
                      {movement.descripcion ?? 'Sin descripcion'}
                    </p>

                    {movement.tipo === 'acumulacion' ? (
                      <button
                        type="button"
                        className="button-danger"
                        onClick={() => void handleRevertMovement(movement.id)}
                        disabled={isRevertingId === movement.id}
                      >
                        {isRevertingId === movement.id ? 'Revirtiendo...' : 'Revertir'}
                      </button>
                    ) : (
                      <span className="list-meta">Accion no disponible</span>
                    )}
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h3>No hay movimientos registrados</h3>
              <p>El historial global se mostrara aqui cuando existan acumulaciones o canjes confirmados.</p>
            </div>
          )}
        </section>
      ) : null}
    </DashboardLayout>
  )
}
