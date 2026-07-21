import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import api from '../../api/client'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import type { ClientPoints, Redeem, Reward } from '../../types/auth'

export function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [points, setPoints] = useState<ClientPoints | null>(null)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [hasPendingRedeem, setHasPendingRedeem] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setError(null)
        const [rewardsResponse, pointsResponse, redeemsResponse] = await Promise.all([
          api.get<Reward[]>('/recompensas'),
          api.get<ClientPoints>('/puntos/mis-puntos'),
          api.get<Redeem[]>('/canjes/mis-canjes'),
        ])
        setRewards(rewardsResponse.data)
        setPoints(pointsResponse.data)
        setHasPendingRedeem(redeemsResponse.data.some((r) => r.estado === 'pendiente'))
      } catch {
        setError('No se pudieron cargar las recompensas.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchRewards()
  }, [])

  const updateQuantity = (rewardId: number, value: string) => {
    const parsedValue = Number(value)
    setQuantities((current) => ({
      ...current,
      [rewardId]: Number.isNaN(parsedValue) || parsedValue < 1 ? 1 : parsedValue,
    }))
  }

  const changeQuantity = (rewardId: number, direction: -1 | 1) => {
    setQuantities((current) => {
      const nextValue = (current[rewardId] ?? 1) + direction
      return {
        ...current,
        [rewardId]: Math.max(1, nextValue),
      }
    })
  }

  const requestRedeem = async (rewardId: number) => {
    setIsRequesting(true)
    try {
      setError(null)
      await api.post('/canjes', {
        recompensa_id: rewardId,
        cantidad: quantities[rewardId] ?? 1,
      })
      toast.success('✓  Canje solicitado correctamente. Ahora espera la confirmacion del administrador.', {
        duration: 3500,
      })
      setHasPendingRedeem(true)
    } catch {
      setError('No se pudo solicitar el canje. Revisa tu saldo o si ya tienes un canje pendiente.')
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <DashboardLayout role="cliente" clientName="Recompensas disponibles">
      {isLoading ? <div className="info-banner"><p>Cargando recompensas...</p></div> : null}
      {error ? <div className="message error">{error}</div> : null}

      {!isLoading && !error ? (
        <section className="rewards-program">
          <header className="rewards-program-heading">
            <h2>Recompensas</h2>
          </header>

          <article className="rewards-balance-card">
            <div>
              <span>Total puntos acumulados</span>
              <strong>{(points?.saldo_puntos ?? 0).toLocaleString()}</strong>
              <small>pts</small>
              <p className="rewards-points-note">Los puntos se descuentan al confirmar el canje, no al solicitarlo.</p>
            </div>
            <div className="rewards-balance-mark" aria-hidden="true">MS</div>
          </article>

          {rewards.length === 0 ? (
            <section className="empty-state">
              <h3>No hay recompensas activas</h3>
              <p>Cuando el salon publique nuevas opciones apareceran aqui.</p>
            </section>
          ) : (
            <div className="rewards-grid">
              {rewards.map((reward) => (
                <article key={reward.id} className="reward-card">
                  <div className="reward-card-copy">
                    <h3>{reward.nombre}</h3>
                    <span className={'reward-state' + (!reward.activo ? ' inactive' : hasPendingRedeem ? ' waiting' : '')}>
                      {!reward.activo ? 'Inactiva' : hasPendingRedeem ? 'En espera' : 'Disponible'}
                    </span>
                    <p>{reward.descripcion ?? 'Sin descripcion disponible.'}</p>
                  </div>

                  <div className="reward-card-footer">
                    <div className="reward-cost">
                      <span>Cost</span>
                      <strong>{reward.puntos_requeridos} pts</strong>
                    </div>

                    <div className="reward-quantity" aria-label={`Cantidad para ${reward.nombre}`}>
                      <button type="button" onClick={() => changeQuantity(reward.id, -1)} disabled={(quantities[reward.id] ?? 1) <= 1}>
                        -
                      </button>
                      <input
                        id={`cantidad-${reward.id}`}
                        type="number"
                        min={1}
                        value={quantities[reward.id] ?? 1}
                        onChange={(event) => updateQuantity(reward.id, event.target.value)}
                        aria-label={`Cantidad para ${reward.nombre}`}
                      />
                      <button type="button" onClick={() => changeQuantity(reward.id, 1)}>
                        +
                      </button>
                    </div>
                  </div>

                  <button type="button" className="reward-redeem-button" disabled={!reward.activo || hasPendingRedeem || isRequesting} onClick={() => void requestRedeem(reward.id)}>
                    {isRequesting ? 'Solicitando...' : hasPendingRedeem ? 'Solicitud pendiente' : 'Canjear recompensa'}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </DashboardLayout>
  )
}
