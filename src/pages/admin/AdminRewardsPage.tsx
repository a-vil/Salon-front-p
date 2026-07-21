import { useEffect, useState } from 'react'

import api from '../../api/client'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import type { Reward } from '../../types/auth'

export function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<number | null>(null)

  const fetchRewards = async () => {
    try {
      setError(null)
      const response = await api.get<Reward[]>('/recompensas?incluir_inactivas=true')
      setRewards(response.data)
    } catch {
      setError('No se pudieron cargar las recompensas.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchRewards()
  }, [])

  const toggleReward = async (reward: Reward) => {
    setProcessingId(reward.id)
    try {
      const endpoint = reward.activo ? `/recompensas/${reward.id}/desactivar` : `/recompensas/${reward.id}/activar`
      await api.patch(endpoint)
      await fetchRewards()
    } catch {
      setError('No se pudo actualizar el estado de la recompensa.')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <DashboardLayout role="admin">
      {isLoading ? <div className="info-banner"><p>Cargando recompensas...</p></div> : null}
      {error ? <div className="message error">{error}</div> : null}

      {!isLoading && !error ? (
        <section className="admin-rewards-panel">
          <header className="admin-rewards-header">
            <h2>Recompensas</h2>
            <p>Gestiona el estado de las recompensas disponibles para los clientes.</p>
          </header>

          {rewards.length === 0 ? (
            <div className="empty-state">
              <h3>No hay recompensas registradas</h3>
              <p>Cuando agregues recompensas al sistema, apareceran aqui para su gestion.</p>
            </div>
          ) : null}

          <div className="admin-rewards-grid">
            {rewards.map((reward) => (
              <article key={reward.id} className="admin-reward-card">
                <div className="inline-actions">
                  <span className={`status-pill ${reward.activo ? 'success' : 'danger'}`}>{reward.activo ? 'Activa' : 'Inactiva'}</span>
                  <span className="status-pill">{reward.puntos_requeridos} pts</span>
                </div>
                <h3>{reward.nombre}</h3>
                <p>{reward.descripcion ?? 'Sin descripcion.'}</p>
                <button type="button" className={reward.activo ? 'button-danger' : 'button-secondary'} disabled={processingId === reward.id} onClick={() => void toggleReward(reward)}>
                  {processingId === reward.id ? 'Procesando...' : reward.activo ? 'Desactivar' : 'Activar'}
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </DashboardLayout>
  )
}
