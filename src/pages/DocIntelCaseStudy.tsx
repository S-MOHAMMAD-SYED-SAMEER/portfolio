import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { enquiryMailto } from "../data/contact";
import { projectById, requiredLink } from "../data/projects";
import Screenshot from "../components/Screenshot";
import DocIntelFlow from "../components/caseStudy/DocIntelFlow";
import ResultsPanel, { type Result } from "../components/caseStudy/ResultsPanel";
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
  { name: "Docker + Compose", role: "Demo and deployment packaging" },
  { name: "pytest", role: "478 tests collected, an autouse guard against real API calls" },
];

/**
 * Engineering test-suite figures, verified directly against the repository's
 * own documentation — not extraction-accuracy or evaluation results. See
 * "Evaluation approach" below for why no such result exists to report.
 */
const RESULTS: Result[] = [
  {
    figure: "477",
    label: "Tests passing",
    detail:
      "478 collected; one known environment-specific failure (tests/test_eval_cli.py::test_json_output_is_machine_readable — a log/capture interleaving issue, not an extraction-quality defect).",
  },
  {
    figure: "260 / 218",
    label: "No-PostgreSQL run",
    detail:
      "260 pass, 218 skip — tests needing a database skip cleanly rather than failing.",
  },
  {
    figure: "6",
    label: "Alembic migrations",
    detail:
      "Six migration files, covering the verified schema evolution from documents through eval_runs.",
  },
];

