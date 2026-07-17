import axios from 'axios'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/useAuth'

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail

    if (typeof detail === 'string') {
      return detail
    }

    if (Array.isArray(detail)) {
      const firstMessage = detail[0]?.msg
      if (typeof firstMessage === 'string') {
        return firstMessage
      }
    }
  }

  return 'No se pudo iniciar sesion. Verifica tus credenciales.'
}

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [identificador, setIdentificador] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const user = await login({ identificador, password })
      navigate(user.rol === 'admin' ? '/admin' : '/cliente', { replace: true })
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-editorial-shell login-editorial-shell">
      <div className="auth-editorial-card login-editorial-card">
        <aside className="auth-editorial-hero login-editorial-hero">
          <div className="login-editorial-hero-inner">
            <span className="login-editorial-badge">Mini Salon</span>
            <div className="login-editorial-copy">
              <p className="login-editorial-overline">Herencia contemporanea</p>
              <h1>Ingresa a tu cuenta.</h1>
              <p className="login-editorial-lead">
                Un espacio para clientes y salon donde cada punto, canje y movimiento queda bajo control.
              </p>
            </div>
          </div>

          <div className="login-editorial-footer">
            <h2>Fidelizacion con criterio y detalle.</h2>
            <p>
              Administra recompensas, confirma canjes y sigue la actividad del cliente desde una misma experiencia.
            </p>
          </div>
        </aside>

        <section className="auth-editorial-panel login-editorial-panel">
          <div className="login-editorial-panel-inner">
            <div className="login-editorial-heading">
              <span className="login-editorial-badge subtle">Acceso seguro</span>
              <h2>Login to your account</h2>
              <p>Ingresa con tu correo o celular para continuar donde dejaste tu cuenta.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-editorial-form">
              <div className="auth-editorial-field login-editorial-field">
                <label htmlFor="identificador">Correo o celular</label>
                <input
                  id="identificador"
                  value={identificador}
                  onChange={(event) => setIdentificador(event.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="auth-editorial-field login-editorial-field">
                <label htmlFor="password">Contrasena</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </div>
              {error ? <div className="message error">{error}</div> : null}

              <button type="submit" className="auth-editorial-submit login-editorial-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </form>

            <p className="login-editorial-switch">
              ¿Aun no tienes cuenta? <Link to="/register">Registrate</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
