import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { enquiryMailto } from "../data/contact";
import { projectById, requiredLink } from "../data/projects";
import DocIntelFlow from "../components/caseStudy/DocIntelFlow";
import ResultsPanel, { type Result } from "../components/caseStudy/ResultsPanel";
import Section from "../components/Section";

/**
 * This page's project, from the canonical data. See the equivalent comment
 * on the other four case studies for why the lookup goes through the id
 * rather than any string that could independently drift.
 *
 * DocIntel has no `interactiveDemoHref` — there is no in-browser
 * simulation of it on this site, so this page is GitHub-first
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
  { name: "pytest", role: "658 tests, CI on Linux and Windows, an autouse guard against real API calls" },
];

/**
 * Engineering test-suite figures, verified against the repository and its CI (main at 5c22fd9, 2026-10-21)
 * -- not extraction results. The real-model runs are shown separately below, with their limits.
 */
const RESULTS: Result[] = [
  {
    figure: "658",
    label: "Tests passing, CI (GitHub Actions)",
    detail:
      "658 collected, 658 pass on Linux with PostgreSQL. CI also runs ruff and pip-audit, builds the Docker image and runs the demo stack end to end.",
  },
  {
    figure: "391 / 267",
    label: "No-database run (Windows runner)",
    detail:
      "391 pass, 267 skip - 658 collected either way; tests needing a database skip cleanly rather than failing.",
  },
  {
    figure: "7",
    label: "Alembic migrations",
    detail:
      "Seven migration files, covering the verified schema evolution from documents through eval_runs, and the source_sha256 column the demo identifies documents by.",
  },
];

const RESULTS_CAPTION =
  "These are engineering figures, verified from the repository and its CI: the code does what its tests say, and the image builds and the demo runs. They are not extraction-accuracy results; those are in Evaluation above, with their limits.";

/**
 * The real-model runs of 2026-10-21 (claude-haiku-4-5), from docs/results/2026-10-21-real-runs.md and
 * docs/results/2026-10-21-rescored.json in the DocIntel repository. Every accuracy figure sits beside its
 * unflagged-error count. invoice/v2 is the repository default; the v1 figures are in each detail.
 */
const REAL_RESULTS: Result[] = [
  {
    figure: "387 of 390",
    label: "Fields correct on 30 synthetic invoices",
    detail:
      "Prompt v2, the default: 3 wrong values, and 2 of those 3 were not flagged for review (2 after the checker fix as well). Prompt v1: 384 of 390, with 4 wrong values not flagged as run and 2 with the fixed checker. One run of each.",
  },
  {
    figure: "2 of 390",
    label: "Wrong values not flagged for review",
    detail:
      "Prompt v2, as run and with the fixed checker. Both are on image-only documents, where there is no text layer and the model's own confidence is the only signal. Too few to say how well the confidence weighting works.",
  },
  {
    figure: "260 of 260",
    label: "Prompt v2 on the 20 easy invoices (v1: 257)",
    detail:
      "In-sample: v2 was written from the three v1 misses on this set, all one VAT number copied wrongly. The gain is as consistent with chance as with the prompt: one run each.",
  },
  {
    figure: "127 of 130",
    label: "Both prompts on the 10 harder invoices",
    detail:
      "A smoke test, barely harder: the same three fields missed under both prompts, and the cases the set was built around (stamp, photo, credit note, missing due date, two-page table) were all read correctly.",
  },
];

const REAL_CAPTION =
  "Read this with its limits: the documents are synthetic and the labels are by construction (the values they were rendered from); the harder set was written by Claude, reviewed by ChatGPT and Claude and approved by Sameer; one model (claude-haiku-4-5), one run of each prompt, 30 documents, default sampling, so no run-to-run variation is known. \"As run\" and \"with the fixed checker\" are both published: the text-layer check accepted a truncated value and one with an invisible character, was replaced after the runs, and the saved model outputs were re-scored offline; the fix was chosen after seeing the first numbers. The 0.85 review threshold is unchanged and has a boundary case (a score of exactly 0.850 passes). \"Munchen\" read as \"M\u00fcnchen\" stays scored wrong. Not an accuracy figure for real invoices, other models, or production use.";

