import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import KnowledgeOsCaseStudy from './pages/KnowledgeOsCaseStudy.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KnowledgeOsCaseStudy />
  </StrictMode>,
)
