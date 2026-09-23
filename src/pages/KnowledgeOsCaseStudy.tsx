import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { enquiryMailto } from "../data/contact";
import { projectById, requiredLink } from "../data/projects";
import Screenshot from "../components/Screenshot";
import KnowledgeOsFlow from "../components/caseStudy/KnowledgeOsFlow";
import Callout from "../components/caseStudy/Callout";
import ResultsPanel, { type Result } from "../components/caseStudy/ResultsPanel";
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
  { name: "PostgreSQL 16 + pgvector", role: "The only datastore, served from the pgvector/pg16 image" },
  { name: "SQLAlchemy 2.x + Alembic", role: "Data access and migrations" },
  { name: "sentence-transformers", role: "Local embeddings and reranking" },
  { name: "Google Gemini", role: "Generation, behind a provider interface" },
  { name: "Jinja2", role: "Server-rendered UI" },
  { name: "Docker", role: "Demo and deployment packaging" },
];

/**
 * Engineering test-suite figures, verified directly against the repository's
 * own documentation — not retrieval or answer-quality evaluation results.
 * See "Evaluation approach" below for why no such result exists to report.
 */
const RESULTS: Result[] = [
  {
    figure: "88",
    label: "P3 demo-suite tests passing",
    detail:
      "test_demo_e2e.py, test_demo_fixtures.py, test_demo_reranking.py, test_demo_llm.py and test_demo_app.py — the demo-focused suite specifically, not the project's overall test count.",
  },
  {
    figure: "1,026",
    label: "Full suite passing, with PostgreSQL",
    detail:
      "11 failed and 1 skipped in this documented environment. All 11 failures are pre-existing and environment-specific, not P3 regressions.",
  },
  {
    figure: "588",
    label: "Full suite passing, without PostgreSQL",
    detail:
      "362 tests that need a database skip cleanly rather than failing.",
  },
  {
    figure: "7 / 9",
    label: "Alembic migrations / tables",
    detail:
      "The test suite builds its schema by running the real migrations, not a shortcut, so this figure is what actually exists rather than what's assumed.",
  },
];

