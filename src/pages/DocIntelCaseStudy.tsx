import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { enquiryMailto } from "../data/contact";
import { projectById, requiredLink } from "../data/projects";
import Screenshot from "../components/Screenshot";
import DocIntelFlow from "../components/caseStudy/DocIntelFlow";
import Section from "../components/Section";

/**
 * This page's project, from the canonical data. See the equivalent comment
 * on the other four case studies for why the lookup goes through the id
 * rather than any string that could independently drift.
 *
 * DocIntel has no `demoHref` or `interactiveDemoHref` — there is no public
 * deployment and no in-browser simulation, so this page is GitHub-first
 * throughout. Only `repoHref` is asserted with `requiredLink`.
 */
const PROJECT = projectById("p5");
const REPO_URL = requiredLink(PROJECT, "repoHref");
const DOCS_URL = `${REPO_URL}/blob/main/docs/DEMO.md`;

const STACK = [
  { name: "Python 3.13", role: "Application language" },
  { name: "FastAPI", role: "HTTP layer" },
  { name: "Pydantic v2", role: "Strict schema validation" },
  { name: "SQLAlchemy 2.x + Alembic", role: "Data access and migrations" },
  { name: "PostgreSQL", role: "The datastore" },
  { name: "Anthropic SDK", role: "Vision extraction, behind a provider interface" },
  { name: "pypdfium2 + Pillow", role: "Page rendering" },
  { name: "Docker", role: "Demo and deployment packaging" },
];

