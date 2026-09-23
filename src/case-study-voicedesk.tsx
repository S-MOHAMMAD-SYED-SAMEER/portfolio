import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import VoiceDeskCaseStudy from './pages/VoiceDeskCaseStudy.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VoiceDeskCaseStudy />
  </StrictMode>,
)
