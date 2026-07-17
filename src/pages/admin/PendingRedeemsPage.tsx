import { useEffect, useState } from 'react'

import api from '../../api/client'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import type { Redeem } from '../../types/auth'

export function PendingRedeemsPage() {
  const [redeems, setRedeems] = useState<Redeem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRedeems = async () => {
    try {
      setError(null)
      const response = await api.get<Redeem[]>('/canjes?estado=pendiente')
      setRedeems(response.data)
    } catch {
      setError('No se pudieron cargar los canjes pendientes.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchRedeems()
  }, [])

  const handleAction = async (redeemId: number, action: 'confirmar' | 'cancelar') => {
    try {
      await api.patch(`/canjes/${redeemId}/${action}`)
      await fetchRedeems()
    } catch {
      setError(`No se pudo ${action} el canje.`)
    }
  }

  return (
    <DashboardLayout
      role="admin">
      {isLoading ? <div className="info-banner"><p>Cargando canjes...</p></div> : null}
      {error ? <div className="message error">{error}</div> : null}

      {!isLoading && !error ? (
        <section className="surface-panel">
          <div className="page-header">
            <div>
              <h2>Solicitudes pendientes</h2>
              <p>{redeems.length} canjes pendientes por revisar.</p>
            </div>
          </div>

          {redeems.length > 0 ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Cliente ID</th>
                    <th>Recompensa</th>
                    <th>Cantidad</th>
                    <th>Puntos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {redeems.map((redeem) => (
                    <tr key={redeem.id}>
                      <td data-label="Fecha">{new Date(redeem.fecha_canje).toLocaleString()}</td>
                      <td data-label="Cliente ID">{redeem.cliente_id}</td>
                      <td data-label="Recompensa">{redeem.recompensa_nombre}</td>
                      <td data-label="Cantidad">{redeem.cantidad}</td>
                      <td data-label="Puntos">{redeem.puntos_usados}</td>
                      <td data-label="Acciones">
                        <div className="inline-actions">
                          <button
                            type="button"
                            className="button-secondary"
                            onClick={() => void handleAction(redeem.id, 'confirmar')}
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            className="button-danger"
                            onClick={() => void handleAction(redeem.id, 'cancelar')}
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <h3>No hay canjes pendientes</h3>
              <p>Cuando un cliente solicite una recompensa, la veras aqui para decidirla.</p>
            </div>
          )}
        </section>
      ) : null}
    </DashboardLayout>
  )
}
