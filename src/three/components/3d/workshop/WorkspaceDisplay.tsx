import { WORKSHOP_PALETTE, WORKSPACE_DISPLAY as D } from '@/data/workshop'

/**
 * The studio's information display: the screen the work is shown on.
 *
 * WHAT IS GEOMETRY AND WHAT IS HTML
 *
 * This is the physical object — a bezel, a lit panel, a stand. The interface
 * on it is HTML, laid into the panel's rectangle by `ScreenAnchor`, because
 * type baked into a texture at this distance is either unreadable or a 2K
 * texture nobody needs, and because the overlay already carries the keyboard
 * access, the accessible names and the real link destinations.
 *
 * So the mesh gives the interface somewhere to live and the room something to
 * be lit by; the overlay gives it something to say. There is still exactly one
 * project-selection state behind both.
 *
 * WHY IT IS DIMMER THAN THE WINDOW
 *
 * The glazed back wall is the room's key light and has to stay the brightest
 * thing in here — a display that outshines the daylight behind it stops being
 * a panel in a room and becomes a light source, which is how the last version
 * ended up reading as a floating rectangle. The panel is lit enough to carry
 * dark text and no more, with a low emissive floor so it still reads as
 * switched on when the camera is far from the bench lamp.
 *
 * COST
 *
 * Five meshes, no texture, no transparency, no per-frame work. The panel is
 * out of both shadow passes: it is a lit surface, so a shadow map of it would
 * cost more than it could show. The frame and stand still catch and cast,
 * because those are what make it read as an object standing in the room.
 */
export function WorkspaceDisplay() {
  /* The group sits at the panel's centre, so the stand is measured downward
     from there in local space: the floor is as far below as the panel centre
     is above it. */
  const floor = -D.position[1]
  const panelBottom = -D.height / 2
  const footTop = floor + D.stand.footHeight
  const poleLength = panelBottom - footTop
  const poleCentre = (panelBottom + footTop) / 2

  return (
    <group position={D.position} rotation-y={D.rotationY}>
      {/* The frame. Deliberately the darkest thing on the object, so the
          panel inside it reads as lit rather than painted. */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[D.width, D.height, D.depth]} />
        <meshStandardMaterial
          color={WORKSHOP_PALETTE.screenFrame}
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>

      {/* The panel, standing just proud of the bezel so its edge catches
          light. This is the surface the overlay is anchored to. */}
      <mesh position-z={D.depth / 2 + 0.005} castShadow={false} receiveShadow={false}>
        <planeGeometry args={[D.screenWidth, D.screenHeight]} />
        <meshStandardMaterial
          color="#bcc2cb"
          emissive="#828b99"
          emissiveIntensity={0.18}
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      {/* Stand: pole down to a foot on the floor. Without it the panel is a
          rectangle hanging in mid-air, which is most of what made the
          previous version read as a card rather than a monitor. */}
      <mesh position={[0, poleCentre, 0]} castShadow receiveShadow>
        <boxGeometry args={[D.stand.poleWidth, poleLength, D.stand.poleDepth]} />
        <meshStandardMaterial color={WORKSHOP_PALETTE.metal} roughness={0.45} metalness={0.55} />
      </mesh>

      <mesh position={[0, floor + D.stand.footHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[D.stand.footWidth, D.stand.footHeight, D.stand.footDepth]} />
        <meshStandardMaterial color={WORKSHOP_PALETTE.metal} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* A hairline of spill under the frame, the way a panel catches the
          surface it stands over. */}
      <mesh position={[0, -D.height / 2 - 0.012, D.depth / 2]} castShadow={false} receiveShadow={false}>
        <boxGeometry args={[D.width * 0.78, 0.01, 0.01]} />
        <meshStandardMaterial color="#8fa2bd" emissive="#8fa2bd" emissiveIntensity={0.5} roughness={1} />
      </mesh>
    </group>
  )
}
