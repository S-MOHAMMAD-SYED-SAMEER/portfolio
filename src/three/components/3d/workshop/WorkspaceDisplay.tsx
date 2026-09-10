import { WORKSHOP_PALETTE, WORKSPACE_DISPLAY as D } from '@/data/workshop'

/**
 * The large screen above the bench: the workspace the projects are read on.
 *
 * WHAT THIS IS, AND WHAT THE HTML DOES
 *
 * This is the physical object — a bezel, a lit panel, and a hairline of spill
 * beneath it. The interface is HTML, drawn over this rectangle by the overlay
 * and wearing `.workspace-light`, because text baked into a texture at this
 * distance is either unreadable or a 2K texture nobody needs, and because the
 * overlay already carries the keyboard access, the accessible names and the
 * real CTA destinations.
 *
 * So the mesh gives the interface somewhere to live and the room something to
 * be lit by; the overlay gives it something to say. Neither duplicates the
 * other, and there is still exactly one project-selection state behind both.
 *
 * WHY IT IS NOT THE GLAZED WALL
 *
 * The bright rectangle behind the bench is the back wall's glazing, 16 m from
 * the workshop camera, and the daylight plane beyond it lights this whole
 * room. Turning that into a display would put the interface out of reading
 * range and switch the studio's only warm light off. This panel hangs nearer
 * the camera instead and leaves the window doing its job behind it.
 *
 * COST
 *
 * Three meshes, no texture, no transparency, no per-frame work, and out of
 * both shadow passes — it is a lit surface with the room's light behind it, so
 * a six-metre plane in the shadow map would cost more than it could show.
 */
export function WorkspaceDisplay() {
  const inner = { w: D.width - D.bezel * 2, h: D.height - D.bezel * 2 }

  return (
    <group position={D.position} rotation-y={D.rotationY}>
      {/* The frame the panel sits in. */}
      <mesh castShadow={false} receiveShadow={false}>
        <boxGeometry args={[D.width, D.height, D.depth]} />
        <meshStandardMaterial
          color={WORKSHOP_PALETTE.screenFrame}
          roughness={0.55}
          metalness={0.35}
        />
      </mesh>

      {/* The panel, standing proud of the bezel so the edge catches light.
          Emissive rather than lit: a screen is a source, not a surface, and
          that is what makes it read as switched on from across the room. The
          value matches the `--color-scene-ink` the overlay uses in
          `.workspace-light`, so the geometry and the HTML on top of it are the
          same white. */}
      <mesh position-z={D.depth / 2 + 0.004} castShadow={false} receiveShadow={false}>
        <planeGeometry args={[inner.w, inner.h]} />
        <meshStandardMaterial
          color="#f7f8fa"
          emissive="#eef1f6"
          emissiveIntensity={0.45}
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* A hairline of spill under the frame, the way a wall-mounted panel
          catches the surface it is fixed to. */}
      <mesh
        position={[0, -D.height / 2 - 0.015, D.depth / 2]}
        castShadow={false}
        receiveShadow={false}
      >
        <boxGeometry args={[D.width * 0.82, 0.012, 0.012]} />
        <meshStandardMaterial
          color="#8fa2bd"
          emissive="#8fa2bd"
          emissiveIntensity={0.7}
          roughness={1}
        />
      </mesh>
    </group>
  )
}