export default function DocIntelCaseStudy() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur">
        <SkipLink />
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <a href="/projects.html" className="text-small font-semibold text-ink">
            ← All projects
          </a>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* GitHub-first: this project has no in-browser interactive demo,
                so the repository is the filled primary action here. */}
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
            value is printed, whole, in the PDF&apos;s own embedded text
            (an exact match on whole tokens after Unicode normalisation, so
            a truncated value or one with an invisible character is not
            found), only when the value is scalar and a text layer exists;
            on an image-only document it does not apply. Weights are
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
            invoice-001, invoice-003, invoice-004 — by the SHA-256 of the
            uploaded PDF&apos;s own bytes (computed once, at upload), never of
            the rendered page images, whose bytes depend on the rasterizer. An unrecognised hash
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
            CI builds the Docker image, starts the stack (database,
            migration, app, seed and demo), extracts a seeded invoice through
            the demo and reads the record back on every change. There is no
            hosted or public demo.{" "}
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
        <Section eyebrow="Evaluation" title="Measured, with the limits next to the numbers">
          <p className="max-w-3xl text-body text-ink-muted">
            Two committed, deterministic synthetic sets: 20 invoices
            (evals/generate_invoices_v1.py) and a harder set of 10, five of
            them images with no text layer, frozen by SHA-256 before any real
            request. labels.json holds the values used to render each
            document, independent of anything a model later claims. The
            harness defaults to the real provider, a deliberate choice so a
            real evaluation is never accidental; the offline stub has to be
            requested with --provider stub, and a real run needs an explicit
            request cap and cost cap (this work was capped at 80 requests and
            USD 2.00 and used 64 requests and USD 0.51).
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Metrics implemented: exact-match accuracy per field, review
            rate, document review rate, false-confident rate (wrong and not
            flagged), the same rate scoped to unflagged fields only, mean
            cost, provider-call latency, and p50/p95 by nearest rank. Money
            is normalised to decimals and line items compared structurally;
            case and punctuation are not normalised, and an altered spelling
            (&quot;Munchen&quot; read as &quot;M&uuml;nchen&quot;) is scored wrong.
          </p>
          <div className="mt-8">
            <ResultsPanel results={REAL_RESULTS} caption={REAL_CAPTION} />
          </div>
          <p className="mt-6 max-w-3xl text-small text-ink-muted">
            <strong className="text-ink">What the runs found.</strong> The
            same printed VAT number was copied wrongly three ways (a dropped
            last digit, a dropped middle digit, a zero-width space) and
            correctly once. Two of those were not flagged because the
            text-layer check accepted a truncated value and an invisible
            character; it was fixed after the runs and the saved outputs
            re-scored (4 unflagged wrong values became 2 for prompt v1; none
            for v2 changed). A date printed 04/03/2026 was read month-first
            and the deterministic date check sent it to review, which is
            what the checks are for. On image-only documents the model&apos;s
            own confidence is the only signal, and a wrong value reported at
            0.92 passed.
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
              CI runs on every change: ruff and the full suite on Linux with
              PostgreSQL, the no-database tests on Windows, a dependency
              audit, and the Docker build with the demo stack.
            </li>
          </ul>
        </Section>

        {/* 10. PRODUCTION BOUNDARY */}
        <Section eyebrow="Production boundary" title="What's implemented, and what's been run">
          <p className="max-w-3xl text-body text-ink-muted">
            Implemented: the real Anthropic vision provider, strict schema
            validation, every deterministic check, the four-signal
            confidence scorer, the review queue with the source page beside
            each field, corrections with an audit trail, JSON/CSV export, a
            read endpoint for a document, explicit timeout and retry
            policy, and the evaluation harness&apos;s real-provider path.
            Running it for real needs an Anthropic API key with credits and
            a reachable PostgreSQL database migrated through all seven
            revisions.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            What has been run against the real model: 64 requests on
            2026-10-21, with claude-haiku-4-5, on synthetic documents (20
            easy and 10 harder invoices with two prompts each, and 3 purchase
            orders). What has not: any real invoice, any other model, any
            repeated run, any load, or any use by a customer.
          </p>
        </Section>

        {/* 11. HONEST LIMITATIONS */}
        <Section eyebrow="Where it stands" title="What this is not, yet">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "The real-model runs are small and synthetic",
                detail:
                  "30 invoices, labels by construction, one model, one run of each prompt. Not a benchmark and not an accuracy figure for real invoices.",
              },
              {
                title: "Purchase-order support is only smoke-tested",
                detail:
                  "Three synthetic purchase orders, 30 of 30 fields correct against the real model: it shows the type runs end to end, nothing more.",
              },
              {
                title: "Image-only documents rely on the model's own confidence",
                detail:
                  "With no text layer there is no independent check on a scanned or photographed value, so a wrong value the model is sure of is not flagged. The review threshold (0.85) is unchanged; a score of exactly 0.850 passes.",
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
