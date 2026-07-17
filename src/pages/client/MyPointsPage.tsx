import { useEffect, useState } from 'react'

import api from '../../api/client'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import type { ClientPoints } from '../../types/auth'

export function MyPointsPage() {
  const [data, setData] = useState<ClientPoints | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        setError(null)
        const response = await api.get<ClientPoints>('/puntos/mis-puntos')
        setData(response.data)
      } catch {
        setError('No se pudieron cargar tus puntos.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchPoints()
  }, [])

  return (
    <DashboardLayout role="cliente" clientName="Mis puntos">
      {isLoading ? <div className="info-banner"><p>Cargando puntos...</p></div> : null}
      {error ? <div className="message error">{error}</div> : null}

      {data ? (
        <section className="summary-grid">
          <article className="metric-card">
            <span>Saldo disponible</span>
            <strong>{data.saldo_puntos}</strong>
            <p>Puntos listos para acumulacion o canje.</p>
          </article>
          <article className="metric-card">
            <span>Cliente</span>
            <strong>{`${data.nombre ?? 'Cliente'} ${data.apellido ?? ''}`.trim()}</strong>
            <p>Perfil principal vinculado a esta cuenta.</p>
          </article>
          <article className="metric-card">
            <span>Estado</span>
            <strong>{data.activo_cliente ? 'Activo' : 'Inactivo'}</strong>
            <p>La cuenta de puntos figura como {data.estado_cuenta.toLowerCase()}.</p>
          </article>
        </section>
      ) : null}
    </DashboardLayout>
  )
}
