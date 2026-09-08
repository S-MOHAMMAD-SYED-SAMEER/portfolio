import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ExperienceLoading } from './three/components/experience/ExperienceLoading'

/**
 * The 3D experience, on its own page.
 *
 * WHY THIS IS A SEPARATE ENTRY POINT
 *
 * three.js and the React Three Fiber runtime are around a megabyte. Given its
 * own Vite entry, Rollup can only reach that code from here, so no other page
 * in the site can pull it into a shared chunk — a visitor reading a case study
 * never downloads a renderer they will not use.
 *
 * The scene is additionally lazy inside this page, so the document paints and
 * shows its loading state while the renderer arrives rather than after it.
 */
const ExperiencePage = lazy(() =>
  import('./three/pages/ExperiencePage').then((m) => ({ default: m.ExperiencePage })),
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<ExperienceLoading />}>
      <ExperiencePage />
    </Suspense>
  </StrictMode>,
)
