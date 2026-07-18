# Sistema Fidelización - Front

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.13-5A29E4?logo=axios&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=white)
![License](https://img.shields.io/badge/License-PolyForm_Noncommercial_1.0.0-ff69b4)
[![Build & Lint](https://github.com/a-vil/Salon-front-p/actions/workflows/build.yml/badge.svg)](https://github.com/a-vil/Salon-front-p/actions/workflows/build.yml)

---

Dashboard de un **programa de fidelización** para un salón de belleza, con dos roles de usuario (admin y cliente). Construido como SPA con React 19 y TypeScript, consumiendo una API REST externa.

## Demo

[https://salon-front-p.vercel.app](https://salon-front-p.vercel.app)

> ⚠️ El backend usa el plan gratuito de Render, que puede tardar hasta 50 segundos
> en activarse en la primera petición si estuvo inactivo.

## Credenciales de Prueba

Puedes probar la aplicación con estas cuentas demo:

| Rol | Identificador | Contraseña |
|-----|---------------|------------|
| Administrador | `admin@example.com` | `Admin123!` |
| Cliente | `cliente@example.com` | `Cliente123!` |

## Funcionalidades

### Rol Administrador
- Dashboard con resumen y acceso rápido a módulos
- CRUD de clientes (listado con búsqueda y filtros)
- Acumulación de puntos (registrar compras de clientes)
- Historial global de movimientos (con opción de revertir)
- Gestión de recompensas (activar / desactivar)
- Gestión de canjes (confirmar / cancelar solicitudes pendientes)

### Rol Cliente
- Dashboard con saldo de puntos, barra de progreso y actividad reciente
- Historial de movimientos propio
- Catálogo de recompensas disponibles
- Solicitud de canjes (con selección de cantidad)
- Historial de canjes con estados (pendiente, confirmado, cancelado)

### Generales
- Autenticación JWT con persistencia en localStorage
- Rutas protegidas por rol (admin / cliente)
- Diseño responsivo (mobile, tablet, desktop)
- Temática oscura con estilo editorial / lujo

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| **Lenguaje** | TypeScript 5.9 (strict mode) |
| **Framework UI** | React 19 |
| **Routing** | React Router DOM 7 |
| **Cliente HTTP** | Axios 1.13 |
| **Build Tool** | Vite 8 + @vitejs/plugin-react |
| **Estilos** | Tailwind CSS 4 + CSS personalizado |
| **Linting** | ESLint 9 + typescript-eslint + react-hooks |
| **Despliegue** | Vercel (SPA fallback) |

## Arquitectura del Proyecto

```
src/
├── api/client.ts               # Instancia de Axios con interceptor JWT
├── context/
│   ├── AuthContext.tsx         # Componente AuthProvider (estado global de autenticación)
│   ├── authContextDefinition.ts # Definición del contexto y tipos (AuthContextValue)
│   └── useAuth.ts              # Hook personalizado para consumir el contexto
├── layouts/                    # Layouts compartidos (Dashboard y Auth)
├── pages/
│   ├── admin/                  # 6 páginas para rol admin
│   ├── auth/                   # Login y Register
│   └── client/                 # 4 páginas para rol cliente
├── routes/AppRouter            # Definición de rutas y guards por rol
├── styles/                     # Hojas de estilo CSS
├── types/auth.ts               # Interfaces de TypeScript
├── App.tsx                     # Componente raíz
└── main.tsx                    # Entry point
```

## Instalación y Uso Local

```bash
# Clonar el repositorio
git clone https://github.com/a-vil/Salon-front-p.git
cd Salon-front-p

# (Opcional) Configurar variable de entorno para la API
# Copia el archivo de ejemplo y editarlo si es necesario
cp .env.example .env

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo Vite |
| `npm run build` | TypeCheck + Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Ejecuta ESLint |

## Variables de Entorno

| Variable | Obligatorio | Descripción |
|----------|-------------|-------------|
| `VITE_API_URL` | No | URL base de la API. Por defecto apunta a `https://sis-fide-api.onrender.com` |

Copia `.env.example` a `.env` si necesitas sobrescribir la URL del backend.

## Backend

La aplicación consume una API REST desplegada en Render:  
[https://sis-fide-api.onrender.com](https://sis-fide-api.onrender.com)

## Licencia

Este proyecto está licenciado bajo **PolyForm Noncommercial License 1.0.0**.  
Ver el archivo [LICENSE](LICENSE) para más detalles.