const RESULTS_CAPTION =
  "These are engineering test-suite figures, verified directly from the repository — not retrieval or answer-quality evaluation results. No official evaluation of either harness has been run against real models in any environment; see Evaluation approach above.";

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
            An organization accumulates 100+ SOPs, policies and manuals faster
            than anyone can search them by hand. Ask an LLM the same question
            instead, and it will often answer confidently whether or not it
            actually knows — and a wrong answer that cites nothing is
            indistinguishable from a right one.
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
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Four things are treated as separate architectural and evaluation
            concerns, because each can fail on its own: whether the right
            evidence was retrieved, whether the answer actually used it,
            whether every citation is valid, and whether the system abstained
            when it should have. These are what the two evaluation harnesses
            below are built to measure — not figures reported from production
            use.
          </p>
        </Section>

        {/* 4. HOW RETRIEVAL WORKS */}
        <Section eyebrow="How it works" title="Nine stages, from document to checked answer">
          <KnowledgeOsFlow />
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Retrieval runs: normalize → embed → vector retrieval + lexical
            retrieval → RRF → dedupe → top 20. Fusion combines the two
            channels by Reciprocal Rank Fusion — score(d) = Σ 1 / (k +
            rank_i(d)), with a default k of 60 — summed only over the
            channels a chunk actually appears in. A chunk found by just one
            channel contributes one term; there is no penalty and no imputed
            rank for the channel that missed it. No measured retrieval
            accuracy is claimed here — see Evaluation approach below.
          </p>
        </Section>

        {/* 5. HOW RERANKING WORKS */}
        <Section eyebrow="Reranking" title="A second pass, measured rather than assumed">
          <p className="max-w-3xl text-body text-ink-muted">
            Three providers sit behind the same interface:
            CrossEncoderRerankProvider, the real model; PassthroughRerankProvider,
            a shipped production configuration that preserves the fused order
            when reranking must stay model-free — not a test-only fallback;
            and FakeRerankProvider, used only inside tests. Candidates are
            sorted by score descending, tie-broken by chunk_uid ascending.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The documented <em>cs001</em> fixture — a severity-one incident
            notification question — shows why this matters: raw RRF
            fusion alone ranks a same-document neighbor ahead of the golden
            chunk; the real, precomputed cross-encoder scores correct that
            ordering. That&apos;s a specific, reproducible fixture finding,
            not a statistical quality claim, and cross-encoder serving has
            not itself been exercised in production here — see Production
            boundary below.
          </p>
        </Section>

        {/* 6. CITATIONS & PROVENANCE */}
        <Section eyebrow="Trust" title="A citation that can't be checked doesn't count">
          <p className="max-w-3xl text-body text-ink-muted">
            The reranked top 20 candidates are reduced to a fixed top 8
            before generation — the evidence set an answer is actually built
            from. Every citation the model produces is checked against that
            set before the answer is ever shown.
          </p>
          <Callout
            badge="8"
            heading="An invalid citation rejects the answer — it is never shown."
          >
            <p className="mt-1 text-small text-ink-muted">
              Four checks run before an answer is persisted: every cited
              chunk must exist in the retrieved evidence, every sentence must
              carry a citation marker, a citation must point at one of the
              selected top 8 chunks, and the declared citation list must
              exactly match the markers actually present in the text. Any
              failure raises a citation error, and the answer is rejected —
              not shown, not stored.
            </p>
          </Callout>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            This is citation and provenance validation, not a claim of
            factual correctness — it proves a citation points at real,
            retrieved evidence, not that the evidence itself is right.
          </p>
        </Section>

        {/* 7. DETERMINISTIC, CREDENTIAL-FREE DEMO */}
        <Section eyebrow="The demo" title="The real pipeline, replayed deterministically">
          <p className="max-w-3xl text-body text-ink-muted">
            The deterministic, credential-free demo wraps the real
            application factory and overrides the same FastAPI dependency
            seam the test suite already uses — it is not a second query
            pipeline. Three deterministic providers replay real, precomputed
            output: BGE embeddings, cross-encoder scores, and hand-verified
            answers with their citation markers — all running through the
            real, unmodified citation validation and grounding path.
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-small text-ink-muted">
            <li>
              <strong className="text-ink">da001</strong> — grounded
              retrieval, cited from the golden chunk.
            </li>
            <li>
              <strong className="text-ink">cs001</strong> — the
              reranking-matters behavior described above.
            </li>
            <li>
              <strong className="text-ink">cv001</strong> — a superseded
              document version is excluded before reranking even runs.
            </li>
            <li>
              <strong className="text-ink">md001</strong> — an answer cites
              evidence drawn from two different documents.
            </li>
            <li>
              <strong className="text-ink">ie001</strong> — a genuine gap in
              the corpus triggers the real abstention path.
            </li>
          </ul>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            <strong className="text-ink">88 tests passed</strong> refers to
            this demo-focused suite specifically — not the project&apos;s
            overall test count (see Engineering evidence below).
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Docker demo-packaging assets are committed and statically
            verified, but Docker end-to-end execution has not been verified —
            the Docker daemon was unavailable in the environment this was
            built in. The demo itself was verified once, manually, through a
            direct uvicorn process against a disposable PostgreSQL + pgvector
            instance.{" "}
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
            Two offline harnesses run from the command line, never as an API
            endpoint. The retrieval suite reports six metrics — Recall@5,
            Recall@10, Precision@5, MRR, nDCG@10, and metadata-filter
            correctness — over a fixed corpus of 10 documents and 52
            questions across 8 categories, with every expected chunk ID read
            back from the real seeded corpus.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            One document, the Production Database Access SOP, has a second
            version that materially changes the answer — seven days and one
            approver in v1, a three-day grant and two approvers in v2 — used
            to prove version-aware retrieval rather than just claim it.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The answer suite adds a 29/23 dev/test split for
            abstention-threshold calibration. The calibration method is
            implemented and unit-tested, but only 7 of the 52 questions are
            expected-abstain cases — a sample the repository itself documents
            as too small for statistical confidence.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            <strong className="text-ink">
              No official retrieval or answer-quality evaluation numbers have
              been produced.
            </strong>{" "}
            Both harnesses require real local models that have never been
            available together in this environment; a run that cannot reach
            them writes nothing — no report, no recorded metric.
          </p>
        </Section>

        {/* 9. ENGINEERING EVIDENCE */}
        <Section eyebrow="Engineering evidence" title="Verified, not claimed">
          <ResultsPanel results={RESULTS} caption={RESULTS_CAPTION} />
          <ul className="mt-6 flex flex-col gap-2 text-small text-ink-muted">
            <li>CI runs the full suite with no external API key configured.</li>
            <li>
              Offline Hugging Face settings make real-model tests skip
              deterministically in CI, the same way they skip in local
              development.
            </li>
            <li>
              Static checks guard the architecture itself: no application
              module may select a fake provider, the application never
              imports the evaluation package, and PostgreSQL full-text search
              is never mislabelled as BM25.
            </li>
            <li>
              One active version per document is enforced by a partial
              unique database index, not application code — the test suite
              builds its schema from the real migrations to prove the index
              is actually there.
            </li>
            <li>
              Unknown model pricing raises a configuration error rather than
              silently becoming zero; an unconfigured cost stays null, never
              zero.
            </li>
          </ul>
        </Section>

        {/* 10. PRODUCTION BOUNDARY */}
        <Section eyebrow="Production boundary" title="What's implemented, and what's been run">
          <p className="max-w-3xl text-body text-ink-muted">
            Live Mode is fully implemented: real embedding, real reranking
            and real Gemini generation are the production default for every
            provider dependency. Two things have actually been run for real,
            once: the BGE and cross-encoder models were exercised directly
            during demo-fixture generation, and the deterministic demo itself
            was verified manually, once, through a direct uvicorn process
            against a disposable PostgreSQL + pgvector instance.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Three things have not been exercised in any environment to date:
            a full Live Mode query end to end with all three real providers
            together, including Gemini; a Docker image build or container
            run; and an official evaluation of either harness. None of this
            is a claim that the architecture is invalid — it is the current,
            honestly-stated verification boundary.
          </p>
        </Section>

        {/* 11. HONEST LIMITATIONS */}
        <Section eyebrow="Where it stands" title="What this is not, yet">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "No official evaluation numbers",
                detail:
                  "Both harnesses are implemented and unit-tested, but neither has been run against real models in any environment — no retrieval or answer-quality figure exists to report.",
              },
              {
                title: "Docker not verified end to end",
                detail:
                  "Demo-packaging assets are committed and statically checked. Docker itself was never available to actually build or run them here.",
              },
              {
                title: "PostgreSQL full-text search is not BM25",
                detail:
                  "The lexical retrieval channel uses Postgres's own ranking, which behaves differently — this isn't claimed otherwise.",
              },
              {
                title: "Semantic grounding is evaluation-time only",
                detail:
                  "It never runs inside a live query, by design — production grounding is the deterministic layer alone.",
              },
              {
                title: "The abstention threshold has never been calibrated",
                detail:
                  "The score-based trigger stays inactive. Only an explicit insufficient-evidence signal from the model, or zero retrieved candidates, cause an abstention today.",
              },
              {
                title: "Fixed-size chunking",
                detail:
                  "512 tokens with 64-token overlap. Semantic chunking is deferred — not evaluable at this corpus size.",
              },
              {
                title: "No authentication or authorization layer",
                detail:
                  "Anyone who can reach the UI can ask a question and leave feedback. No enterprise-security claim is made.",
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
            Screenshots of the query box, an answer with its citations, the
            document list, and the evaluation-results page are added in a
            later milestone. The verified target routes are the UI&apos;s
            own: /ui/, /ui/documents/…, /ui/query, /ui/answers/… and
            /ui/evals.
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
