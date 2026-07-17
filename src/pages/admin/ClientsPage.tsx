import { useEffect, useMemo, useState } from 'react'

import api from '../../api/client'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import type { Client } from '../../types/auth'

function normalizeValue(value: string | null | undefined) {
  return (value ?? '').trim().toLowerCase()
}

function buildClientSearchText(client: Client) {
  return [client.nombre, client.apellido, client.correo, client.celular, client.dni]
    .map((value) => normalizeValue(value))
    .filter(Boolean)
    .join(' ')
}

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setError(null)
        const response = await api.get<Client[]>('/clientes')
        setClients(response.data)
      } catch {
        setError('No se pudieron cargar los clientes.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchClients()
  }, [])

  const filteredClients = useMemo(() => {
    const query = normalizeValue(searchTerm)
    if (!query) {
      return clients
    }

    return clients.filter((client) => buildClientSearchText(client).includes(query))
  }, [clients, searchTerm])

  return (
    <DashboardLayout role="admin">
      {isLoading ? <div className="info-banner"><p>Cargando clientes...</p></div> : null}
      {error ? <div className="message error">{error}</div> : null}

      {!isLoading && !error ? (
        <section className="surface-panel">
          <div className="page-header">
            <div>
              <h2>Base de clientes</h2>
              <p>{filteredClients.length} clientes visibles en esta consulta.</p>
            </div>
          </div>

          <div className="admin-table-search">
            <div className="field">
              <label htmlFor="buscar-cliente">Buscar cliente</label>
              <input
                id="buscar-cliente"
                className="input"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Nombre, correo, celular o DNI"
              />
            </div>
          </div>

          {filteredClients.length > 0 ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Celular</th>
                    <th>DNI</th>
                    <th>Estado</th>
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
                      <td data-label="Estado">
                        <span className={`status-pill ${client.activo ? 'success' : 'danger'}`}>
                          {client.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <h3>{clients.length > 0 ? 'Sin coincidencias' : 'No hay clientes registrados'}</h3>
              <p>
                {clients.length > 0
                  ? 'No encontramos clientes con ese criterio de busqueda.'
                  : 'Cuando el salon empiece a registrar usuarios, apareceran aqui.'}
              </p>
            </div>
          )}
        </section>
      ) : null}
    </DashboardLayout>
  )
}
