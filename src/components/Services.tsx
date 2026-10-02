import { services } from "../data/services";
import ServiceCard from "./ServiceCard";
import Section from "./Section";

/**
 * The four services proven by a featured project, in the same order as the
 * Projects grid above them. The other three — the one service that
 * generalises rather than points at a project, and the two services proven
 * by a project that is no longer featured — live on the full catalog page.
 */
const STRIP_IDS = ["support-recovery", "inbox-crm", "recruitment", "rag-knowledge"] as const;

export default function Services() {
  const strip = STRIP_IDS.map((id) => services.find((service) => service.id === id)!);

  return (
    <Section
      id="services"
      eyebrow="Services"
      title="What I can build for your business"
      intro="Four of the seven, each already built and running. The figures under each one come from that project's own test suite."
      ground="canvas"
    >
      {/* Two columns from the medium breakpoint. Three would leave each card
          too narrow for a sentence of specifics, which is the part that makes
          a service concrete rather than a label. */}
      <div className="grid gap-6 md:grid-cols-2">
        {strip.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      <p className="mt-8 text-body text-ink-muted">
        <a
          href="/services.html"
          className="font-semibold text-ink underline underline-offset-4 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          See all services →
        </a>
      </p>
    </Section>
  );
}
