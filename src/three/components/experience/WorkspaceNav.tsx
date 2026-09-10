import { useId } from 'react'
import { cn } from '@/lib/cn'
import { WORKSPACE_VIEWS, type WorkspaceView } from '@/systems/workspaceView'

/**
 * The workspace display's own navigation: the row along the top of the screen.
 *
 * It belongs to the screen rather than to the room — the areas along the
 * bottom of the overlay move the camera between stations, and these move
 * between what the screen is showing without moving anything.
 */
export function WorkspaceNav({
  view,
  query,
  onView,
  onQuery,
}: {
  view: WorkspaceView
  query: string
  onView: (next: WorkspaceView) => void
  onQuery: (next: string) => void
}) {
  const inputId = useId()

  return (
    <div className="border-scene-line border-b">
      {/* Wraps rather than scrolls: a horizontal scroller hides controls a
          visitor cannot see to reach for. The type and padding are tight
          because the panel this sits on is only a few hundred pixels wide on
          a phone, and two rows of nav there costs a third of the screen. */}
      <div className="flex flex-wrap items-center gap-0.5 px-2.5 py-1">
        {WORKSPACE_VIEWS.map((entry) => {
          const active = entry.id === view
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onView(entry.id)}
              aria-pressed={active}
              className={cn(
                'focus-ring rounded px-2 py-1 text-[10px] font-medium tracking-wide transition-colors',
                active ? 'bg-chalk text-void' : 'text-mist hover:text-chalk',
              )}
            >
              {entry.label}
            </button>
          )
        })}
      </div>

      {view === 'search' && (
        <div className="px-3 pb-3">
          <label htmlFor={inputId} className="sr-only">
            Search projects and services
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            placeholder="Search projects and services"
            onChange={(event) => onQuery(event.target.value)}
            className="border-scene-line bg-scene-surface text-chalk placeholder:text-mist focus-ring w-full rounded border px-2.5 py-1.5 text-xs"
          />
        </div>
      )}
    </div>
  )
}
