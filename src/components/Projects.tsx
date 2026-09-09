import { projects, type Project } from "../data/projects";
import Screenshot from "./Screenshot";
import Section from "./Section";

/**
 * Marks the current history entry as the Projects section before a case-study
 * link is followed.
 *
 * A visitor scrolls to Projects, opens a case study, and presses Back — and
 * lands at the top of the homepage, because the entry they left was plain `/`.
 * The section they were reading is nowhere in the URL, so the browser has
 * nothing to return them to.
 *
 * `replaceState` edits the entry they are standing on rather than adding one.
 * It does not navigate, does not scroll, and does not fire `hashchange`, so
 * clicking the link behaves exactly as it did — but the entry Back returns to
 * is now `/#projects`, and the browser's own hash handling puts them back where
 * they were. No scroll positions are stored and no timers are involved.
 */
function markProjectsAsOrigin() {
  window.history.replaceState(null, "", "#projects");
}

/**
 * One card shape for every project.
 *
 * The previous arrangement had two: a wide "featured" card with an illustration
 * and every action, and a recessed "in development" card with neither. That
 * made sense when one project was finished and two were not. All three are
 * finished now, and the old split made them look like one real system beside
 * two placeholders.
 *
 * What still varies is what each project genuinely has. The status word, the
 * screenshot, the proof figures and the action buttons are all driven by the
 * data, so a project with no deployed demo simply has no demo button — rather
 * than a disabled one, or worse, a link to nothing.
 *
 * The visual is now a real screenshot. It sits in a fixed-ratio window with
 * `object-cover object-top`, which does two things: every card keeps the same
 * height whatever the capture's proportions are — they range from 3.1:1 to
 * 0.6:1 — and a tall page shows its top rather than being squashed edge to
 * edge. The full captures are on the case-study pages, where there is room.
 */
function ProjectCard({ project }: { project: Project }) {
  const deployed = Boolean(project.demoHref);

  return (
    <article className="flex flex-col gap-5 rounded-card border border-line bg-surface p-6 shadow-resting sm:p-7">
      {project.screenshot && (
        <Screenshot
          frame="card"
          src={project.screenshot.src}
          alt={project.screenshot.alt}
          width={project.screenshot.width}
          height={project.screenshot.height}
        />
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-pill ${
              deployed ? "bg-brand" : "bg-line-strong"
            }`}
          />
          {/* "Deployed" is appended only when there is something to open, so a
              built-but-unhosted project cannot claim a deployment it lacks. */}
          <span
            className={`text-eyebrow uppercase ${
              deployed ? "text-brand" : "text-ink-muted"
            }`}
          >
            {project.status}
            {deployed ? " · Deployed" : ""}
          </span>
        </div>

        <h3 className="text-subhead text-balance text-ink">{project.title}</h3>
        <p className="text-small text-ink-muted">{project.description}</p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-pill border border-line px-3 py-1 text-meta text-ink-muted"
          >
            {tag}
          </li>
        ))}
      </ul>

      {project.proof && project.proof.length > 0 && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-4 text-meta text-ink-muted">
          {project.proof.map((item, index) => (
            <span key={item} className="flex items-center gap-x-2">
              {index > 0 && <span aria-hidden="true">·</span>}
              <span>{item}</span>
            </span>
          ))}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3">
        {/* Leads, because it is the one action every visitor can take right
            now: no account, no cold start, no waiting. The deployed demo is
            still linked beside it and still described as the real thing. */}
        {/* WHY EVERY ACTION HERE CARRIES AN aria-label
            Three cards render this same row, so a screen reader listing the
            page's links hears "Try interactive demo" three times, "View case
            study" three times, "Live demo" three times and "GitHub" three
            times, with nothing saying which project each belongs to. The card
            heading supplies that visually; a link list has no headings in it.
            The visible text stays as it is — short, and the same across cards
            on purpose — and the project name is added for anyone who cannot
            see which card the link sits in.
            Each label OPENS with the visible text verbatim, which is what
            WCAG 2.5.3 (Label in Name) requires: a speech-input user says
            "click Live demo" and the accessible name still matches. */}
        {project.interactiveDemoHref && (
          <a
            href={project.interactiveDemoHref}
            onClick={markProjectsAsOrigin}
            aria-label={`Try interactive demo: ${project.title}`}
            className="inline-flex h-control items-center rounded-control bg-brand px-4 text-small font-semibold text-white hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Try interactive demo
          </a>
        )}
        {project.caseStudyHref && (
          <a
            href={project.caseStudyHref}
            onClick={markProjectsAsOrigin}
            aria-label={`View case study: ${project.title}`}
            className="inline-flex h-control items-center rounded-control border border-line-strong px-4 text-small font-semibold text-ink hover:border-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            View case study
          </a>
        )}
        {project.demoHref && (
          <a
            href={project.demoHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`Live demo: ${project.title}`}
            className="inline-flex h-control items-center rounded-control border border-line-strong px-4 text-small font-semibold text-ink hover:border-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Live demo
          </a>
        )}
        {project.repoHref && (
          <a
            href={project.repoHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`GitHub repository for ${project.title}`}
            className="inline-flex h-control items-center px-1 text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            GitHub
          </a>
        )}
      </div>

      {/* Said before the click, not after it: the button alone cannot tell a
          visitor what a deployment will let them do without an account, or that
          a sleeping free-tier instance takes a moment to answer. Quiet by
          design — it qualifies the action above it rather than competing. */}
      {project.demoHref && project.demoNote && (
        <p className="mt-3 text-meta text-ink-muted">
          <span className="font-semibold">Live demo:</span> {project.demoNote}
        </p>
      )}
    </article>
  );
}

export default function Projects() {
  const complete = projects.filter((project) => project.featured);
  const upcoming = projects.filter((project) => !project.featured);

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Working systems, not concepts"
      intro="Three systems, each built end to end, tested and documented — and all three are live and testable right now."
      ground="surface"
      size="large"
    >
      <div className="flex flex-col gap-10">
        {/* One column on phones, two from the medium breakpoint. Three across
            would leave each card too narrow for its diagram and its buttons. */}
        <div className="grid gap-6 md:grid-cols-2">
          {complete.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        {/* Kept for work that genuinely is unfinished. Nothing renders here
            today, and a project only appears once it stops being featured. */}
        {upcoming.length > 0 && (
          <div>
            <h3 className="text-eyebrow uppercase text-ink-muted">
              In development
            </h3>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {upcoming.map((project) => (
                <article
                  key={project.title}
                  className="flex flex-col gap-3 rounded-card border border-line bg-canvas p-6"
                >
                  <span className="w-fit rounded-pill border border-line-strong px-3 py-1 text-meta text-ink-muted">
                    {project.status}
                  </span>
                  <h4 className="text-subhead text-ink">{project.title}</h4>
                  <p className="text-meta uppercase tracking-wide text-ink-muted">
                    {project.service}
                  </p>
                  <p className="text-small text-ink-muted">
                    {project.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
