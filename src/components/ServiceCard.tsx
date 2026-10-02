import { enquiryMailto } from "../data/contact";
import { projectById } from "../data/projects";
import { type services } from "../data/services";

/**
 * The project that proves a service, resolved from canonical data.
 *
 * `Service.provenBy` is a ProjectId and `projectById` throws on a miss, so a
 * broken reference stops the page at startup instead of rendering a link to
 * nowhere. Nothing about the project is stored here — the title and the case
 * study come from the project itself every render.
 */
function provenBy(service: (typeof services)[number]) {
  if (service.provenBy === undefined) return null;
  const project = projectById(service.provenBy);
  return project.caseStudyHref === undefined
    ? null
    : { title: project.title, href: project.caseStudyHref };
}

/**
 * One card shape for every service. Shared between the homepage's four-card
 * strip and the full `/services.html` catalog, so a service reads identically
 * wherever it appears.
 */
export default function ServiceCard({ service }: { service: (typeof services)[number] }) {
  return (
    <article
      id={`service-${service.id}`}
      /* scroll-mt clears the fixed header, so a card linked from a
         project lands below it rather than under it. */
      className="flex scroll-mt-24 flex-col gap-4 rounded-card border border-line bg-surface p-6 shadow-resting sm:p-7"
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-subhead text-balance text-ink">{service.name}</h3>
        <p className="text-small text-ink-muted">{service.positioning}</p>
      </div>

      <div className="border-t border-line pt-4">
        <p className="text-eyebrow uppercase text-ink-muted">What I build</p>
        <p className="mt-2 text-small text-ink-muted">{service.builds}</p>
      </div>

      {/* WHAT PROVES THIS.

          The link goes to that project's case study — the written account —
          rather than to a demo, because the question this line answers is
          "has this actually been built", not "can I click it".

          A service with no `provenBy` gets no invented proof; its own
          `caveat` below says so. */}
      {provenBy(service) && (
        <p className="text-meta text-ink-muted">
          Proven by{" "}
          <a
            href={provenBy(service)!.href}
            aria-label={`Proven by ${provenBy(service)!.title}: read the case study`}
            className="font-semibold text-ink underline underline-offset-4 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {provenBy(service)!.title}
          </a>
        </p>
      )}

      {/* Said plainly where a service generalises rather than pointing at
          something shipped. A client who finds that out later has been
          sold a story. */}
      {service.caveat && (
        <p className="text-meta text-ink-muted">{service.caveat}</p>
      )}

      <p className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-4 text-meta text-ink-muted">
        {service.evidence.map((item, index) => (
          <span key={item} className="flex items-center gap-x-2">
            {index > 0 && <span aria-hidden="true">·</span>}
            <span>{item}</span>
          </span>
        ))}
      </p>

      {/* The proof CTA leads; the enquiry sits beside it as a quiet text
          link so it never competes with "see it working". The subject is
          built from the service's own canonical name, so a message
          arrives already saying which one it is about — the name is not
          restated here. */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href={service.cta.href}
          {...(service.cta.href.startsWith("http")
            ? { target: "_blank", rel: "noreferrer" }
            : {})}
          className="group inline-flex h-control items-center gap-2 rounded-control bg-brand px-4 text-small font-semibold text-white hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {service.cta.label}
          <span
            aria-hidden="true"
            className="inline-block transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>
        {/* Several cards render this link, each opening a message about a
            different service. The visible text stays short and identical
            by design — the name is already the card's heading — so the
            service is added to the accessible name instead, for anyone
            hearing the links out of that context. Opens with the visible
            text so WCAG 2.5.3 (Label in Name) still holds. */}
        <a
          href={enquiryMailto(service.name)}
          aria-label={`Discuss this service: ${service.name}`}
          /* A real height rather than padding with a negative margin: this
             row wraps at narrow widths, so a hit box larger than the
             laid-out box would reach up into the proof CTA above it and
             steal taps meant for that button. */
          className="inline-flex items-center max-md:min-h-11 text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Discuss this service
        </a>
      </div>
    </article>
  );
}
