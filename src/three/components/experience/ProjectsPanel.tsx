import {
  PROJECTS,
  PROJECT_STATUS_LABEL,
  caseStudySections,
  projectById,
  projectActions,
  projectHighlights,
  type Project,
  type ProjectId,
} from '@/data/projects'
import { ProjectActions } from '@/components/experience/ProjectActions'
import { ProjectEvidence } from '@/components/experience/ProjectEvidence'
import { cn } from '@/lib/cn'

interface ProjectsPanelProps {
  project: ProjectId | null
  highlighted: ProjectId | null
  onSelect: (id: ProjectId) => void
  onHighlight: (id: ProjectId | null) => void
  onBack: () => void
  /** Two columns, for the workspace display, which is landscape. */
  landscape?: boolean
}

/**
 * Projects: a list of systems, and the case study behind one of them.
 *
 * Two views in one component because they are one destination — the list is
 * an index of what is on the screens, and selecting an entry is stepping
 * closer to read it. Editorial rather than a card grid: rules, not boxes.
 */
/**
 * Names what is behind the row, rather than describing the click.
 *
 * "Inspect" tells a visitor nothing about where they are going, and the
 * destinations — a written case study, an in-browser demo, the deployed
 * application, the source — are the reason to go. The list is derived from
 * `projectActions`, so a project without one of them never advertises it and
 * nothing here is a second copy of the link data.
 */
function destinationSummary(project: Project): string {
  const ids = new Set(projectActions(project).map((action) => action.id))
  const parts: string[] = []
  if (ids.has('caseStudy')) parts.push('Case study')
  if (ids.has('interactiveDemo') || ids.has('demo')) parts.push('demos')
  if (ids.has('github')) parts.push('source')
  if (parts.length === 0) return 'Inspect'
  if (parts.length === 1) return parts[0]!
  return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1]!
}

