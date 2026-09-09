
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
 * buttons rather than dead ones — and says plainly when the demo needs an
 * account instead of implying it is open.
 *
 * The live demo is the prominent action because it is the one that shows the
 * work running; source and write-up sit beside it as quiet links.
 */
export function ProjectActions({ project }: { project: Project }) {
  const actions = projectActions(project)
  const access = project.access

  /*
   * Every action opens a new tab, including the same-origin ones. The 3D page
   * is its own document, so following a link here tears down the scene and
   * loses the visitor's place in the journey.
   */

  // The interactive demo leads when there is one: it is the thing that shows
  // the work running. Otherwise the deployed instance keeps the position it
  // had, so nothing changes for a project without a demo.
  const demo =
    actions.find((action) => action.id === 'interactiveDemo') ??
    actions.find((action) => action.id === 'demo')
  const rest = actions.filter((action) => action !== demo)

  const needsSignIn = demo !== undefined && access?.kind === 'sign-in-required'
  const hasPublicLogin = demo !== undefined && access?.kind === 'public-demo'

  if (actions.length === 0) return null

  return (
    <div>
      {needsSignIn && (
        <div className="mb-4">
          <p className="text-mist text-[10px] tracking-[0.3em] uppercase">Demo access</p>
          <p className="text-mist mt-2 text-sm leading-relaxed">
            {access.note ?? 'This project requires sign-in.'}
          </p>
        </div>
      )}

      {hasPublicLogin && (
        <div className="border-scene-line mb-4 rounded-lg border p-3">
          <p className="text-mist text-[10px] tracking-[0.3em] uppercase">Demo account</p>
          {access.note !== undefined && (
            <p className="text-mist mt-2 text-xs leading-relaxed">{access.note}</p>
          )}
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs">
            <dt className="text-mist">user</dt>
            <dd className="text-chalk break-all">{access.username}</dd>
            <dt className="text-mist">pass</dt>
            <dd className="text-chalk break-all">{access.password}</dd>
          </dl>
        </div>
      )}

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
