import { enquiryMailto } from "../data/contact";
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

            {/* The proof CTA leads; the enquiry sits beside it as a quiet text
                link so it never competes with "see it working". The subject is
                built from the service's own canonical name, so a message
                arrives already saying which of the four it is about — the
                name is not restated here. */}
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
              {/* Four cards render this link, each opening a message about a
                  different service. The visible text stays short and identical
                  by design — the name is already the card's heading — so the
                  service is added to the accessible name instead, for anyone
                  hearing the links out of that context. Opens with the visible
                  text so WCAG 2.5.3 (Label in Name) still holds. */}
              <a
                href={enquiryMailto(service.name)}
                aria-label={`Discuss this service: ${service.name}`}
                /* A real height rather than padding with a negative margin:
                   this row wraps at 390px, so a hit box larger than the
                   laid-out box would reach up into the proof CTA above it and
                   steal taps meant for that button.
                   Scoped to max-md because a real height does move the layout —
                   the row grows from 40px to 44px. Below md that is the point;
                   at md and above the card keeps the proportions it shipped
                   with, where a mouse does not need the extra 4px. */
                className="inline-flex items-center max-md:min-h-11 text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Discuss this service
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
