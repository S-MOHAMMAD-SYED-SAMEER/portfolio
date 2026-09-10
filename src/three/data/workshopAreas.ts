import type { CameraPose } from '@/data/cameraPoses'
import { BUILD_STATION, RACK, SYSTEMS_PANEL, WORKSTATION } from '@/data/workshop'
import { CHARACTER_MARKS } from '@/data/journey'
import type { Vec3 } from '@/lib/vec3'
import type { WorkshopArea } from '@/systems/workshopArea'

/**
 * Where each destination lives in the room, and how the camera looks at it.
 *
 * The anchors sit on objects that are already there — the displays, the
 * bench, the drawing on the wall, the rack, the window — so nothing has been
 * added to the workshop to carry navigation.
 */
export interface AreaAnchor {
  /** Where the marker sits, in world space. */
  position: Vec3
  /** Radius of the marker ring on the floor beneath it. */
  radius: number
}

export const AREA_ANCHORS: Record<WorkshopArea, AreaAnchor> = {
  /** The three displays. */
  projects: { position: [WORKSTATION.position[0] - 0.2, 1.36, -29.55], radius: 0.34 },
  /** The systems drawing on the left wall. */
  skills: { position: [SYSTEMS_PANEL.position[0] + 0.35, SYSTEMS_PANEL.position[1], -30], radius: 0.3 },
  /** The build station against the right wall. Its own place, not the bench. */
  services: { position: [BUILD_STATION.position[0] - 0.6, 1.3, BUILD_STATION.position[2]], radius: 0.32 },
  /** Beside the host himself, who is the subject of About. */
  about: {
    position: [CHARACTER_MARKS.studio.position[0] + 0.95, 1.2, CHARACTER_MARKS.studio.position[2] + 0.2],
    radius: 0.3,
  },
  /** The equipment rack. */
  contact: { position: [RACK.position[0] + 0.55, 1.3, RACK.position[2]], radius: 0.32 },
}

/**
 * One pose per destination. Each keeps the room in frame rather than filling
 * it with the object, so the visitor never loses their bearings.
 */
export const AREA_POSES: Record<WorkshopArea, CameraPose> = {
  /**
   * Three-quarter on the studio display, with the bench in front of it.
   *
   * Off the panel's normal by about 25 degrees rather than square to it: a
   * display framed head-on and centred is a rectangle filling the middle of
   * the viewport, which is the thing this composition exists to avoid. From
   * here the panel is a panel — foreshortened, standing in a room, with the
   * desk between it and the camera. The aim point sits to the right of the
   * panel rather than on it, which puts the display left of centre and brings
   * the host into the right of the frame instead of leaving him outside it.
   *
   * The distance is set by the host rather than by the panel. Standing closer
   * makes the display bigger — which a phone badly wants — but walks him out
   * of the right of the frame, and a workstation composition without the
   * person whose workstation it is is the wrong trade. So this is as close as
   * the pose comes, and the phone reads a smaller panel.
   *
   * Tuned against the projected rectangle rather than computed from distance:
   * `FRAMING` rewrites the pose by aspect before the rig applies it, so
   * arithmetic here does not predict what lands on screen. Standing off ~9 m
   * is what leaves the panel legible while the bench, the host and the room
   * around them stay in shot.
   */
  projects: {
    position: [1.5, 2.5, -21.2],
    lookAt: [-2.4, 2.35, -29.4],
    parallax: 0.12,
  },
  skills: {
    position: [-2.4, 2.5, -26.6],
    lookAt: [-6.6, 2.9, -30],
    parallax: 0.25,
  },
  /**
   * The same display as Projects, approached from the build-station side.
   *
   * Services is read on the same panel, so it cannot stay pointed at the right
   * wall the way it was — content on a screen needs the screen in frame.
   * Coming in from the other side of the room gives a stronger three-quarter
   * on the panel than Projects gets, so the destination still has its own
   * vantage rather than being the Projects pose over again. The host is out of
   * this frame, as he was out of the build-station pose it replaces.
   */
  services: {
    position: [-1, 2.5, -21.5],
    lookAt: [-3.5, 2.6, -30.3],
    parallax: 0.12,
  },
  /**
   * On the host. About is about a person, so the composition is a person —
   * with the room behind him rather than an empty wall.
   */
  about: {
    position: [4.3, 1.85, -22.6],
    lookAt: [2.4, 1.4, -28],
    parallax: 0.25,
  },
  /** Closer on the rack, so it reads as a station rather than a dark corner. */
  contact: {
    position: [-2.9, 1.95, -30],
    lookAt: [-6, 1.35, -33.4],
    parallax: 0.25,
  },
}
