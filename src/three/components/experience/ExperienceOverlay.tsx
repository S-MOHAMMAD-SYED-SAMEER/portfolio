import { ActionButton } from '@/components/ActionButton'
import { ModeSwitch } from '@/components/navigation/ModeSwitch'
import { DialoguePanel } from '@/components/experience/DialoguePanel'
import { PlaybackSwitch } from '@/components/experience/PlaybackSwitch'
import { WorkshopNav } from '@/components/experience/WorkshopNav'
import { WorkshopPanel } from '@/components/experience/WorkshopPanel'
import { cn } from '@/lib/cn'
import { isScreenArea } from '@/systems/workshopArea'
import { STAGE_COPY } from '@/data/experienceCopy'
import type { Journey } from '@/hooks/useJourney'
import type { Workshop } from '@/hooks/useWorkshop'

interface ExperienceOverlayProps {
  journey: Journey
  workshop: Workshop
  inWorkshop: boolean
  /** Closes an open destination first, and only then steps back a beat. */
  onBack: () => void
}

/**
 * DOM UI layered over the canvas.
 *
 * Chrome, not a hero. Through the arrival it is a pair of switches, a caption,
 * whatever the host is saying and at most two buttons. In the workshop it
 * gains the destination row and, when one is chosen, a panel that sits beside
 * the room rather than over it. Everything is a real button, outside the
 * Canvas tree.
 */
export function ExperienceOverlay({
  journey,
  workshop,
  inWorkshop,
  onBack,
}: ExperienceOverlayProps) {
  const copy = STAGE_COPY[journey.stage]
  const isAuto = journey.mode === 'auto'

  // Whether the open destination is one the studio screen shows.
  const onScreen = isScreenArea(workshop.open)

  // Dialogue mid-beat is advanced by Continue; the stage's own wording is
  // saved for the step that actually leaves the room.
  const actionLabel = journey.hasMoreLines ? 'Continue' : copy.action

  const showAction = !isAuto && !journey.isTransition && actionLabel !== undefined
  const showPause = isAuto && !journey.isFinal
  // With a destination open the panel carries its own Close, so the bottom
  // row stands down rather than offering a second button that does the same
  // thing. Escape and Backspace still close it.
  const showBack = journey.canGoBack && !workshop.isOpen
  // Offered from the first beat, not buried at the end of the arrival: a
  // visitor evaluating the work should not have to sit through a minute of
  // cinematic to find out whether there is any.
  const showSkip = journey.canSkipToWork && !workshop.isOpen

  return (
    <div
      data-stage={journey.stage}
      data-mode={journey.mode}
      data-paused={journey.paused ? 'true' : 'false'}
      data-area={workshop.open ?? ''}
      className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 sm:p-10"
    >
      {/* Scrims. The scene is high contrast and the daylight moves through
          the frame, so DOM text needs its own ground to stay readable. */}
      <div
        aria-hidden
        className="from-void/80 absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent"
      />
      <div
        aria-hidden
        className="from-void/95 via-void/65 absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t to-transparent"
      />

      <header className="relative flex items-start justify-between gap-4">
        <h1 className="text-mist text-[10px] tracking-[0.35em] uppercase">3D Experience</h1>
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <ModeSwitch />
          <PlaybackSwitch mode={journey.mode} onChange={journey.setMode} />
        </div>
      </header>

      {/* The panel is a column beside the room on a wide screen and a sheet
          above the controls on a phone; in both the environment stays
          visible. Positioned out of the flow so a tall panel can never push
          the controls off the bottom of the viewport. */}
      {/* Projects and Services are read on the studio display, so their panel
          is laid onto it by `ScreenAnchor`: sized to the panel's projected
          rectangle and then warped into its plane, so the content's edges run
          along the bezel instead of cutting across it. It tracks the camera,
          so it stays on the screen through the whole ease rather than only
          once it settles, and the fallbacks cover the frame or two before the
          first projection lands.

          Everything else is somewhere else in the room and keeps the column
          beside it. */}
      <div
        style={
          onScreen
            ? {
                left: 'var(--screen-x, 22%)',
                top: 'var(--screen-y, 26%)',
                width: 'var(--screen-w, 40vw)',
                height: 'var(--screen-h, 26vh)',
                transform: 'var(--screen-matrix)',
                transformOrigin: '0 0',
                backfaceVisibility: 'hidden',
              }
            : undefined
        }
        className={cn(
          'pointer-events-none absolute flex',
          onScreen
            ? ''
            : 'inset-x-6 bottom-44 justify-end sm:inset-x-auto sm:top-1/2 sm:right-10 sm:bottom-auto sm:-translate-y-1/2',
        )}
      >
        {workshop.open !== null && (
          <WorkshopPanel
            /* A different destination is a different screen: keying on the
               area resets which view is showing and anything typed into the
               search field, rather than carrying one destination's state
               into the next. */
            key={workshop.open}
            onScreen={onScreen}
            area={workshop.open}
            onClose={workshop.close}
            onOpen={workshop.select}
            project={workshop.project}
            highlightedProject={workshop.highlightedProject}
            onSelectProject={workshop.selectProject}
            onHighlightProject={workshop.highlightProject}
            onClearProject={workshop.clearProject}
          />
        )}
      </div>

      <div className="relative">
        {copy.label !== undefined && !inWorkshop && (
          <p className="text-mist text-[11px] tracking-[0.35em] uppercase">{copy.label}</p>
        )}

        {copy.heading !== undefined && journey.dialogue === null && (
          <p className="mt-2 text-3xl leading-snug font-medium sm:text-4xl">{copy.heading}</p>
        )}

        {!inWorkshop && (
          <div className="mt-3">
            <DialoguePanel
              line={journey.dialogue}
              showSpeaker={journey.dialogue?.gesture === 'present'}
            />
          </div>
        )}

        {/* The greeting steps aside once a destination is open — on a
            narrow screen the sheet reaches down into this line. */}
        {inWorkshop && journey.dialogue !== null && !workshop.isOpen && (
          <div className="mb-3">
            <DialoguePanel line={journey.dialogue} showSpeaker={false} />
          </div>
        )}

        {inWorkshop && (
          <WorkshopNav
            highlighted={workshop.highlighted}
            open={workshop.open}
            onHighlight={workshop.highlight}
            onSelect={workshop.select}
          />
        )}

        {/* Back sits left of the action so the pair reads as one control
            group and never stacks on top of itself on a narrow screen. */}
        <div className="pointer-events-auto mt-4 flex flex-wrap items-center gap-3">
          {showBack && (
            <ActionButton onClick={onBack} variant="secondary">
              Back
            </ActionButton>
          )}

          {showAction && <ActionButton onClick={journey.advance}>{actionLabel}</ActionButton>}

          {showSkip && (
            <ActionButton onClick={journey.skipToWork} variant="secondary">
              Skip to the work
            </ActionButton>
          )}

          {showPause && (
            <ActionButton onClick={journey.togglePause} variant="secondary">
              {journey.paused ? 'Resume' : 'Pause'}
            </ActionButton>
          )}

          {isAuto && (
            <p className="text-mist text-[10px] tracking-[0.3em] uppercase">
              {journey.paused ? 'Paused' : 'Auto'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
