import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

import { AuthProvider } from './context/AuthContext'
import { AppRouter } from './routes/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#efbf73',
              color: '#19140d',
              fontWeight: 700,
              border: 'none',
              fontFamily: 'Segoe UI, sans-serif',
            },
            duration: 3500,
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