export default function DocIntelCaseStudy() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur">
        <SkipLink />
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <a href="/#projects" className="text-small font-semibold text-ink">
            ← AI Business Automation
          </a>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* GitHub-first: this project has no live deployment, so the
                filled primary slot the other case studies give their demo
                goes to the repository instead. */}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-control bg-brand px-4 py-2 text-small font-semibold text-white hover:bg-brand/90"
            >
              View on GitHub
            </a>
          </div>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        {/* 1. HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-4 pt-16 sm:pt-20">
          <p className="text-eyebrow uppercase text-brand">
            Document Intelligence
          </p>
          <h1 className="mt-4 max-w-3xl text-display-sm text-ink sm:text-display">
            {PROJECT.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-muted">
            {PROJECT.description}
          </p>
          <div className="flex flex-wrap gap-4 pt-8">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-control bg-brand px-6 py-3 text-small font-semibold text-white hover:bg-brand/90"
            >
              View on GitHub
            </a>
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-control border border-line-strong px-6 py-3 text-small font-semibold text-ink hover:border-ink-muted"
            >
              Read the Demo Guide
            </a>
          </div>
          <p className="mt-4 text-meta text-ink-muted">
            A standalone repository with no public deployment. A
            deterministic, credential-free demo runs the real pipeline
            locally — no API key, no network call.
          </p>
          <div className="mt-10">
            <Screenshot
              src="/images/p5-review-queue.png"
              width={1600}
              height={900}
              alt="The review queue, once captured."
              caption="Screenshots are added in a later milestone."
            />
          </div>
        </section>

        {/* 2. PROBLEM */}
        <Section eyebrow="The problem" title="A model that guesses silently">
          <p className="max-w-3xl text-body text-ink-muted">
            Businesses receive invoices and purchase orders as PDFs and
            photographs and need reliable structured data out of them.
            Handing a page to a vision model and trusting what comes back is
            not enough — the full problem and evidence are added in a later
            milestone.
          </p>
        </Section>

        {/* 3. SOLUTION */}
        <Section eyebrow="The solution" title="Know which fields to trust">
          <p className="max-w-3xl text-body text-ink-muted">
            DocIntel extracts documents into a validated schema, checks the
            result deterministically outside the model, and routes anything
            uncertain to a human. The central idea — knowing which fields to
            trust — is detailed in a later milestone.
          </p>
        </Section>

        {/* 4. HOW EXTRACTION WORKS */}
        <Section eyebrow="How it works" title="Twelve stages, from upload to evaluation">
          <DocIntelFlow />
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Invoices and purchase orders share this same pipeline. Stage
            detail is added in a later milestone.
          </p>
        </Section>

        {/* 5. DETERMINISTIC VALIDATION */}
        <Section eyebrow="Validation" title="Checked in code, not by the model">
          <p className="max-w-3xl text-body text-ink-muted">
            Dates, currency codes and totals arithmetic are checked outside
            the model. The specific checks are added in a later milestone.
          </p>
        </Section>

        {/* 6. CONFIDENCE, REVIEW & CORRECTIONS */}
        <Section eyebrow="Trust" title="Uncertain fields go to a person">
          <p className="max-w-3xl text-body text-ink-muted">
            Each field is scored from multiple signals and routed to a human
            when uncertain. A correction is recorded without discarding the
            model&apos;s original answer. The scoring and review mechanics
            are added in a later milestone.
          </p>
        </Section>

        {/* 7. DETERMINISTIC, CREDENTIAL-FREE DEMO */}
        <Section eyebrow="The demo" title="The real pipeline, replayed deterministically">
          <p className="max-w-3xl text-body text-ink-muted">
            A deterministic, credential-free demo runs the real pipeline
            against a small set of known sample invoices — no API key, no
            network call.{" "}
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="text-small font-semibold text-brand underline underline-offset-4 hover:text-brand/90"
            >
              Read the demo guide on GitHub
            </a>
            . The full demo mechanics are added in a later milestone.
          </p>
        </Section>

        {/* 8. EVALUATION APPROACH */}
        <Section eyebrow="Evaluation" title="Measured, not assumed">
          <p className="max-w-3xl text-body text-ink-muted">
            A labelled dataset and a reproducible harness measure accuracy,
            review rate and cost outside of production use. No official
            benchmark result is presented here — the full evaluation detail
            is added in a later milestone.
          </p>
        </Section>

        {/* 9. ENGINEERING EVIDENCE */}
        <Section eyebrow="Engineering evidence" title="Verified, not claimed">
          <p className="max-w-3xl text-body text-ink-muted">
            Test counts, migration history and architecture-enforcing checks
            are added here in a later milestone, sourced directly from the
            DocIntel repository.
          </p>
        </Section>

        {/* 10. PRODUCTION BOUNDARY */}
        <Section eyebrow="Production boundary" title="What's implemented, and what's been run">
          <p className="max-w-3xl text-body text-ink-muted">
            What is implemented and what has actually been exercised —
            including the current, undocumented Docker verification status —
            is detailed in a later milestone.
          </p>
        </Section>

        {/* 11. HONEST LIMITATIONS */}
        <Section eyebrow="Where it stands" title="What this is not, yet">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "No public deployment",
                detail:
                  "This is a standalone, built system — not a hosted service.",
              },
              {
                title: "No official evaluation numbers",
                detail:
                  "The full evaluation detail is added in a later milestone.",
              },
              {
                title: "Full limitations pending",
                detail:
                  "The complete, source-verified list is added in a later milestone.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-card border border-line bg-canvas p-5"
              >
                <p className="text-small font-semibold text-ink">
                  {item.title}
                </p>
                <p className="mt-2 text-small leading-relaxed text-ink-muted">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 12. TECH STACK */}
        <Section eyebrow="Built with" title="Technology">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STACK.map((item) => (
              <div
                key={item.name}
                className="rounded-card border border-line px-4 py-3"
              >
                <p className="text-small font-semibold text-ink">
                  {item.name}
                </p>
                <p className="mt-1 text-meta text-ink-muted">{item.role}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 13. SCREENSHOTS */}
        <Section eyebrow="The product" title="Seeing it work">
          <p className="max-w-3xl text-body text-ink-muted">
            Screenshots of the review queue and the interactive API docs are
            added in a later milestone. The verified target routes are
            /review and /docs.
          </p>
        </Section>

        {/* 14. CLOSING CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-4">
          <div className="rounded-card border border-line bg-canvas p-8 sm:p-10">
            <h2 className="text-section text-ink">Read the source</h2>
            <p className="mt-3 max-w-2xl text-ink-muted">
              The full engineering record — every decision, every limitation
              — is in the repository itself.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-control bg-brand px-6 py-3 text-small font-semibold text-white hover:bg-brand/90"
              >
                View on GitHub
              </a>
              <a
                href={enquiryMailto(PROJECT.service)}
                className="rounded-control px-4 py-3 text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Talk about document intelligence
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