const RESULTS_CAPTION =
  "These are engineering test-suite figures, verified directly from the repository — not extraction-accuracy or evaluation results. No official real-model benchmark has been run; see Evaluation approach above.";

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
          <p className="mt-4 max-w-2xl text-body font-semibold text-ink">
            The value is in knowing which fields to trust.
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
            photographs, and re-keying them by hand is slow. Handing the page
            to a vision model and trusting what comes back is worse: a model
            can produce a plausible total that&apos;s off by one digit, a
            wrong vendor name, a misread date — and report high confidence
            while doing it. The problem isn&apos;t extraction alone; it&apos;s
            knowing which extracted fields can actually be trusted.
          </p>
        </Section>

        {/* 3. SOLUTION */}
        <Section eyebrow="The solution" title="Check it in Python, not in the prompt">
          <p className="max-w-3xl text-body text-ink-muted">
            If something can be checked deterministically in Python, it is
            checked in Python. DocIntel separates model extraction from
            everything that follows it: schema validation, deterministic
            validation, confidence scoring, human review, and a correction
            and audit trail — each a distinct, testable stage rather than one
            step trusted to get everything right at once.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Invoice and purchase-order documents travel through the same
            application pipeline rather than duplicated, document-specific
            orchestration — app/extraction.py, app/confidence.py,
            app/review.py, app/corrections.py and app/export.py contain zero
            branching on document type. That&apos;s a constraint the codebase
            enforces, not a claim about how the system performs at scale.
          </p>
        </Section>

        {/* 4. HOW EXTRACTION WORKS */}
        <Section eyebrow="How it works" title="Twelve stages, from upload to evaluation">
          <DocIntelFlow />
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Invoice extraction targets 13 fields; purchase order extraction
            targets 10. Both are read through one provider interface —
            extract(images, schema, prompt) returning a RawExtraction — and
            only one module, app/providers/anthropic_vision.py, imports the
            Anthropic SDK. The production factory always resolves that same
            Anthropic provider; it isn&apos;t switched by an environment
            variable. Substitution happens only at the FastAPI dependency
            seam, the same mechanism the deterministic demo below uses.
          </p>
        </Section>

        {/* 5. DETERMINISTIC VALIDATION */}
        <Section eyebrow="Validation" title="Checked in code, not by the model">
          <p className="max-w-3xl text-body text-ink-muted">
            Deterministic checks run after extraction, outside the model
            entirely. Schema-level: required identifiers aren&apos;t blank,
            each date parses, dates fall in the expected order, currency
            codes are valid ISO 4217. Arithmetic: subtotal plus tax equals
            total, line items sum to the subtotal, and each line&apos;s
            quantity times unit price is correct — compared to a
            Decimal(&quot;0.01&quot;) tolerance.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Every check reports passed, failed, or skipped — and skipped
            means the check didn&apos;t apply, not that validation failed. A
            document with no stated subtotal hasn&apos;t got its arithmetic
            wrong; the check for it is simply skipped. None of this measures
            extraction accuracy on its own — it measures whether what the
            model returned is internally consistent.
          </p>
        </Section>

        {/* 6. CONFIDENCE, REVIEW & CORRECTIONS */}
        <Section eyebrow="Trust" title="Uncertain fields go to a person">
          <p className="max-w-3xl text-body text-ink-muted">
            Each field&apos;s confidence is a weighted combination of four
            signals, renormalised over whichever apply: confidence =
            Σ(weight_i × score_i) / Σ(weight_i). Model (0.40) is the
            model&apos;s own self-reported number, and always applies. Schema
            (0.20) and arithmetic (0.20) reflect whether that field&apos;s
            deterministic checks passed. Text layer (0.20) checks whether the
            value is corroborated by the PDF&apos;s own embedded text, only
            when the value is scalar and a text layer exists. Weights are
            configurable, not fixed in the scoring logic.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            A field is routed to review when its score falls below 0.85, or
            when any deterministic check for it failed — a failed check
            forces review regardless of score, because no weighting should
            let a confident model hide a deterministic failure. The review
            queue returns persisted needs_review fields, least confident
            first, and never rescores them: confidence and validation are
            written once, at extraction time.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            A correction becomes ground truth — the model isn&apos;t called
            again and the field isn&apos;t rescored. The corrected value
            replaces what&apos;s stored; the corrections table separately
            records the original value, the corrected value, and when it
            happened. model_confidence, confidence, validation and the raw
            response are left untouched, because they describe the
            model&apos;s original answer, not the correction. Whether a field
            is_corrected is derived from that corrections table, so the two
            can&apos;t drift apart. A document becomes reviewed once no field
            is left needing review.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            This confidence score is a weighted heuristic, not a calibrated
            accuracy metric — the repository does not present it, or
            validate it, as one.
          </p>
        </Section>

        {/* 7. DETERMINISTIC, CREDENTIAL-FREE DEMO */}
        <Section eyebrow="The demo" title="The real pipeline, replayed deterministically">
          <p className="max-w-3xl text-body text-ink-muted">
            A deterministic, credential-free demo swaps in
            DemoExtractionProvider at exactly the same dependency seam the
            production factory uses — the real application factory, the real
            routes, and everything downstream of extraction (schema
            validation, deterministic validation, confidence scoring,
            persistence, review, corrections, export) is the unmodified
            production path.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The demo recognises exactly three known invoices —
            invoice-001, invoice-003, invoice-004 — by taking a SHA-256 hash
            of the concatenated rendered page images, never the
            originally-uploaded file&apos;s own bytes. An unrecognised hash
            raises the same ProviderError a real extraction failure would;
            there&apos;s no approximate matching and no fallback to
            Anthropic.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Fixture values are copied from labels.json, the ground truth
            used to generate the synthetic PDFs — not model-inferred.
            Fixture confidence is hand-authored: invoice-003 deliberately has
            a missing purchase-order number scored at 0.55, below the review
            threshold, specifically to exercise the review queue honestly.
            Token count, cost and latency all stay None on this path —
            nothing is invented.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            This is a different thing from StubProvider, the evaluation
            harness&apos;s own offline provider: StubProvider answers every
            document identically with the same low-confidence structure to
            test the harness itself, and isn&apos;t a measure of extraction
            accuracy either.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Docker packaging for the demo exists, but the current repository
            doesn&apos;t document whether the image has actually been built
            or a container run — that isn&apos;t claimed here either way.
            There is no hosted or public demo.{" "}
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
        <Section eyebrow="Evaluation" title="Measured, not assumed">
          <p className="max-w-3xl text-body text-ink-muted">
            The evaluation dataset is 20 synthetic invoices, deterministic
            and committed, generated by evals/generate_invoices_v1.py —
            labels.json holds the values used to render each PDF,
            independent of anything a model later claims. --provider
            anthropic is the harness&apos;s default, a deliberate choice so a
            real evaluation — billed to a real account — is never
            accidental; the offline stub has to be requested explicitly with
            --provider stub.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The stub exists to validate the harness itself — dataset
            loading, orchestration, metric calculation, eval_runs
            persistence, report rendering, CLI behaviour — not extraction
            accuracy.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Metrics implemented: exact-match accuracy per field, review
            rate, document review rate, false-confident rate (wrong and not
            flagged), the same rate scoped to unflagged fields only, mean
            cost, provider-call latency, and p50/p95 by nearest rank. Money
            is normalised to decimals and line items compared structurally;
            case and punctuation are not normalised.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            <strong className="text-ink">
              No official real-model benchmark numbers exist.
            </strong>{" "}
            No eval_runs row produced by a real model has been recorded in
            the repository — no accuracy figure, no false-confident rate, no
            cost, no latency.
          </p>
        </Section>

        {/* 9. ENGINEERING EVIDENCE */}
        <Section eyebrow="Engineering evidence" title="Verified, not claimed">
          <ResultsPanel results={RESULTS} caption={RESULTS_CAPTION} />
          <ul className="mt-6 flex flex-col gap-2 text-small text-ink-muted">
            <li>
              An autouse test fixture patches the Anthropic client to raise
              on any call, and a test asserts that guard actually fires — no
              test can reach the real API.
            </li>
            <li>
              The Anthropic SDK is isolated to one module; persistence runs
              through SQLAlchemy against PostgreSQL, and the evaluation
              harness and the production provider are kept structurally
              separate.
            </li>
            <li>
              The deterministic demo runs through the same downstream
              production path described above, not a second implementation.
            </li>
            <li>
              DocIntel has no CI workflow configured — these figures come
              from running the suite directly, not from an automated
              pipeline.
            </li>
          </ul>
        </Section>

        {/* 10. PRODUCTION BOUNDARY */}
        <Section eyebrow="Production boundary" title="What's implemented, and what's been run">
          <p className="max-w-3xl text-body text-ink-muted">
            Implemented: the real Anthropic vision provider, strict schema
            validation, every deterministic check, the four-signal
            confidence scorer, the review queue, corrections with an audit
            trail, JSON/CSV export, and the evaluation harness&apos;s
            real-provider path. Running any of that for real needs an
            Anthropic API key with credits, a reachable PostgreSQL database
            migrated through all six revisions, and — for a Docker-based run
            — a working Docker daemon.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            What has actually been exercised, per the available evidence:
            the deterministic, credential-free demo path, and the evaluation
            harness&apos;s offline stub plumbing, both proven by tests. What
            has not been demonstrated: an official evaluation run against
            the real Anthropic provider, any real-model benchmark result,
            and real Anthropic extraction in this build&apos;s own evidence.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Docker&apos;s status sits in the same place: packaging exists,
            but the current source doesn&apos;t establish whether the image
            has actually been built or run — that&apos;s stated as an open
            question, not a pass or a fail.
          </p>
        </Section>

        {/* 11. HONEST LIMITATIONS */}
        <Section eyebrow="Where it stands" title="What this is not, yet">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "No official real-model benchmark numbers",
                detail:
                  "The evaluation harness is implemented and tested, but no run against the real Anthropic provider has been recorded in the repository.",
              },
              {
                title: "Purchase-order support is unmeasured",
                detail:
                  "It's newer than invoice extraction, and its fixture set proves the type flows end to end — it isn't a benchmark.",
              },
              {
                title: "Demo confidence is hand-authored",
                detail:
                  "The three demo fixtures' confidence values were written by hand for demonstration, not produced by a real model.",
              },
              {
                title: "No authentication, authorization or multi-tenancy",
                detail:
                  "No rate limiting or security hardening either — this is a single-user local tool, not something to expose to an untrusted network.",
              },
              {
                title: "No handwriting, multi-language or nested-table extraction",
                detail:
                  "The schemas and prompts target typed, single-language invoices and purchase orders.",
              },
              {
                title: "No background worker queue",
                detail:
                  "FastAPI's own BackgroundTasks runs extraction in the background instead.",
              },
              {
                title: "No endpoint to read a document by id",
                detail:
                  "Export is the read path; there is deliberately no GET /api/v1/documents/{id}.",
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
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Docker execution status is a documentation gap rather than a
            product limitation: packaging exists, but whether the image has
            been built or run isn&apos;t recorded in the source.
          </p>
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
            /review and /docs. Because most of the workflow is API-driven
            rather than page-driven, JSON responses — an export, a
            review-queue listing — may also be captured later as supporting
            evidence alongside the two pages.
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
