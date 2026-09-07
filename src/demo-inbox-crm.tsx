import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import P2Demo from './demo/pages/P2Demo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <P2Demo />
  </StrictMode>,
)
