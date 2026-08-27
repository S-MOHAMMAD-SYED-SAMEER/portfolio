import { projects, type Project } from "../data/projects";
import ProjectThumbnail from "./ProjectThumbnail";
import Section from "./Section";

/**
 * The featured project gets the full width and every action it actually has.
 * Only completed work qualifies — the visual weight is the honest signal, not
 * decoration.
 *
 * Two things are conditional rather than assumed. The thumbnail renders only
 * for a project that has one: an illustration drawn for one product would
 * misrepresent another, and a card without one simply uses the full width.
 * "Deployed" is appended only when there is a demo to deploy to, so a project
 * that is built but unhosted cannot claim a deployment it does not have.
 */
function FeaturedProject({ project }: { project: Project }) {
  const hasThumbnail = Boolean(project.thumbnail);

  return (
    <article className="overflow-hidden rounded-card border border-line bg-surface shadow-resting">
      <div className="grid lg:grid-cols-5">
        {hasThumbnail && (
          <div className="border-b border-line p-6 sm:p-8 lg:col-span-2 lg:border-b-0 lg:border-r">
            <ProjectThumbnail />
          </div>
        )}

        <div
          className={`flex flex-col gap-4 p-6 sm:p-8 ${
            hasThumbnail ? "lg:col-span-3" : "lg:col-span-5"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-pill bg-brand"
            />
            <span className="text-eyebrow uppercase text-brand">
              {project.status}
              {project.demoHref ? " · Deployed" : ""}
            </span>
          </div>

          <h3 className="text-section text-balance text-ink">
            {project.title}
          </h3>
          <p className="max-w-xl text-body text-ink-muted">
            {project.description}
          </p>

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

          <div className="mt-2 flex flex-wrap items-center gap-3">
            {project.caseStudyHref && (
              <a
                href={project.caseStudyHref}
                className="inline-flex h-control-lg items-center rounded-control bg-brand px-5 text-small font-semibold text-white hover:bg-brand/90"
              >
                View Case Study
              </a>
            )}
            {project.demoHref && (
              <a
                href={project.demoHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-control-lg items-center rounded-control border border-line-strong px-5 text-small font-semibold text-ink hover:border-ink-muted"
              >
                Live Demo
              </a>
            )}
            {project.repoHref && (
              <a
                href={project.repoHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-control-lg items-center px-2 text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Unfinished work, kept visibly unfinished: recessed ground, no thumbnail, no
 * actions, and the "In development" status stated plainly. A visitor should be
 * able to tell at a glance which of these they can actually try.
 */
function UpcomingProject({ project }: { project: Project }) {
  return (
    <article className="flex flex-col gap-3 rounded-card border border-line bg-canvas p-6">
      <span className="w-fit rounded-pill border border-line-strong px-3 py-1 text-meta text-ink-muted">
        {project.status}
      </span>
      <h3 className="text-subhead text-ink">{project.title}</h3>
      <p className="text-meta uppercase tracking-wide text-ink-muted">
        {project.service}
      </p>
      <p className="text-small text-ink-muted">{project.description}</p>
    </article>
  );
}

export default function Projects() {
  const featured = projects.filter((project) => project.featured);
  const upcoming = projects.filter((project) => !project.featured);

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Working systems, not concepts"
      intro="Two are live and testable right now. The third is complete but not yet deployed, and says so."
      ground="surface"
      size="large"
    >
      <div className="flex flex-col gap-10">
        {featured.map((project) => (
          <FeaturedProject key={project.title} project={project} />
        ))}

        {upcoming.length > 0 && (
          <div>
            <h3 className="text-eyebrow uppercase text-ink-muted">
              In development
            </h3>
            {/* Two columns at most: three 200px cards at the old sm breakpoint
                left no room for the content inside them. */}
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {upcoming.map((project) => (
                <UpcomingProject key={project.title} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
