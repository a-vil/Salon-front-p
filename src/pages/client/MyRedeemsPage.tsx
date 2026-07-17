import { useEffect, useState } from 'react'

import api from '../../api/client'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import type { Redeem } from '../../types/auth'

export function MyRedeemsPage() {
  const [redeems, setRedeems] = useState<Redeem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRedeems = async () => {
      try {
        setError(null)
        const response = await api.get<Redeem[]>('/canjes/mis-canjes')
        setRedeems(response.data)
      } catch {
        setError('No se pudieron cargar tus canjes.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchRedeems()
  }, [])

  return (
    <DashboardLayout
      role="cliente"
      clientName="Mis canjes"
    >
      {isLoading ? <div className="info-banner"><p>Cargando canjes...</p></div> : null}
      {error ? <div className="message error">{error}</div> : null}

      {!isLoading && !error ? (
        <section className="surface-panel">
          <div className="page-header">
            <div>
              <h2>Historial de canjes</h2>
              <p>{redeems.length} solicitudes visibles en tu cuenta.</p>
            </div>
          </div>

          {redeems.length > 0 ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Recompensa</th>
                    <th>Estado</th>
                    <th>Cantidad</th>
                    <th>Puntos usados</th>
                    <th>Saldo actual</th>
                  </tr>
                </thead>
                <tbody>
                  {redeems.map((redeem) => (
                    <tr key={redeem.id}>
                      <td data-label="Fecha">{new Date(redeem.fecha_canje).toLocaleString()}</td>
                      <td data-label="Recompensa">{redeem.recompensa_nombre}</td>
                      <td data-label="Estado">
                        <span
                          className={`status-pill ${
                            redeem.estado === 'confirmado'
                              ? 'success'
                              : redeem.estado === 'cancelado'
                                ? 'danger'
                                : ''
                          }`}
                        >
                          {redeem.estado}
                        </span>
                      </td>
                      <td data-label="Cantidad">{redeem.cantidad}</td>
                      <td data-label="Puntos usados">{redeem.puntos_usados}</td>
                      <td data-label="Saldo actual">{redeem.saldo_puntos_actual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <h3>Aun no has solicitado canjes</h3>
              <p>Cuando envies una solicitud desde recompensas, aparecera aqui con su estado.</p>
            </div>
          )}
        </section>
      ) : null}
    </DashboardLayout>
  )
}
