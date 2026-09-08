import { cn } from '@/lib/cn'
import { MODE_LABEL, MODE_ROUTE, type ExperienceMode } from '@/systems/experienceMode'

const MODES: readonly ExperienceMode[] = ['normal', '3d']

/**
 * Lets the visitor move between the Normal portfolio and the 3D experience
 * from anywhere inside either mode.
 *
 * WHY <nav> RATHER THAN role="group"
 *
 * These two are links to other documents, and they are the only ones on the
 * page — every other control here changes the scene rather than leaving it. So
 * this is the route out of the 3D experience, and `<nav>` is what it is:
 * native semantics replacing an explicit ARIA role, not a landmark added to
 * satisfy a checklist. It also takes the page from one landmark to two, so the
 * way out can be found by jumping between landmarks rather than only by
 * tabbing from the top.
 *
 * The label is kept, so it is announced as "Experience mode" either way, and
 * `inline-flex` still comes from the class list — the rendered box does not
 * move.
 */
export function ModeSwitch({ mode = '3d' }: { mode?: ExperienceMode }) {

  return (
    <nav
      aria-label="Experience mode"
      className="border-scene-line bg-scene-ink/70 inline-flex rounded-full border p-1 backdrop-blur-sm"
    >
      {MODES.map((option) => {
        const isActive = option === mode

        return (
          <a
            key={option}
            href={MODE_ROUTE[option]}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'focus-ring rounded-full px-4 py-1.5 text-xs font-medium tracking-wider uppercase transition-colors duration-200',
              isActive ? 'bg-chalk text-void' : 'text-mist hover:text-chalk',
            )}
          >
            {MODE_LABEL[option]}
          </a>
        )
      })}
    </nav>
  )
}
