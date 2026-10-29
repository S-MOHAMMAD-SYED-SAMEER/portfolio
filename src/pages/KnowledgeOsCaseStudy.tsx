import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { enquiryMailto } from "../data/contact";
import { projectById, requiredLink } from "../data/projects";
import KnowledgeOsFlow from "../components/caseStudy/KnowledgeOsFlow";
import Callout from "../components/caseStudy/Callout";
import ResultsPanel, { type Result } from "../components/caseStudy/ResultsPanel";
import Section from "../components/Section";

/**
 * This page's project, from the canonical data. See the equivalent comment
 * on the other three case studies for why the lookup goes through the id
 * rather than any string that could independently drift.
 *
 * KnowledgeOS has no `interactiveDemoHref` — there is no in-browser
 * simulation of it on this site, so this page is GitHub-first
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
 * Engineering test-suite figures, verified directly against the repository and its CI (commit
 * ab9a4c8, 2026-10-20). Retrieval and answer quality are measured separately below.
 */
const RESULTS: Result[] = [
  {
    figure: "98",
    label: "Demo-suite tests passing",
    detail:
      "test_demo_e2e.py, test_demo_fixtures.py, test_demo_reranking.py, test_demo_llm.py and test_demo_app.py — the demo-focused suite specifically, not the project's overall test count.",
  },
  {
    figure: "1,314",
    label: "Full suite passing, CI (GitHub Actions)",
    detail:
      "1,318 collected, 4 skipped, 0 failed. The skips are the three tests that load the real BGE and cross-encoder weights (CI never downloads them) and the opt-in Gemini smoke test: skipped, not faked, and not counted as passing.",
  },
  {
    figure: "1,316",
    label: "Full suite passing, Windows laptop (models cached)",
    detail:
      "1,318 collected, 2 skipped, 0 failed. This is the run where the real BGE and cross-encoder tests execute. Earlier in the project this machine showed 11 failures; all were environmental (a file read as cp1252, symlink privilege, tests that assumed the models were absent), none were application bugs, and they are fixed.",
  },
  {
    figure: "7 / 9",
    label: "Alembic migrations / tables",
    detail:
      "The test suite builds its schema by running the real migrations, not a shortcut, so this figure is what actually exists rather than what's assumed.",
  },
];

const RESULTS_CAPTION =
  "These are engineering figures, verified from the repository and its CI: the code does what its tests say, and the image builds and the demo answers. They are not answer-quality results; those are in Evaluation above, with their limits.";

/**
 * Retrieval evaluation, from the committed run docs/results/2026-10-20-retrieval-eval.md in the
 * KnowledgeOS repository (real BGE and cross-encoder, no API key, the frozen gold-v2 question set).
 * Exact four-decimal figures are in each detail; the card figure is the rounded value.
 */
const RETRIEVAL_RESULTS: Result[] = [
  {
    figure: "0.91",
    label: "MRR with the reranker (0.74 without)",
    detail: "0.9081 with the cross-encoder, 0.7375 with the fused order kept, over the top 20 of 45 scored questions.",
  },
  {
    figure: "0.94",
    label: "Recall@5 with the reranker (0.89 without)",
    detail: "0.9444 with the cross-encoder, 0.8889 without.",
  },
  {
    figure: "0.99",
    label: "Recall@10 with the reranker (0.96 without)",
    detail: "0.9926 with the cross-encoder, 0.9630 without. Top 10 is a third of this corpus, so this one is easy.",
  },
  {
    figure: "45 of 52",
    label: "Questions scored",
    detail: "The other 7 are \"the documents don't say\" questions with no chunk to find. The corpus is 30 chunks from 10 documents.",
  },
];

const RETRIEVAL_CAPTION =
  "Read this with the corpus in mind: 30 chunks, so these are not a prediction for thousands of documents; the questions and their expected chunks were written by the same author against the same fixtures (Claude, reviewed by ChatGPT and Claude, approved by Sameer); and the retriever is not compared with BM25 or any other baseline, only with and without the reranker. One machine. The suite has been run on two versions of the question set (gold-v1 on 2026-10-14, gold-v2 on 2026-10-20, which changed four questions); both are published in the repository, and the gold-v2 figures are shown here.";

/**
 * Answers evaluation, from the committed runs docs/results/2026-10-20-answers-eval*.json in the
 * KnowledgeOS repository (gemini-3.5-flash-lite, temperature 1.0, the frozen gold-v2). Prompt v2 is the
 * repository default; the v1 figures are in each detail.
 */
const ANSWER_RESULTS: Result[] = [
  {
    figure: "32 of 33",
    label: "Answers that passed the citation check",
    detail: "Prompt v2, the default. Prompt v1: 29 of 33. 'Passed' means every citation points at evidence the model was given and every sentence has one; it does not check that the passage supports the sentence. Read it with the 12 of 45 card beside it.",
  },
  {
    figure: "12 of 45",
    label: "Answerable questions that got no answer",
    detail: "Stopped by the same threshold before the model was asked (the same twelve with both prompts; 13 under v1). A known cost of the threshold, and the figure to read beside 32 of 33.",
  },
  {
    figure: "1 of 33",
    label: "Answers rejected by the citation check",
    detail: "Prompt v2. Prompt v1: 4 of 33. The person sees \"I couldn't verify this answer\" instead. One run of each at temperature 1.0, so the gap could change on another run.",
  },
  {
    figure: "7 of 7",
    label: "Questions with no answer in the documents, abstained on",
    detail: "Both prompts. The abstention threshold was calibrated on the same 52 questions it is scored on, so this is in-sample, and 7 questions is a small sample.",
  },
];

