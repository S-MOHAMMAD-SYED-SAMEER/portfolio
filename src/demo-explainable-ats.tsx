import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import P3Demo from './demo/pages/P3Demo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <P3Demo />
  </StrictMode>,
)
