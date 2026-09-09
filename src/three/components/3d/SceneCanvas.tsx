import { Canvas } from '@react-three/fiber'
import { Suspense, type ReactNode } from 'react'

interface SceneCanvasProps {
  children: ReactNode
}

/**
 * The single WebGL boundary for the whole application.
 *
 * Nothing above this component touches Three.js, and nothing inside it
 * renders DOM UI — overlays are ordinary DOM siblings positioned over the
 * canvas. Mount this only on routes that need 3D so that leaving the
 * experience unmounts the renderer and frees the GPU context.
 *
 * The camera is positioned by the scene's own rig, not here, so this stays
 * generic across the areas built in later phases.
 */
export function SceneCanvas({ children }: SceneCanvasProps) {
  return (
    // The scene is decorative in the accessibility sense: everything it
    // conveys — where the visitor is, what is being said, every action — is
    // in the overlay above it as real, focusable HTML. So it takes a name
    // and an image role rather than being exposed as an interactive region
    // a screen reader would then have to describe frame by frame.
    <Canvas
      role="img"
      aria-label="A rendered hall: a figure standing before a doorway, with a name board on the wall beside it. Everything the scene shows is also written in the panel over it."
      // Cap the pixel ratio so high-DPI phones do not render 3x the pixels.
      dpr={[1, 2]}
      // PCF rather than PCFSoft: three deprecated the latter and now
      // silently falls back to this anyway.
      shadows="percentage"
      camera={{ fov: 42, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      className="absolute inset-0"
    >
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  )
}
