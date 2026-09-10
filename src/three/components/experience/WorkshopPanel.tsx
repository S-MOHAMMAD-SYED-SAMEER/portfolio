import { useState } from 'react'
import { cn } from '@/lib/cn'
import { ABOUT } from '@/data/about'
import { ContactPanel } from '@/components/experience/ContactPanel'
import { ProjectsPanel } from '@/components/experience/ProjectsPanel'
import type { ProjectId } from '@/data/projects'
import { SERVICES, SERVICES_CTA } from '@/data/services'
import { WorkspaceNav } from '@/components/experience/WorkspaceNav'
import { searchWorkspace, type WorkspaceView } from '@/systems/workspaceView'
import { SKILL_GROUPS } from '@/data/skills'
import { AREA_LABEL, type WorkshopArea } from '@/systems/workshopArea'

interface WorkshopPanelProps {
  area: WorkshopArea
  /** Laid into the studio screen rather than standing beside the room. */
  onScreen: boolean
  onClose: () => void
  onOpen: (area: WorkshopArea) => void
  /** Projects has one layer inside it: the case study being read. */
  project: ProjectId | null
  highlightedProject: ProjectId | null
  onSelectProject: (id: ProjectId) => void
  onHighlightProject: (id: ProjectId | null) => void
  onClearProject: () => void
}

/**
 * The content for one destination.
 *
 * A column on desktop and a sheet on a phone, both leaving the room visible
 * alongside — the point of building this in 3D is lost the moment a panel
 * covers it. Same palette as everything else: dark ground, one accent, no
 * cards.
 */
export function WorkshopPanel({
  area,
  onScreen,
  onClose,
  onOpen,
  project,
  highlightedProject,
  onSelectProject,
  onHighlightProject,
  onClearProject,
}: WorkshopPanelProps) {
  /* Which face of the display is showing, and what has been typed into it.
     Local to the panel on purpose: it is presentation, not journey state, and
     nothing outside this screen needs to know. Both change only on a click or
     a keystroke — no timer, no per-frame work anywhere in this subtree.

     The destination that was opened decides only where the screen starts;
     from there the nav is what says what it shows. The panel is keyed by area
     upstream, so arriving at Services opens on Services rather than leaving
     Projects lit while the header says something else. */
  const [view, setView] = useState<WorkspaceView>(area === 'services' ? 'services' : 'projects')
  const [query, setQuery] = useState('')
  const found = searchWorkspace(query)

  /* The nav belongs to the studio screen, not to Skills, About or Contact —
     those are other places in the room. */
  const isWorkspace = onScreen

  return (
    <aside
      aria-label={AREA_LABEL[area]}
      /* TWO PLACES A PANEL CAN BE, AND THEY LOOK DIFFERENT ON PURPOSE.

         On the display, it fills the quad `ScreenAnchor` projects for the
         panel and brings no surface of its own: no card, no border, no
         shadow, no corners. The lit panel behind it is the surface, and a
         strip of it stays visible inside the bezel on all four sides. Only
         `workspace-light` comes along, inverting the eight scene tokens for
         this subtree so the type is ink on a lit screen rather than chalk on
         a dark room — see index.css.

         Anywhere else it is a panel in the room, on the room's own dark
         ground. A white card standing in front of the studio is exactly what
         it should not look like when there is no screen under it. */
      className={cn(
        'pointer-events-auto flex flex-col',
        onScreen
          ? 'workspace-light h-full w-full'
          : 'border-scene-line bg-scene-ink max-h-[62dvh] w-full rounded-lg border shadow-[0_20px_70px_rgba(4,7,12,0.6)] sm:w-[23rem]',
      )}
    >
      <header
        className={cn(
          'border-scene-line flex shrink-0 items-center justify-between border-b',
          /* Chrome costs the same pixels the content needs, and on the panel
             there are far fewer of them to go round. */
          onScreen ? 'px-3.5 py-1.5' : 'px-4 py-2.5',
        )}
      >
        <p className="text-mist text-[11px] tracking-[0.35em] uppercase">{AREA_LABEL[area]}</p>
        <button
          type="button"
          onClick={onClose}
          className="focus-ring text-mist hover:text-chalk rounded-full px-2 py-1 text-xs tracking-wide transition-colors"
        >
          Close
        </button>
      </header>

      {isWorkspace && <WorkspaceNav view={view} query={query} onView={setView} onQuery={setQuery} />}

      {/* `min-h-0` so this scrolls inside the screen's height instead of
          growing the content past the bezel. */}
      <div className={cn('min-h-0 flex-1 overflow-y-auto', onScreen ? 'px-3.5 py-3' : 'px-4 py-4')}>
        {/* On the screen the nav decides what is shown, and the destination
            that opened it only decided where it started. Previously the area
            and the view both had a say, so Done and Building did nothing at
            all if Services had been the way in. */}
        {onScreen ? (
          <>
            {/* Projects and Done are the same three systems: all three are
                finished, so the honest difference between the tabs is none. */}
            {(view === 'projects' || view === 'done') && (
              <ProjectsPanel
                landscape
                project={project}
                highlighted={highlightedProject}
                onSelect={onSelectProject}
                onHighlight={onHighlightProject}
                onBack={onClearProject}
              />
            )}
            {view === 'services' && <Services onOpen={onOpen} />}
            {view === 'building' && <NothingBuilding />}
            {view === 'search' && <SearchResults found={found} query={query} />}
          </>
        ) : (
          <>
            {area === 'skills' && <Skills />}
            {area === 'about' && <About />}
            {area === 'contact' && <ContactPanel />}
          </>
        )}
      </div>
    </aside>
  )
}

