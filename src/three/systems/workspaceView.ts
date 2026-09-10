import { PROJECTS, type Project } from '@/data/projects'
import { SERVICES, type Service } from '@/data/services'

/**
 * Which face of the workspace display is showing.
 *
 * WHY THESE FIVE AND NOT A LONGER SET
 *
 * They are the questions a visitor actually arrives with — what has been
 * built, what can be bought, what is finished, what is underway — plus a way
 * to cut straight to one of them. Every one is answered from canonical data,
 * and one of them is answered honestly with nothing.
 *
 * THE EMPTY VIEW IS THE POINT, NOT AN OVERSIGHT
 *
 * `building` has no entries and is expected to have none. Every flagship
 * project is live, there is no fourth in the repository, and CLAUDE.md says to
 * stop adding them. The honest thing a workspace can say is that nothing is
 * listed, so that is what it says — inventing a placeholder to fill a tab is
 * the one thing this portfolio has consistently refused to do.
 *
 * Kept out of the component file so the module exports either components or
 * values, never both.
 */
export type WorkspaceView = 'projects' | 'services' | 'done' | 'building' | 'search'

export const WORKSPACE_VIEWS: readonly { id: WorkspaceView; label: string }[] = [
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'done', label: 'Done' },
  { id: 'building', label: 'Building' },
  { id: 'search', label: 'Search' },
]

export interface WorkspaceMatches {
  projects: readonly Project[]
  services: readonly Service[]
}

/**
 * What a query matches, over the canonical set and nothing else.
 *
 * Seven entries — three projects, four services — so this is a filter, not a
 * search engine: no index, no ranking, no external service. It reads the same
 * `PROJECTS` and `SERVICES` every other 3D surface reads, both of which derive
 * from the portfolio's canonical data, so a result can never describe
 * something that does not exist.
 *
 * An empty query matches nothing rather than everything: the panel prompts
 * instead, because a workspace that dumps its whole dataset the moment the
 * field is focused is noisier than one that waits.
 */
export function searchWorkspace(query: string): WorkspaceMatches {
  const q = query.trim().toLowerCase()
  if (q === '') return { projects: [], services: [] }

  return {
    projects: PROJECTS.filter((project) =>
      [project.title, project.category, project.shortDescription, ...project.proof.properties]
        .join(' ')
        .toLowerCase()
        .includes(q),
    ),
    services: SERVICES.filter((service) =>
      [service.title, service.summary, ...service.evidence].join(' ').toLowerCase().includes(q),
    ),
  }
}
