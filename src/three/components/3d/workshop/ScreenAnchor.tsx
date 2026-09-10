import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

import { WORKSPACE_DISPLAY as D } from '@/data/workshop'

/** Where the overlay reads the panel's placement from. */
const VARS = {
  x: '--screen-x',
  y: '--screen-y',
  w: '--screen-w',
  h: '--screen-h',
  m: '--screen-matrix',
} as const

/**
 * Lays the overlay onto the display panel, in perspective.
 *
 * WHY A MATRIX AND NOT A RECTANGLE
 *
 * The panel is a flat quad standing at an angle in a room, so it projects to a
 * trapezoid — more so because the composition deliberately keeps it off the
 * optical axis. An axis-aligned box fitted to its corners is not that shape:
 * it overhangs the bezel on the near side and falls short on the far side,
 * which is exactly what makes HTML read as a sticker floating in front of a
 * screen rather than as the screen's contents.
 *
 * So the four corners are projected each frame and turned into the projective
 * transform that maps the overlay's own rectangle onto that quad. The overlay
 * is laid out normally at `--screen-w` x `--screen-h` and then warped by
 * `--screen-matrix`, so it sits in the plane of the panel: its edges run along
 * the bezel, and text on the far side recedes the way anything on that surface
 * would. Layout, hit-testing, focus and scrolling all still work — the browser
 * maps pointer coordinates through the transform.
 *
 * WHY THIS IS CHEAP
 *
 * Four `project()` calls, a nine-term solve, and at most one style write per
 * frame. The write is skipped unless a corner moved half a pixel, so a settled
 * camera costs the projection and nothing else — no style recalculation, no
 * React render. Nothing here sets state, so it never re-renders the scene. It
 * runs only while a destination that uses the display is open.
 */
export function ScreenAnchor({ active }: { active: boolean }) {
  const { camera, size } = useThree()

  /* The lit area inside the bezel, less a margin, so a strip of panel shows
     around the content and the frame is never overrun. Ordered top-left,
     top-right, bottom-right, bottom-left — the order the transform below
     expects. The panel is rotated with the bench, so each corner is taken
     from the display's local space into the room's. */
  const corners = useMemo(() => {
    const halfW = D.screenWidth / 2 - D.contentInset
    const halfH = D.screenHeight / 2 - D.contentInset
    const faceZ = D.depth / 2 + 0.005
    const cos = Math.cos(D.rotationY)
    const sin = Math.sin(D.rotationY)

    return (
      [
        [-halfW, halfH],
        [halfW, halfH],
        [halfW, -halfH],
        [-halfW, -halfH],
      ] as const
    ).map(
      ([lx, ly]) =>
        new Vector3(
          D.position[0] + lx * cos + faceZ * sin,
          D.position[1] + ly,
          D.position[2] - lx * sin + faceZ * cos,
        ),
    )
  }, [])

  const scratch = useRef(new Vector3())
  const last = useRef<number[]>([])

  useFrame(() => {
    if (!active) return

    const pts: number[] = []
    for (const corner of corners) {
      const v = scratch.current.copy(corner).project(camera)
      // Behind the camera, or off the far plane: the projection is meaningless
      // there and would throw the panel across the viewport.
      if (!Number.isFinite(v.x) || !Number.isFinite(v.y) || v.z > 1) return
      pts.push(((v.x + 1) / 2) * size.width, ((1 - v.y) / 2) * size.height)
    }

    const previous = last.current
    if (previous.length === pts.length && pts.every((v, i) => Math.abs(v - previous[i]!) < 0.5)) {
      return
    }
    last.current = pts

    const xs = [pts[0]!, pts[2]!, pts[4]!, pts[6]!]
    const ys = [pts[1]!, pts[3]!, pts[5]!, pts[7]!]
    const left = Math.min(...xs)
    const top = Math.min(...ys)
    const width = Math.max(...xs) - left
    const height = Math.max(...ys) - top
    if (width < 1 || height < 1) return

    const matrix = squareToQuad(
      xs.map((x) => x - left),
      ys.map((y) => y - top),
      width,
      height,
    )
    if (matrix === null) return

    const style = document.documentElement.style
    style.setProperty(VARS.x, `${Math.round(left)}px`)
    style.setProperty(VARS.y, `${Math.round(top)}px`)
    style.setProperty(VARS.w, `${Math.round(width)}px`)
    style.setProperty(VARS.h, `${Math.round(height)}px`)
    style.setProperty(VARS.m, matrix)
  })

  // Leaving stale coordinates behind would park the next panel wherever the
  // camera happened to be when this last ran.
  useEffect(() => {
    if (active) return
    const style = document.documentElement.style
    for (const name of Object.values(VARS)) style.removeProperty(name)
    last.current = []
  }, [active])

  return null
}

/**
 * The projective transform taking a `w` x `h` rectangle onto a quad.
 *
 * Standard unit-square-to-quad homography, pre-scaled by the rectangle's own
 * size so the overlay can be laid out at real pixel dimensions, then emitted
 * in the column-major order `matrix3d` wants. Returns `null` for a degenerate
 * quad — one seen edge-on, or collapsed to a line — rather than a matrix full
 * of infinities.
 */
function squareToQuad(x: number[], y: number[], w: number, h: number): string | null {
  const [x0, x1, x2, x3] = x as [number, number, number, number]
  const [y0, y1, y2, y3] = y as [number, number, number, number]

  const dx1 = x1 - x2
  const dx2 = x3 - x2
  const dy1 = y1 - y2
  const dy2 = y3 - y2
  const sx = x0 - x1 + x2 - x3
  const sy = y0 - y1 + y2 - y3

  const den = dx1 * dy2 - dx2 * dy1
  if (Math.abs(den) < 1e-6) return null

  const g = (sx * dy2 - dx2 * sy) / den
  const k = (dx1 * sy - sx * dy1) / den

  const a = x1 - x0 + g * x1
  const b = x3 - x0 + k * x3
  const c = x0
  const d = y1 - y0 + g * y1
  const e = y3 - y0 + k * y3
  const f = y0

  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, k / h, 0, 0, 1, 0, c, f, 0, 1]
  if (!m.every(Number.isFinite)) return null

  return `matrix3d(${m.map((v) => Number(v.toFixed(6))).join(',')})`
}