function Skills() {
  return (
    <ul className="space-y-6">
      {SKILL_GROUPS.map((group) => (
        <li key={group.id}>
          <p className="text-mist text-[10px] tracking-[0.3em] uppercase">{group.title}</p>
          <p className="mt-2 text-sm leading-relaxed">{group.items.join(' · ')}</p>
        </li>
      ))}
    </ul>
  )
}

function Services({ onOpen }: { onOpen: (area: WorkshopArea) => void }) {
  return (
    <div>
      <ul className="space-y-6">
        {SERVICES.map((service) => (
          <li key={service.id}>
            <h3 className="text-chalk text-base font-medium">{service.title}</h3>
            <p className="text-mist mt-1.5 text-sm leading-relaxed">{service.summary}</p>
            <p className="text-mist mt-2 text-xs">{service.evidence.join(' · ')}</p>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onOpen('contact')}
        className="focus-ring text-accent mt-7 rounded text-sm hover:underline"
      >
        {SERVICES_CTA} →
      </button>
    </div>
  )
}

function About() {
  return (
    <div>
      <p className="text-sm font-medium tracking-[0.12em]">{ABOUT.name}</p>
      <p className="text-mist mt-1 text-[10px] tracking-[0.3em] uppercase">{ABOUT.title}</p>

      <div className="mt-5 space-y-4">
        {ABOUT.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-mist text-sm leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}

/**
 * What "Building" honestly contains.
 *
 * Nothing, and it is meant to. Every flagship project is live, there is no
 * fourth in the repository, and the brief that governs this work says to stop
 * adding them. A tab that quietly invented a placeholder to look busy would be
 * the one dishonest thing on a portfolio built to be checkable.
 */
function NothingBuilding() {
  return (
    <div className="border-scene-line rounded border border-dashed px-4 py-6">
      <p className="text-chalk text-sm font-medium">No current flagship project listed.</p>
      <p className="text-mist mt-2 text-xs leading-relaxed">
        All three systems below are finished, deployed and testable. New work appears here when
        there is something real to show.
      </p>
    </div>
  )
}

/**
 * Search results over the canonical set.
 *
 * Seven entries exist, so this filters rather than searches. An empty query
 * prompts rather than listing everything: a workspace that dumps its whole
 * dataset the moment the field is focused is noisier than one that waits.
 */
function SearchResults({
  found,
  query,
}: {
  found: ReturnType<typeof searchWorkspace>
  query: string
}) {
  if (query.trim() === '') {
    return (
      <p className="text-mist text-xs leading-relaxed">
        Search the three systems and four services by name, what they do, or what they are built
        from.
      </p>
    )
  }

  const total = found.projects.length + found.services.length
  if (total === 0) {
    return <p className="text-chalk text-sm">No matching projects or services.</p>
  }

  return (
    <div className="flex flex-col gap-5">
      {found.projects.length > 0 && (
        <div>
          <p className="text-mist text-[10px] tracking-[0.3em] uppercase">Projects</p>
          <ul className="divide-scene-line mt-2 divide-y">
            {found.projects.map((project) => (
              <li key={project.id} className="py-2.5">
                <p className="text-chalk text-sm font-medium">{project.title}</p>
                <p className="text-mist mt-1 text-xs leading-relaxed">{project.shortDescription}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {found.services.length > 0 && (
        <div>
          <p className="text-mist text-[10px] tracking-[0.3em] uppercase">Services</p>
          <ul className="divide-scene-line mt-2 divide-y">
            {found.services.map((service) => (
              <li key={service.id} className="py-2.5">
                <p className="text-chalk text-sm font-medium">{service.title}</p>
                <p className="text-mist mt-1 text-xs leading-relaxed">{service.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
