import type { ReactNode } from 'react'

interface AuthLayoutProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

export function AuthLayout({ eyebrow, title, description, children }: AuthLayoutProps) {
  return (
    <div className="auth-editorial-shell auth-shell">
      <div className="auth-editorial-card auth-card">
        <aside className="auth-editorial-hero auth-hero">
          <div className="stack">
            <span className="auth-kicker">Mini Salon</span>
            <div className="stack">
              <span className="auth-kicker">{eyebrow}</span>
              <h1>{title}</h1>
              <p>
                Controla puntos, recompensas y solicitudes de canje desde una interfaz clara para el
                negocio y simple para el cliente.
              </p>
            </div>
          </div>

          <div className="auth-stats">
            <div className="auth-stat">
              <strong>01</strong>
              <span>Registro claro para clientes nuevos.</span>
            </div>
            <div className="auth-stat">
              <strong>02</strong>
              <span>Canjes pendientes con confirmacion administrativa.</span>
            </div>
            <div className="auth-stat">
              <strong>03</strong>
              <span>Historial de puntos visible para ambos roles.</span>
            </div>
          </div>
        </aside>

        <section className="auth-editorial-panel auth-panel">
          <div className="section-heading">
            <h2>{eyebrow}</h2>
            <p>{description}</p>
          </div>
          {children}
        </section>
      </div>
    </div>
  )
}
