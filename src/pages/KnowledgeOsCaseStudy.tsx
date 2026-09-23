import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { enquiryMailto } from "../data/contact";
import { projectById, requiredLink } from "../data/projects";
import Screenshot from "../components/Screenshot";
import KnowledgeOsFlow from "../components/caseStudy/KnowledgeOsFlow";
import Callout from "../components/caseStudy/Callout";
import Section from "../components/Section";

/**
 * This page's project, from the canonical data. See the equivalent comment
 * on the other three case studies for why the lookup goes through the id
 * rather than any string that could independently drift.
 *
 * KnowledgeOS has no `demoHref` or `interactiveDemoHref` — there is no public
 * deployment and no in-browser simulation, so this page is GitHub-first
 * throughout. Only `repoHref` is asserted with `requiredLink`.
 */
const PROJECT = projectById("p4");
const REPO_URL = requiredLink(PROJECT, "repoHref");
const DOCS_URL = `${REPO_URL}/blob/main/docs/DEMO.md`;

const STACK = [
  { name: "Python 3.13", role: "Application language" },
  { name: "FastAPI", role: "HTTP layer" },
  { name: "PostgreSQL 16 + pgvector", role: "The only datastore" },
  { name: "SQLAlchemy 2.x + Alembic", role: "Data access and migrations" },
  { name: "sentence-transformers", role: "Local embeddings and reranking" },
  { name: "Google Gemini", role: "Generation, behind a provider interface" },
  { name: "Jinja2", role: "Server-rendered UI" },
  { name: "Docker", role: "Demo and deployment packaging" },
];

export default function KnowledgeOsCaseStudy() {
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
            Case Study — Standalone Project
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
            deterministic, credential-free demo runs the real query pipeline
            locally — no API key, no network call.
          </p>
          <div className="mt-10">
            <Screenshot
              src="/images/p4-query-answer.png"
              width={1600}
              height={900}
              alt="The query and answer view, once captured."
              caption="Screenshots are added in a later milestone."
            />
          </div>
        </section>

        {/* 2. PROBLEM */}
        <Section eyebrow="The problem" title="Answers with no evidence behind them">
          <p className="max-w-3xl text-body text-ink-muted">
            Internal documentation grows faster than anyone can search by
            hand, and an AI asked the same question will often answer
            confidently whether or not it actually knows. A wrong answer that
            cites nothing is indistinguishable from a right one.
          </p>
        </Section>

        {/* 3. SOLUTION */}
        <Section eyebrow="The solution" title="Answer only from evidence, and check it">
          <p className="max-w-3xl text-body text-ink-muted">
            KnowledgeOS answers only from retrieved documents, cites the exact
            chunk behind every claim, validates each citation in code before
            the answer is shown, and refuses to answer when the evidence
            isn&apos;t sufficient.
          </p>
        </Section>

        {/* 4. HOW RETRIEVAL WORKS */}
        <Section eyebrow="How it works" title="Nine stages, from document to checked answer">
          <KnowledgeOsFlow />
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Retrieval — the fifth stage — runs full-text search and vector
            similarity in parallel over PostgreSQL and fuses the two with
            Reciprocal Rank Fusion.
          </p>
        </Section>

        {/* 5. HOW RERANKING WORKS */}
        <Section eyebrow="Reranking" title="A second pass, measured rather than assumed">
          <p className="max-w-3xl text-body text-ink-muted">
            A local cross-encoder reorders the retrieved candidates, sitting
            behind the same provider interface as every other model in the
            pipeline — alongside a passthrough baseline, so reranking&apos;s
            actual contribution can be measured rather than assumed.
          </p>
        </Section>

        {/* 6. CITATIONS & PROVENANCE */}
        <Section eyebrow="Trust" title="A citation that can't be checked doesn't count">
          <Callout
            badge="8"
            heading="An invalid citation rejects the answer — it is never shown."
          >
            <p className="mt-1 text-small text-ink-muted">
              Every cited chunk is checked against the retrieved evidence in
              code before an answer reaches the screen. A citation that fails
              that check is discarded, not displayed.
            </p>
          </Callout>
        </Section>

        {/* 7. DETERMINISTIC, CREDENTIAL-FREE DEMO */}
        <Section eyebrow="The demo" title="The real pipeline, replayed deterministically">
          <p className="max-w-3xl text-body text-ink-muted">
            A deterministic, credential-free demo runs the exact same
            production query pipeline against committed fixture data — no API
            key, no network call, and no second implementation to drift from
            the real one.{" "}
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="text-small font-semibold text-brand underline underline-offset-4 hover:text-brand/90"
            >
              Read the demo guide on GitHub
            </a>
            .
          </p>
        </Section>

        {/* 8. EVALUATION APPROACH */}
        <Section eyebrow="Evaluation" title="Two harnesses, kept honest">
          <p className="max-w-3xl text-body text-ink-muted">
            Retrieval quality and answer quality are measured by two separate
            offline harnesses, run against a fixed fixture corpus. Neither has
            been run officially against the full evaluation corpus yet — no
            result is claimed here until one has.
          </p>
        </Section>

        {/* 9. ENGINEERING EVIDENCE */}
        <Section eyebrow="Engineering evidence" title="Verified, not claimed">
          <p className="max-w-3xl text-body text-ink-muted">
            Test counts, CI status and the architecture-enforcing checks
            behind this project are added here in P4B, sourced directly from
            the KnowledgeOS repository.
          </p>
        </Section>

        {/* 10. PRODUCTION BOUNDARY */}
        <Section eyebrow="Production boundary" title="What's implemented, and what's been run">
          <p className="max-w-3xl text-body text-ink-muted">
            Both the demo path and the full production path — real
            embeddings, real reranking, real generation — are implemented.
            What has and has not been exercised end to end in this
            environment is detailed in P4B.
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
                  "The evaluation harnesses exist and are correct against fixtures, but neither has been run against the full corpus yet.",
              },
              {
                title: "Untested at scale",
                detail:
                  "Verified on a small fixture corpus; behavior at a much larger document count has not been measured.",
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
            Screenshots of the query, answer, citation and abstention states
            are added in a later milestone.
          </p>
        </Section>

        {/* 14. CLOSING CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-4">
          <div className="rounded-card border border-line bg-canvas p-8 sm:p-10">
            <h2 className="text-section text-ink">Read the source</h2>
            <p className="mt-3 max-w-2xl text-ink-muted">
              The full engineering record — every milestone, every decision,
              every limitation — is in the repository itself.
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
                Talk about retrieval-grounded answers
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
