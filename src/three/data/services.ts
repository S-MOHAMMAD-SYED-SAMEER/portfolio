import { services as CANONICAL } from '../../data/services.ts'

/**
 * The services wall in the workshop.
 *
 * WHY THIS FILE IS NOW AN ADAPTER
 *
 * It used to author its own four services — "AI Automation", "AI Integration",
 * "Web Development", "Business Automation" — none of which matched the
 * positioning labels the rest of the site uses, and none of which carried the
 * evidence the homepage cards do. Two surfaces were describing the same
 * business in different words, with nothing keeping them in step.
 *
 * The canonical list now lives in `src/data/services.ts`. This file only
 * reshapes it for the panel, which wants a title, one line, and a short third
 * line — a different shape from the homepage card, not different content.
 *
 * WHAT THE THIRD LINE SHOWS
 *
 * The old field was `delivers`, a list of hand-written deliverables. It is now
 * `evidence`, carrying the same verified figures the homepage shows, because
 * inventing a deliverables list for the sake of the old field name would have
 * put an unbacked claim into the scene. The panel renders it identically.
 */
export interface Service {
  id: string
  title: string
  summary: string
  /** Verified figures, joined into one line by the panel. */
  evidence: readonly string[]
}

export const SERVICES: readonly Service[] = CANONICAL.map((service) => ({
  id: service.id,
  title: service.name,
  summary: service.positioning,
  evidence: service.evidence,
}))

/** Shown under the list; routes to the contact panel rather than a form. */
export const SERVICES_CTA = 'Start a conversation'
