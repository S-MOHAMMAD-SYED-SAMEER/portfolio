
import { projectActions, type Project } from '@/data/projects'
import { cn } from '@/lib/cn'

const PRIMARY_ACTION_CLASS = cn(
  'focus-ring bg-accent text-void inline-flex items-center gap-2 rounded-full',
  'px-5 py-2.5 text-sm font-medium tracking-wide transition-colors duration-200',
  'hover:bg-accent/85',
)

const SECONDARY_ACTION_CLASS = 'focus-ring text-accent rounded text-sm hover:underline'

/**
 * What a visitor can actually do with a project.
 *
 * Renders only the links that exist — a project with no URLs produces no
 * buttons rather than dead ones.
 *
 * The interactive demo is the prominent action when the project has one,
 * because it is the one that shows the work running; otherwise the case study
 * takes that position. Source and the remaining write-up sit beside it as
 * quiet links.
 */
export function ProjectActions({ project }: { project: Project }) {
  const actions = projectActions(project)

  /*
   * Every action opens a new tab, including the same-origin ones. The 3D page
   * is its own document, so following a link here tears down the scene and
   * loses the visitor's place in the journey.
   */

  const demo =
    actions.find((action) => action.id === 'interactiveDemo') ??
    actions.find((action) => action.id === 'caseStudy')
  const rest = actions.filter((action) => action !== demo)

  if (actions.length === 0) return null

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {demo !== undefined &&
          (
            <a
              href={demo.href}
              target={demo.external ? '_blank' : undefined}
              rel={demo.external ? 'noreferrer noopener' : undefined}
              aria-label={demo.accessibleName}
              className={cn(PRIMARY_ACTION_CLASS)}
            >
              {demo.label} →
            </a>
          )}

        {rest.map((action) => (
            <a
              key={action.id}
              href={action.href}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noreferrer noopener' : undefined}
              aria-label={action.accessibleName}
              className={SECONDARY_ACTION_CLASS}
            >
              {action.label} →
            </a>
          ),
        )}
      </div>
    </div>
  )
}