export function ProjectsPanel({
  project,
  highlighted,
  onSelect,
  onHighlight,
  onBack,
  landscape = false,
}: ProjectsPanelProps) {
  const selected = project === null ? undefined : projectById(project)

  /*
   * LANDSCAPE: the shape the workspace display actually is.
   *
   * The screen above the bench is 6.8 m wide and 3.9 m tall, and it projects
   * that way at every breakpoint. Stacked list-then-detail is portrait, so it
   * overhung the screen top and bottom and read as a sheet in front of the
   * room rather than the software running on it. Two columns — the three
   * systems on the left, whichever one is selected on the right — is the
   * shape the screen has.
   *
   * Same data, same selection state, same actions; only the arrangement
   * differs, and only where a screen is hosting it.
   *
   * A phone gets one column, so it gets master-then-detail instead: below
   * `sm` the list steps aside for the selected project rather than sitting
   * above it. Both columns at that width put the detail below the fold of a
   * 256px pane, which made tapping a project look like it had done nothing.
   */
  if (landscape) {
    return (
      <div className="grid gap-3 sm:grid-cols-[9.5rem_1fr]">
        <ul
          className={cn(
            'divide-scene-line sm:border-scene-line divide-y sm:border-r sm:pr-2',
            selected !== undefined && 'max-sm:hidden',
          )}
        >
          {PROJECTS.map((entry) => {
            const active = entry.id === project
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onSelect(entry.id)}
                  onMouseEnter={() => onHighlight(entry.id)}
                  onMouseLeave={() => onHighlight(null)}
                  onFocus={() => onHighlight(entry.id)}
                  onBlur={() => onHighlight(null)}
                  aria-pressed={active}
                  aria-label={`${entry.title}: ${destinationSummary(entry)}`}
                  className={cn(
                    'focus-ring block w-full rounded px-2 py-2 text-left transition-colors',
                    active || entry.id === highlighted
                      ? 'bg-scene-surface'
                      : 'hover:bg-scene-surface/60',
                  )}
                >
                  <span className="text-mist block text-[9px] tracking-[0.25em] uppercase">
                    {entry.category}
                  </span>
                  <span className="text-chalk mt-1 block text-xs leading-snug font-medium">
                    {entry.title}
                  </span>
                  {/* The figure stays in the list, not only in the detail
                      pane: proof at a glance is the whole reason this
                      portfolio leads with counts rather than adjectives. */}
                  <span className="text-mist mt-1 block text-[10px]">
                    {entry.proof.tests.toLocaleString()} tests
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="min-w-0">
          {selected === undefined ? (
            <p className="text-mist text-xs leading-relaxed">
              Three systems, each built end to end and testable. Choose one to see what it solves,
              what it is built from, and where to open it.
            </p>
          ) : (
            <SelectedProject project={selected} onBack={onBack} />
          )}
        </div>
      </div>
    )
  }

  if (selected !== undefined) {
    return <CaseStudy project={selected} onBack={onBack} />
  }

  return (
    <ul className="divide-scene-line divide-y">
      {PROJECTS.map((entry) => (
        <li key={entry.id} className="first:pt-0 last:pb-0">
          <button
            type="button"
            onClick={() => onSelect(entry.id)}
            onMouseEnter={() => onHighlight(entry.id)}
            onMouseLeave={() => onHighlight(null)}
            onFocus={() => onHighlight(entry.id)}
            onBlur={() => onHighlight(null)}
            aria-label={`${destinationSummary(entry)} for ${entry.title}`}
            className={cn(
              'focus-ring group -mx-2 block w-full rounded-lg px-2 py-5 text-left transition-colors duration-200',
              entry.id === highlighted ? 'bg-scene-surface/50' : 'hover:bg-scene-surface/40',
            )}
          >
            <p className="text-mist text-[10px] tracking-[0.3em] uppercase">{entry.category}</p>
            <h3 className="text-chalk mt-1.5 text-base leading-snug font-medium">{entry.title}</h3>
            <p className="text-mist mt-2 text-sm leading-relaxed">{entry.shortDescription}</p>

            <div className="text-mist mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {projectHighlights(entry).map((highlight) => (
                <span key={highlight}>{highlight}</span>
              ))}
            </div>

            <span className="text-accent mt-3 inline-block text-xs">
              {destinationSummary(entry)} →
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/**
 * One project, at the size a wall display can carry.
 *
 * Deliberately not the case study: this is the gateway, and the written
 * account is one click away through the actions below. Title, what it solves,
 * the verified figures, and where to open it — all read from the same
 * canonical entry every other surface reads.
 *
 * The proof properties the case study lists in full are summarised to one
 * line here on purpose. Stacked, they filled the pane and pushed the links
 * below the fold, which is the wrong thing to lose on the one surface whose
 * job is to get a visitor into the work.
 */
function SelectedProject({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <article>
      {/* Only where the list has stepped aside. On a wider screen it is still
          sitting to the left, and a back button that goes nowhere visible is
          worse than none. */}
      <button
        type="button"
        onClick={onBack}
        className="focus-ring text-mist hover:text-chalk mb-2 -ml-1 rounded px-1 text-[11px] tracking-wide transition-colors sm:hidden"
      >
        ← All projects
      </button>

      <p className="text-mist text-[9px] tracking-[0.25em] uppercase">{project.category}</p>
      <h3 className="text-chalk mt-1 text-sm leading-snug font-semibold">{project.title}</h3>
      <p className="text-mist mt-2 text-xs leading-relaxed">{project.shortDescription}</p>

      <p className="text-mist mt-2 text-[11px] leading-relaxed">
        {project.proof.tests.toLocaleString()} automated tests
        {project.proof.evaluation !== null && ` · ${project.proof.evaluation} evaluation`}
        {' · '}
        {PROJECT_STATUS_LABEL[project.status]}
      </p>

      <div className="mt-3">
        <ProjectActions project={project} />
      </div>
    </article>
  )
}

function CaseStudy({ project, onBack }: { project: Project; onBack: () => void }) {
  const sections = caseStudySections(project)
  // No links means no actions block, and no rule introducing one.
  const hasActions = projectActions(project).length > 0

  return (
    <article>
      <button
        type="button"
        onClick={onBack}
        className="focus-ring text-mist hover:text-chalk -mx-1 rounded px-1 text-xs tracking-wide transition-colors"
      >
        ← Back to projects
      </button>

      <p className="text-mist mt-5 text-[10px] tracking-[0.3em] uppercase">{project.category}</p>
      <h3 className="text-chalk mt-1.5 text-xl leading-snug font-medium">{project.title}</h3>
      <p className="text-mist mt-3 text-sm leading-relaxed">{project.shortDescription}</p>

      <Rule />

      {/* Proof leads, because it is the part that is actually recorded. */}
      <Section title="Proof">
        <dl className="flex flex-wrap gap-x-8 gap-y-3">
          <Stat label="Automated tests" value={project.proof.tests.toLocaleString()} />
          {project.proof.evaluation !== null && (
            <Stat label="Evaluation" value={project.proof.evaluation} />
          )}
          <Stat label="Status" value={PROJECT_STATUS_LABEL[project.status]} />
        </dl>

        {project.proof.properties.length > 0 && (
          <ul className="mt-4 space-y-1">
            {project.proof.properties.map((property) => (
              <li key={property} className="text-mist flex gap-2 text-xs leading-relaxed">
                <span aria-hidden className="text-accent/70">
                  —
                </span>
                {property}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {project.screenshots.length > 0 && (
        <>
          <Rule />
          <Section title="Evidence">
            <ProjectEvidence shots={project.screenshots} />
          </Section>
        </>
      )}

      {sections.map((section) => (
        <div key={section.id}>
          <Rule />
          <Section title={section.title}>
            {typeof section.body === 'string' ? (
              <p className="text-mist text-sm leading-relaxed">{section.body}</p>
            ) : (
              <ul className="space-y-1.5">
                {section.body.map((line) => (
                  <li key={line} className="text-mist flex gap-2 text-sm leading-relaxed">
                    <span aria-hidden className="text-accent/70">
                      —
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      ))}

      {project.technologies.length > 0 && (
        <>
          <Rule />
          <Section title="Technology">
            <p className="text-mist text-sm leading-relaxed">{project.technologies.join(' · ')}</p>
          </Section>
        </>
      )}

      {hasActions && (
        <>
          <Rule />
          <ProjectActions project={project} />
        </>
      )}
    </article>
  )
}

function Rule() {
  return <hr className="border-scene-line my-6" />
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="text-mist mb-3 text-[10px] tracking-[0.3em] uppercase">{title}</h4>
      {children}
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-mist text-[10px] tracking-[0.2em] uppercase">{label}</dt>
      <dd className="mt-1 text-lg font-medium">{value}</dd>
    </div>
  )
}
