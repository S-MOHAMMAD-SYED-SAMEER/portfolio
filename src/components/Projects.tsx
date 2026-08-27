import { projects, type Project } from "../data/projects";
import ProjectSystemSnapshot from "./ProjectSystemSnapshot";
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
 * system diagram, the proof figures and the action buttons are all driven by
 * the data, so a project with no deployed demo simply has no demo button —
 * rather than a disabled one, or worse, a link to nothing.
 */
function ProjectCard({ project }: { project: Project }) {
  const deployed = Boolean(project.demoHref);

  return (
    <article className="flex flex-col gap-5 rounded-card border border-line bg-surface p-6 shadow-resting sm:p-7">
      {project.snapshot && <ProjectSystemSnapshot variant={project.snapshot} />}

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
        {project.caseStudyHref && (
          <a
            href={project.caseStudyHref}
            onClick={markProjectsAsOrigin}
            className="inline-flex h-control items-center rounded-control bg-brand px-4 text-small font-semibold text-white hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            View case study
          </a>
        )}
        {project.demoHref && (
          <a
            href={project.demoHref}
            target="_blank"
            rel="noreferrer"
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
            className="inline-flex h-control items-center px-1 text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            GitHub
          </a>
        )}
      </div>
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
      intro="Three systems, each built end to end, tested and documented. Two are live and testable right now; the third is complete and not yet deployed, and says so."
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
