import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DocIntelCaseStudy from './pages/DocIntelCaseStudy.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DocIntelCaseStudy />
  </StrictMode>,
)
