import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ExplainableAtsCaseStudy from './pages/ExplainableAtsCaseStudy.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExplainableAtsCaseStudy />
  </StrictMode>,
)
