import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SalesRecoveryCaseStudy from './pages/SalesRecoveryCaseStudy.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SalesRecoveryCaseStudy />
  </StrictMode>,
)
