import { projectById, type ProjectId } from '../../data/projects'

/**
 * Where the 3D experience can send a visitor.
 *
 * These are the portfolio's real static pages, not routes of a client router:
 * every one is a separate document, so following any of them unmounts the
 * scene and releases the WebGL context. `projectRoute` and `projectDemoRoute`
 * read the canonical project data rather than composing a path, so a page that
 * moves moves in one file.
 */
export const ROUTES = {
  // The 2D gateway, where a visitor chooses a mode. Unused elsewhere in this
  // module, but kept as the literal, accurate answer to "where does `/`
  // go" now that it is the gateway rather than the professional portfolio.
  landing: '/',
  // The professional portfolio itself — moved off `/` and onto its own page
  // once `/` became the gateway above.
  normal: '/home.html',
  experience: '/3d.html',
} as const

export function projectRoute(id: ProjectId): string {
  return projectById(id).caseStudyHref ?? ROUTES.normal
}

export function projectDemoRoute(id: ProjectId): string {
  return projectById(id).interactiveDemoHref ?? projectRoute(id)
}
