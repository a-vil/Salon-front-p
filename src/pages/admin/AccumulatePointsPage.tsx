import axios from 'axios'
import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'

import api from '../../api/client'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import type { Client } from '../../types/auth'

interface AccumulateResponse {
  movimiento_id: number
  cliente_id: number
  puntos_ganados: number
  saldo_puntos: number
  monto_compra: number
  descripcion: string | null
}

interface DeleteMovementResponse {
  movimiento_id: number
  cliente_id: number
  saldo_puntos: number
  detail: string
}

function normalizeValue(value: string | null | undefined) {
  return (value ?? '').trim().toLowerCase()
}

function buildClientSearchText(client: Client) {
  return [client.nombre, client.apellido, client.correo, client.celular, client.dni]
    .map((value) => normalizeValue(value))
    .filter(Boolean)
    .join(' ')
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

export function AccumulatePointsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [montoCompra, setMontoCompra] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [result, setResult] = useState<AccumulateResponse | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setError(null)
        const response = await api.get<Client[]>('/clientes')
        setClients(response.data)
      } catch {
        setError('No se pudieron cargar los clientes para registrar el pago.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchClients()
  }, [])

  const filteredClients = useMemo(() => {
    const query = normalizeValue(searchTerm)
    if (!query) {
      return []
    }

    return clients.filter((client) => buildClientSearchText(client).includes(query)).slice(0, 12)
  }, [clients, searchTerm])

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client)
    setSearchTerm(`${client.nombre ?? ''} ${client.apellido ?? ''}`.trim() || client.correo || client.celular || `ID ${client.id}`)
  }

  const clearSelectedClient = () => {
    setSelectedClient(null)
    setSearchTerm('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setResult(null)
    setIsSubmitting(true)

    try {
      const response = await api.post<AccumulateResponse>('/puntos/acumular', {
        cliente_id: selectedClient?.id,
        monto_compra: Number(montoCompra),
        descripcion: descripcion || undefined,
      })
      setResult(response.data)
      setSuccessMessage('Pago registrado y puntos acumulados correctamente.')
    } catch (error) {
      setError(getErrorMessage(error, 'No se pudo registrar el pago y acumular puntos.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRevertMovement = async () => {
    if (!result) {
      return
    }

    const confirmed = window.confirm('¿Seguro que quieres revertir este movimiento? Esta accion descontara los puntos acumulados.')
    if (!confirmed) {
      return
    }

    setError(null)
    setSuccessMessage(null)
    setIsDeleting(true)

    try {
      const response = await api.delete<DeleteMovementResponse>(`/puntos/movimientos/${result.movimiento_id}`)
      setSuccessMessage(response.data.detail)
      setResult(null)
      setMontoCompra('')
      setDescripcion('')
    } catch (error) {
      setError(getErrorMessage(error, 'No se pudo revertir el movimiento.'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DashboardLayout
      role="admin">
      {isLoading ? <div className="info-banner"><p>Cargando clientes...</p></div> : null}
      {error ? <div className="message error">{error}</div> : null}
      {successMessage ? <div className="message success">{successMessage}</div> : null}

      {!isLoading ? (
        <section className="admin-payment-panel">
          <div className="admin-payment-header">
            <div>
              <h2>Registrar pago</h2>
              <p>Busca al cliente por nombre, apellido, correo, celular o DNI, selecciónalo y registra la compra.</p>
            </div>
          </div>

          <div className="admin-payment-search">
            <div className="field">
              <label htmlFor="buscar-cliente">Buscar cliente</label>
              <input
                id="buscar-cliente"
                className="input"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setSelectedClient(null)
                }}
                placeholder="Ejemplo: maria, lopez, 999888777, maria@test.com o 12345678"
              />
            </div>
          </div>

          {selectedClient ? (
            <div className="admin-selected-client">
              <div className="inline-actions">
                <span className="status-pill success">Cliente seleccionado</span>
                <span className="status-pill">ID {selectedClient.id}</span>
              </div>
              <h3>{`${selectedClient.nombre ?? 'Cliente'} ${selectedClient.apellido ?? ''}`.trim()}</h3>
              <p>
                {selectedClient.correo ?? 'Sin correo'} · {selectedClient.celular ?? 'Sin celular'} · DNI {selectedClient.dni ?? 'Sin DNI'}
              </p>
              <div className="inline-actions">
                <button type="button" className="admin-link-button" onClick={clearSelectedClient}>
                  Cambiar cliente
                </button>
              </div>
            </div>
          ) : searchTerm ? (
            filteredClients.length > 0 ? (
              <div className="table-wrap admin-client-results">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Celular</th>
                      <th>DNI</th>
                      <th>Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id}>
                        <td data-label="ID">{client.id}</td>
                        <td data-label="Nombre">{`${client.nombre ?? 'Cliente'} ${client.apellido ?? ''}`.trim()}</td>
                        <td data-label="Correo">{client.correo ?? 'Sin correo'}</td>
                        <td data-label="Celular">{client.celular ?? 'Sin celular'}</td>
                        <td data-label="DNI">{client.dni ?? 'Sin DNI'}</td>
                        <td data-label="Accion">
                          <button type="button" className="button-secondary" onClick={() => handleSelectClient(client)}>
                            Seleccionar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state admin-client-results">
                <h3>Sin coincidencias</h3>
                <p>No encontramos clientes con ese criterio de búsqueda.</p>
              </div>
            )
          ) : (
            <div className="info-banner admin-client-results">
              <p>Escribe un dato del cliente para filtrar resultados y elegir a la persona correcta.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-payment-form">
            <div className="field">
              <label htmlFor="monto">Monto de compra</label>
              <input
                id="monto"
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={montoCompra}
                onChange={(event) => setMontoCompra(event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="cliente-actual">Cliente actual</label>
              <input
                id="cliente-actual"
                className="input"
                value={selectedClient ? `${selectedClient.nombre ?? 'Cliente'} ${selectedClient.apellido ?? ''}`.trim() : 'Aun no seleccionado'}
                readOnly
              />
            </div>

            <div className="field admin-payment-description">
              <label htmlFor="descripcion">Descripcion</label>
              <textarea
                id="descripcion"
                className="textarea"
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
                placeholder="Ejemplo: servicio de manicure con acabado premium"
              />
            </div>

            <button
              type="submit"
              className="admin-payment-submit"
              disabled={isSubmitting || !selectedClient || !montoCompra}
            >
              {isSubmitting ? 'Registrando...' : 'Registrar pago'}
            </button>
          </form>
        </section>
      ) : null}

      {result ? (
        <section className="summary-grid">
          <article className="metric-card">
            <span>Movimiento ID</span>
            <strong>{result.movimiento_id}</strong>
            <p>Registro creado para esta compra.</p>
          </article>
          <article className="metric-card">
            <span>Puntos ganados</span>
            <strong>{result.puntos_ganados}</strong>
            <p>Saldo otorgado por esta compra.</p>
          </article>
          <article className="metric-card">
            <span>Saldo actual</span>
            <strong>{result.saldo_puntos}</strong>
            <p>Total luego del registro.</p>
          </article>
          <article className="metric-card">
            <span>Accion correctiva</span>
            <strong>Disponible</strong>
            <p>Si fue un error, puedes revertir este movimiento y descontar los puntos acumulados.</p>
            <button type="button" className="button-danger" onClick={handleRevertMovement} disabled={isDeleting}>
              {isDeleting ? 'Revirtiendo...' : 'Revertir movimiento'}
            </button>
          </article>
        </section>
      ) : null}
    </DashboardLayout>
  )
}
