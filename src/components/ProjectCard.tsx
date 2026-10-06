import { type Project } from "../data/projects";
import { services } from "../data/services";
import Screenshot from "./Screenshot";

/**
 * The anchor of the service this project proves, or null.
 *
 * `project.service` holds the service NAME and `Service.provenBy` holds the
 * project id — the relationship already exists in canonical data, in both
 * directions. This resolves one to the other at render time rather than
 * storing a third copy of it, so there is nothing new to keep in step.
 *
 * Always points at `/services.html`, never a bare `#service-…` hash: this
 * card renders on the homepage (where only four services exist in the DOM)
 * and on the full `/projects.html` catalog (where none do), so a same-page
 * anchor would silently fail to scroll anywhere for at least one of the two.
 * The full catalog page is where all seven services always live.
 *
 * Returns null rather than guessing when no service claims the project, so
 * a future project with no service simply shows no line.
 */
function serviceAnchor(project: Project): string | null {
  const service = services.find(
    (candidate) => candidate.name === project.service && candidate.provenBy === project.id,
  );
  return service === undefined ? null : `/services.html#service-${service.id}`;
}

/**
 * One card shape for every project.
 *
 * Shared between the homepage's featured grid and the full `/projects.html`
 * catalog, so a project's card looks and behaves identically wherever it
 * appears. `onLinkClick` is the homepage's "mark this scroll position as
 * the Projects section before leaving" hook; the catalog page has no such
 * position to protect, so it simply omits the prop.
 */
export default function ProjectCard({
  project,
  onLinkClick,
}: {
  project: Project;
  onLinkClick?: () => void;
}) {
  return (
    <article className="flex flex-col gap-5 rounded-card border border-line bg-canvas p-6 shadow-resting sm:p-7">
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
            className="h-1.5 w-1.5 rounded-pill bg-line-strong"
          />
          <span className="text-eyebrow uppercase text-ink-muted">
            {project.status}
          </span>
        </div>

        <h3 className="text-subhead text-balance text-ink">{project.title}</h3>
        <p className="text-small text-ink-muted">{project.description}</p>

        {/* Which service this project is evidence for. The link lands on
            that service's own card rather than the top of the section, so
            the answer to "what can I buy that looks like this?" is one
            click and no hunting. */}
        {serviceAnchor(project) && (
          <p className="text-meta text-ink-muted">
            Proves the service{" "}
            <a
              href={serviceAnchor(project)!}
              aria-label={`${project.service}: see the service this project proves`}
              className="font-semibold text-ink underline underline-offset-4 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {project.service}
            </a>
          </p>
        )}
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
        {/* WHY EVERY ACTION HERE CARRIES AN aria-label
            A page can render several of these cards, so a screen reader
            listing its links hears "Try interactive demo", "View case
            study" and "GitHub" several times over, with
            nothing saying which project each belongs to. The card heading
            supplies that visually; a link list has no headings in it.
            Each label OPENS with the visible text verbatim, which is what
            WCAG 2.5.3 (Label in Name) requires. */}
        {project.interactiveDemoHref && (
          <a
            href={project.interactiveDemoHref}
            onClick={onLinkClick}
            aria-label={`Try interactive demo: ${project.title}`}
            className="inline-flex h-control items-center rounded-control bg-brand px-4 text-small font-semibold text-white hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Try interactive demo
          </a>
        )}
        {project.caseStudyHref && (
          <a
            href={project.caseStudyHref}
            onClick={onLinkClick}
            aria-label={`View case study: ${project.title}`}
            className="inline-flex h-control items-center rounded-control border border-line-strong px-4 text-small font-semibold text-ink hover:border-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            View case study
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
    </article>
  );
}
