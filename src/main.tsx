import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import TanstackQueryClientProvider from './providers/tanstackQueryClientProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NuqsAdapter>
        <TanstackQueryClientProvider>
          <App />
        </TanstackQueryClientProvider>
      </NuqsAdapter>
    </BrowserRouter>
  </StrictMode>,
)