const ANSWER_CAPTION =
  "Read this with its limits: the 52 questions and expected answers were written by Claude, reviewed by ChatGPT and Claude, and approved by Sameer, not independently annotated; one model, one day (2026-10-20), one run per prompt; 12 of the 45 answerable questions got no answer; a 30-chunk corpus of fictional documents; and no unsupported-claim rate is claimed.";

export default function KnowledgeOsCaseStudy() {
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
            KnowledgeOS answers only from retrieved documents, cites a retrieved
            chunk after every sentence, validates each citation in code before
            the answer is shown (it checks that a citation points at a chunk
            the model was given, not that the chunk supports the sentence), and refuses to answer when the evidence
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
            an evaluation baseline that keeps the fused order, so the
            reranker&apos;s contribution is a measured number rather than an
            assumption (the running application never selects it); and
            FakeRerankProvider, used only inside tests. Candidates are
            sorted by score descending, tie-broken by chunk_uid ascending.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The documented <em>cs001</em> fixture — a severity-one incident
            notification question — shows why this matters: raw RRF
            fusion alone ranks a same-document neighbor ahead of the golden
            chunk; the real, precomputed cross-encoder scores correct that
            ordering. That&apos;s a specific, reproducible fixture finding,
            not a statistical quality claim. The aggregate effect is
            measured in Evaluation below: MRR 0.74 without the reranker, 0.91
            with it.
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
              Three rules plus an agreement check run before an answer is
              persisted: every cited chunk must exist in the retrieved
              evidence, every sentence must carry a citation marker, a
              citation must point at one of the selected top 8 chunks, and
              the declared citation list must exactly match the markers
              actually present in the text. A failure rejects the reply: it
              is never shown, never stored in the application&apos;s database and never repaired. The model is
              asked once more; if that reply fails too, the person sees
              &ldquo;I couldn&apos;t verify this answer&rdquo;, not the
              rejected text.
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
            <strong className="text-ink">95 tests passed</strong> refers to
            this demo-focused suite specifically — not the project&apos;s
            overall test count (see Engineering evidence below).
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The image and the one-command demo are built and run in CI on
            every push: a job builds the image, starts the demo stack
            (database, migrations, seed, app), waits for readiness, asks it a
            flagship question and checks the answer is verified and cited.
            The demo was also run by hand through a direct uvicorn process
            against a disposable PostgreSQL + pgvector instance.{" "}
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
            abstention-threshold calibration. The threshold the application
            ships with (1.4451) was calibrated on the dev split of the same 52
            questions it is scored on, so the abstention figures are
            in-sample, and only 7 of the 52 questions are expected-abstain
            cases — a sample the repository itself documents as too small for
            statistical confidence.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            <strong className="text-ink">
              Both suites have been run, against AI-written gold, on a small
              corpus.
            </strong>{" "}
            The retrieval suite ran with the real BGE and cross-encoder models
            and no API key. The answers suite ran on 2026-10-20 with
            gemini-3.5-flash-lite, once per prompt version; both runs are
            committed in the repository, and the prompt that did better under
            a rule written beforehand (v2) is the default. A run that cannot
            reach its models writes nothing, and a run that stops part-way
            saves its progress but reports nothing: the first attempt at the
            v2 run stopped on a provider error and was restarted from the
            start.
          </p>
          <div className="mt-6">
            <ResultsPanel results={RETRIEVAL_RESULTS} caption={RETRIEVAL_CAPTION} />
          </div>
          <div className="mt-6">
            <ResultsPanel results={ANSWER_RESULTS} caption={ANSWER_CAPTION} />
          </div>
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
            Live Mode is implemented: real embedding, real reranking and
            real Gemini generation are the production default for every
            provider dependency. Real BGE and cross-encoder inference has run
            end to end (the retrieval evaluation above, and the demo
            fixtures), and so has real Gemini generation
            (gemini-3.5-flash-lite): 52 evaluation questions on 2026-10-16
            and again on 2026-10-20, and a nine-question live check over
            HTTP. Earlier attempts failed with a server error whose cause was
            never determined; since then the adapter has gained a timeout,
            retries that honour the service&apos;s Retry-After, JSON mode,
            and a safe &ldquo;could not verify&rdquo; reply instead of an
            error page. Google&apos;s API still returns an occasional 503
            (&ldquo;high demand&rdquo;), which stopped the first v2
            evaluation attempt; the evaluation stops on it by design.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            What has not been exercised: the Docker Live Mode image with a
            model key (the model runs were made from a local Python
            environment), any model other than gemini-3.5-flash-lite, and any
            corpus larger than 30 chunks. This is the current, honestly-stated
            verification boundary, not a claim that the architecture is
            invalid.
          </p>
        </Section>

        {/* 11. HONEST LIMITATIONS */}
        <Section eyebrow="Where it stands" title="What this is not, yet">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "The answer figures are narrow",
                detail:
                  "Scored against 52 questions written by Claude (reviewed by ChatGPT and Claude, approved by Sameer), on a 30-chunk corpus of fictional documents, with one model on one day and one run per prompt. No unsupported-claim rate is claimed, and \"grounded\" means the citation check passed.",
              },
              {
                title: "About a quarter of answerable questions get no answer",
                detail:
                  "12 of the 45 answerable questions are stopped by the abstention threshold before the model is asked. That is what a threshold fitted to catch all 7 unanswerable questions costs here, and no prompt changes it.",
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
                title: "The abstention threshold is in-sample",
                detail:
                  "The shipped threshold (1.4451) was calibrated on the dev split of the same 52 questions it is scored on, using only 4 expected abstentions, so it has not been tested on questions it was not fitted to.",
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
