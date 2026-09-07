import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import P1Demo from './demo/pages/P1Demo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <P1Demo />
  </StrictMode>,
)
