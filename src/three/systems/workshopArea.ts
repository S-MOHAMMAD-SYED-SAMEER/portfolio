/**
 * The five things there are to look at once the visitor is inside.
 *
 * A layer beside the journey rather than more stages in it: the cinematic
 * arrival ends at `workshop`, and everything here happens within that one
 * stage. `experienceStage` is untouched.
 */
export type WorkshopArea = 'projects' | 'skills' | 'services' | 'about' | 'contact'

export const WORKSHOP_AREAS: readonly WorkshopArea[] = [
  'projects',
  'skills',
  'services',
  'about',
  'contact',
]

export const AREA_LABEL: Record<WorkshopArea, string> = {
  projects: 'Projects',
  skills: 'Skills',
  services: 'Services',
  about: 'About',
  contact: 'Contact',
}

/**
 * The two destinations that are read on the studio screen.
 *
 * Projects and Services are catalogues of work, and the room already has a
 * surface for showing work: the glazed back wall. Skills, About and Contact
 * are about the left wall, the host and the rack, so their panels stay beside
 * those rather than being displaced onto a screen at the other end of the
 * room. One predicate, so the camera, the scene and the overlay cannot
 * disagree about which is which.
 */
export function isScreenArea(area: WorkshopArea | null): boolean {
  return area === 'projects' || area === 'services'
}

/** The one line shown when a destination is hovered or focused. */
export const AREA_PROMPT: Record<WorkshopArea, string> = {
  projects: 'Explore projects',
  skills: 'How I build',
  services: 'What I build for others',
  about: 'A little about me',
  contact: "Let's connect",
}
