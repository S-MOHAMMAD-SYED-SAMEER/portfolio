import Contact from "../components/Contact";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { services } from "../data/services";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur">
        <SkipLink />
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <a href="/home.html" className="text-small font-semibold text-ink">
            ← Home
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/projects.html"
              className="text-small font-semibold text-ink-muted hover:text-ink"
            >
              Projects
            </a>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="mx-auto max-w-5xl px-6 pb-4 pt-16 sm:pt-20">
          <p className="text-eyebrow uppercase text-brand">Services</p>
          <h1 className="mt-4 max-w-3xl text-display-sm text-balance text-ink sm:text-display">
            All seven, in one place
          </h1>
          <p className="mt-6 max-w-2xl text-body text-ink-muted">
            Four of these are proven by one of the six systems above; one
            generalises machinery built for another project rather than
            pointing at a build of its own, and that is said plainly on its
            own card rather than implied.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="grid gap-8 border-t border-line pt-12 md:grid-cols-2">
            <div>
              <h2 className="text-subhead text-ink">What you get</h2>
              <p className="mt-3 text-small text-ink-muted">
                Every system on this site was built, tested and documented
                to the same standard: a public repository, a real automated
                test suite — the figures on each card above are not rounded
                up or aspirational — and a written case study describing
                what was built and why. A commissioned build follows the
                same standard.
              </p>
            </div>

            <div>
              <h2 className="text-subhead text-ink">How I work</h2>
              {/* Not written yet — no engagement process is documented
                  anywhere else on this site, and inventing one here would be
                  exactly the kind of unsupported claim the rest of this page
                  is careful to avoid. Said plainly rather than left unlabeled. */}
              <p className="mt-3 text-small text-ink-muted">
                A full description of how an engagement actually runs isn't
                written up yet. Get in touch and I'll walk you through it for
                your specific situation.
              </p>
            </div>

            <div>
              <h2 className="text-subhead text-ink">Timelines</h2>
              {/* Same: no timeline figures exist anywhere in this repository
                  to draw from, so none are stated here. */}
              <p className="mt-3 text-small text-ink-muted">
                Not published — they depend too much on scope to state a
                single honest number here. Describe what you need and I'll
                give you a real estimate.
              </p>
            </div>

            <div>
              <h2 className="text-subhead text-ink">FAQ</h2>
              <dl className="mt-3 flex flex-col gap-4 text-small text-ink-muted">
                <div>
                  <dt className="font-semibold text-ink">Are the live demos real?</dt>
                  <dd className="mt-1">
                    Yes. The three deployed systems above are the actual
                    applications, open to anyone with the link. First load
                    may take up to a minute while free-tier hosting wakes up.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">
                    What about the three with no public deployment?
                  </dt>
                  <dd className="mt-1">
                    They're complete and source-available, and each one runs
                    its own deterministic, credential-free demo locally — no
                    account, no network call. See "What I build" on the
                    matching card above.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Is pricing published?</dt>
                  <dd className="mt-1">
                    Not yet, for the same reason timelines aren't — reach out
                    and I'll give you a straight answer for your case.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </div>
  );
}
