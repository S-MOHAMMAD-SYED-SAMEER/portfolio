import { services } from "../data/services";
import Section from "./Section";

/**
 * What a client can commission, between what I can do and what I have built.
 *
 * Skills answers "what is he capable of" and Projects answers "has he actually
 * done it". Neither answers "what would I be buying", which is the question a
 * prospective client arrives with — so this sits between them, and each card
 * hands off to the proof directly below it.
 *
 * Every card carries its own evidence line for the same reason the project
 * cards do: a service claim with no figure behind it is a brochure.
 */
export default function Services() {
  return (
    <Section
      id="services"
      eyebrow="Services"
      title="What I can build for your business"
      intro="Four things, each already built and running. The figures under each one come from that project's own test suite."
      ground="surface"
    >
      {/* Two columns from the medium breakpoint. Three would leave each card
          too narrow for a sentence of specifics, which is the part that makes
          a service concrete rather than a label. */}
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <article
            key={service.id}
            className="flex flex-col gap-4 rounded-card border border-line bg-canvas p-6 shadow-resting sm:p-7"
          >
            <div className="flex flex-col gap-3">
              {/* h3: the section's own h2 comes from Section, and the page's
                  single h1 is the hero. */}
              <h3 className="text-subhead text-balance text-ink">{service.name}</h3>
              <p className="text-small text-ink-muted">{service.positioning}</p>
            </div>

            <div className="border-t border-line pt-4">
              <p className="text-eyebrow uppercase text-ink-muted">What I build</p>
              <p className="mt-2 text-small text-ink-muted">{service.builds}</p>
            </div>

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

            <div>
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
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
