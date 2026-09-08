import { ROUTES } from '@/lib/routes'

/**
 * The two ways a visitor can consume the portfolio.
 *
 * `normal` is the fast, traditional site at `/`; `3d` is this experience at
 * `/3d.html`. They are separate documents, so the active mode is simply which
 * page is open — there is no state to keep in sync, and no context provider.
 */
export type ExperienceMode = 'normal' | '3d'

export const MODE_ROUTE: Record<ExperienceMode, string> = {
  normal: ROUTES.normal,
  '3d': ROUTES.experience,
}

export const MODE_LABEL: Record<ExperienceMode, string> = {
  normal: 'Normal',
  '3d': '3D',
}
