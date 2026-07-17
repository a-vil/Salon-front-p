import axios from 'axios'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/useAuth'
import { AuthLayout } from '../../layouts/AuthLayout'

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

  return 'No se pudo completar el registro. Revisa los datos ingresados.'
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [dia, setDia] = useState('')
  const [mes, setMes] = useState('')
  const [anio, setAnio] = useState('')

  const [correo, setCorreo] = useState('')
  const [celular, setCelular] = useState('')
  const [dni, setDni] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showPassword, setShowPassword] = useState(false)


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    const fechaNaci = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`

    try {
      const user = await register({
        nombre,
        apellido,
        fecha_naci: fechaNaci,
        correo: correo || undefined,
        celular: celular || undefined,
        dni: dni || undefined,
        password,
      })
      navigate(user.rol === 'admin' ? '/admin' : '/cliente', { replace: true })
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Registro"
      title="Crea la cuenta del cliente sin friccion."
      description="El alta deja lista la cuenta, el usuario y el saldo inicial para empezar el programa de fidelizacion."
    >
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-grid two-columns">
          <div className="auth-editorial-field field">
            <label htmlFor="nombre">Nombres</label>
            <input id="nombre" className="auth-editorial-input input" value={nombre} onChange={(event) => setNombre(event.target.value)} />
          </div>

          <div className="auth-editorial-field field">
            <label htmlFor="apellido">Apellidos</label>
            <input id="apellido" className="auth-editorial-input input" value={apellido} onChange={(event) => setApellido(event.target.value)} />
          </div>
        </div>

        <div className="auth-editorial-field field">
          <label>Fecha de nacimiento</label>

          <div className="form-grid three-columns">
            <input
              id="dia"
              className="auth-editorial-input input"
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="Día"
              value={dia}
              onChange={(event) => setDia(event.target.value)}
            />

            <input
              id="mes"
              className="auth-editorial-input input"
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="Mes"
              value={mes}
              onChange={(event) => setMes(event.target.value)}
            />

            <input
              id="anio"
              className="auth-editorial-input input"
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="Año"
              value={anio}
              onChange={(event) => setAnio(event.target.value)}
            />
          </div>
        </div>

        <div className="form-grid two-columns">
          <div className="auth-editorial-field field">
            <label htmlFor="dni">DNI</label>
            <input id="dni" className="auth-editorial-input input" value={dni} onChange={(event) => setDni(event.target.value)} />
          </div>

          <div className="auth-editorial-field field">
            <label htmlFor="celular">Celular</label>
            <input id="celular" className="auth-editorial-input input" value={celular} onChange={(event) => setCelular(event.target.value)} />
          </div>
        </div>

        <div className="auth-editorial-field field">
          <label htmlFor="correo">Correo electrónico</label>
          <input id="correo" className="auth-editorial-input input" type="email" value={correo} onChange={(event) => setCorreo(event.target.value)} />
        </div>

        <div className="auth-editorial-field field">
          <label htmlFor="password">Contraseña</label>

          <div className="password-input-wrap">
            <input
              id="password"
              className="auth-editorial-input input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? '◉' : '◎'}
            </button>
          </div>
        </div>


        {error ? <div className="message error">{error}</div> : null}

        <button type="submit" className="auth-editorial-submit button" disabled={isSubmitting}>
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>


      <p className="auth-switch">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
      </p>
    </AuthLayout>
  )
}
