import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { enquiryMailto } from "../data/contact";
import { projectById, requiredLink } from "../data/projects";
import Screenshot from "../components/Screenshot";
import SalesRecoveryFlow from "../components/caseStudy/SalesRecoveryFlow";
import Callout from "../components/caseStudy/Callout";
import ResultsPanel, { type Result } from "../components/caseStudy/ResultsPanel";
import Section from "../components/Section";

/**
 * This page's project, from the canonical data.
 *
 * Everything below that identifies the project — its service name in the
 * heading and all four links — is read from here rather than restated, so this
 * page cannot drift from what the homepage and the interactive demo claim about
 * the same project. `projectById` throws on a bad id, so a typo fails loudly at
 * startup instead of rendering a page with dead buttons.
 *
 * Every claim below is sourced from the standalone Sales-Recovery Agent
 * repository's own code, verified directly (P7A) and cross-checked against
 * a freshly-reproduced test/evaluation run with dependencies installed from
 * the committed lockfile (P7A.1) — not from the repository's own
 * documentation alone. Where a figure describes a mock-mode result, it says
 * so; the documented real-Gemini result is named as a historical claim,
 * not re-presented as independently verified. The hosted demo's current
 * live status could not be independently confirmed and is not asserted
 * here either way.
 */
const PROJECT = projectById("p1");
const DEMO_URL = requiredLink(PROJECT, "demoHref");
const REPO_URL = requiredLink(PROJECT, "repoHref");
const INTERACTIVE_DEMO_HREF = requiredLink(PROJECT, "interactiveDemoHref");

const STACK = [
  { name: "Node.js + Express", role: "Application server (JavaScript, ES modules — no TypeScript in this repository)" },
  { name: "Google Gemini", role: "Default LLM provider, behind a provider interface" },
  { name: "Anthropic Claude", role: "Second supported provider, behind the same interface" },
  { name: "Chroma", role: "Vector store for the store's knowledge base" },
  { name: "Local embeddings (Xenova/all-MiniLM-L6-v2)", role: "Runs in-process for RAG — no embeddings API call" },
  { name: "SQLite (node:sqlite)", role: "Conversation memory — built into Node 22.5+, no extra dependency" },
  { name: "Vanilla HTML/CSS/JS", role: "The demo chat interface (web/index.html) — no framework, no build step" },
  { name: "Node's built-in test runner (node --test)", role: "The 206-test automated suite" },
  { name: "Render", role: "Hosting for the documented deployment — see Production boundary" },
];

/**
 * Verified engineering figures, reproduced directly against the current
 * repository (see P7A.1) — a real, freshly-run `npm test`, and the
 * deterministic mock-mode evaluation harness. Deliberately not the
 * documented real-Gemini evaluation result, which was not independently
 * reproduced for this case study; see the caption and Evaluation below.
 */
const RESULTS: Result[] = [
  {
    figure: "206 / 206",
    label: "Automated tests passing",
    detail:
      "Full suite, freshly run with dependencies installed from the committed lockfile — 18 files, zero failures, zero skips.",
  },
  {
    figure: "16 / 16",
    label: "Deterministic evaluation — mock mode",
    detail:
      "100% pass rate against the scripted-response harness. Needs no API key and no running Chroma server; it validates the harness and the surrounding pipeline, not the model.",
  },
  {
    figure: "11/11 · 13/13 · 9/9 · 1/1 · 5/5",
    label: "Per-metric mock-mode breakdown",
    detail:
      "Tool-selection, signal-detection, grounded-answer, unsupported-answer and guardrail/safety accuracy — each 100% in mock mode, each with its own denominator.",
  },
  {
    figure: "0 / 13",
    label: "Hallucination metric — mock mode",
    detail:
      "Of the 13 mock-mode cases where a factual claim was checkable at all, none stated something ungrounded or unsafe.",
  },
];

const RESULTS_CAPTION =
  "These are the project's own test and evaluation figures, reproduced directly against the current repository — not customer outcomes. The mock-mode evaluation is fully deterministic and reproducible; it validates this codebase's guard, tool-routing and calendar logic, not a live model's judgment. A separate real-mode run against the live Gemini model is documented in the repository but was not independently reproduced for this case study — see Evaluation and Production boundary.";

export default function SalesRecoveryCaseStudy() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur">
        {/* This is the longest page on the site; skipping the header matters
            more here than anywhere else. */}
        <SkipLink />
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <a href="/#projects" className="text-small font-semibold text-ink">
            ← AI Business Automation
          </a>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="text-small text-ink-muted hover:text-ink"
            >
              GitHub
            </a>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-control bg-brand px-4 py-2 text-small font-semibold text-white hover:bg-brand/90"
            >
              Hosted Demo
            </a>
          </div>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        {/* 1. HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-4 pt-16 sm:pt-20">
          <p className="text-eyebrow uppercase text-brand">{PROJECT.service}</p>
          <h1 className="mt-4 max-w-3xl text-display-sm text-ink sm:text-display">
            Sales-Recovery Agent
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-muted">
            An AI support agent that helps online stores answer customer
            questions instantly, recover hesitant buyers, and cut the hours a
            small team spends retyping the same replies.
          </p>
          <p className="mt-4 max-w-2xl text-body font-semibold text-ink">
            The hard part is not generating a reply. It&apos;s grounding the
            reply in the right business data, detecting buying intent
            deterministically, enforcing safety rules in application code,
            and keeping conversation state consistent — before anything
            reaches the customer.
          </p>
          <div className="flex flex-wrap gap-4 pt-8">
            {/* Leads, because it is the action a reader can take right now: it
                runs in this tab on synthetic data, with no account and no cold
                start. The hosted instance is still linked beside it. */}
            <a
              href={INTERACTIVE_DEMO_HREF}
              className="rounded-control bg-brand px-6 py-3 text-small font-semibold text-white hover:bg-brand/90"
            >
              Try interactive demo
            </a>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-control border border-line-strong px-6 py-3 text-small font-semibold text-ink hover:border-ink-muted"
            >
              Try the Hosted Demo
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-control border border-line-strong px-6 py-3 text-small font-semibold text-ink hover:border-ink-muted"
            >
              View on GitHub
            </a>
          </div>
          <p className="mt-4 text-meta text-ink-muted">
            Demo and deployment status are described precisely in Production
            boundary below.
          </p>
          <div className="mt-10">
            <Screenshot
              src="/images/p1-grounded-answer.png"
              width={942}
              height={872}
              alt="The support agent answering a stock question with a real availability figure, tagged with a badge showing it checked product availability before replying."
              caption="Every reply carries a badge naming the tool or knowledge-base check it ran before answering — the mechanism the rest of this case study describes."
            />
          </div>
        </section>

        {/* 2. PROBLEM */}
        <Section eyebrow="The problem" title="One chat box, several different retrieval problems">
          <p className="max-w-3xl text-body text-ink-muted">
            A small online store gets the same handful of questions every
            day — where's my order, is this back in stock, how long does
            delivery take, can I return it. Answered slowly or generically,
            those questions cost a team's time and, quietly, cost sales: a
            customer who's nearly ready to buy and hesitates over price or
            delivery just leaves, and nobody logs that as a lost sale
            because nothing ever happened.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Underneath that one chat box, though, these are not the same
            problem:
          </p>
          <ul className="mt-4 flex flex-col gap-3 text-small text-ink-muted">
            <li>
              <strong className="text-ink">Policy questions</strong>{" "}
              (shipping, returns, product care) need grounding in the
              store&apos;s written documents — not the model&apos;s general
              knowledge, which can sound right while being wrong.
            </li>
            <li>
              <strong className="text-ink">Order-status questions</strong>{" "}
              need real (here, mock) business data. A model has no way to
              know what a specific order actually says unless something
              looks it up.
            </li>
            <li>
              <strong className="text-ink">Stock and discount questions</strong>{" "}
              are the same kind of live-data problem as order status, and
              have to be treated as one — not folded into the knowledge-base
              lookup above.
            </li>
            <li>
              <strong className="text-ink">Sales-relevant signals</strong>{" "}
              (hesitation, a price worry, a cart-abandonment risk) need to be
              detected the same way every time, not left to whatever mood a
              model happens to answer in.
            </li>
            <li>
              An unsafe or unsupported claim can&apos;t just be discouraged
              in a prompt — a prompt is a request the model can still get
              wrong. It has to be caught and blocked in code, after the
              model has already produced it.
            </li>
            <li>
              Only the reply that actually passed that check should ever
              become part of what the conversation remembers.
            </li>
          </ul>
        </Section>

        {/* 3. SOLUTION */}
        <Section eyebrow="The solution" title="An assistant that checks before it answers">
          <p className="max-w-3xl text-body text-ink-muted">
            This is a support assistant that sits on a store&apos;s site and
            handles the routine questions end to end — but the point of it is
            what it refuses to do. It does not answer from memory or general
            knowledge. Before it says anything about an order, a product, a
            promotion or a policy, it looks the answer up; if the lookup
            finds nothing, it says so rather than producing something
            convincing.
          </p>
          <div className="mt-6 rounded-card border border-line bg-canvas p-6">
            <p className="text-small font-semibold text-ink">
              What actually implements that
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-small text-ink-muted">
              <li>
                A provider-agnostic LLM interface — Gemini by default,
                Anthropic as a fully-implemented second option behind the
                same call.
              </li>
              <li>
                A tool-calling loop, bounded to three model/tool round-trips,
                shared by both providers.
              </li>
              <li>
                Retrieval-grounded policy answers (RAG) over the store&apos;s
                own documents, kept separate from live business-data lookups.
              </li>
              <li>
                Six deterministic, regex-based signal detectors that shape
                this turn&apos;s tone — never an action outside the reply.
              </li>
              <li>
                Eight application-level guardrail policies that re-check the
                model&apos;s draft reply before anything is shown or saved.
              </li>
              <li>
                SQLite-backed conversation memory that persists only the
                validated final reply, never a raw draft.
              </li>
            </ul>
          </div>
        </Section>

        {/* 4. END-TO-END REQUEST PIPELINE */}
        <Section eyebrow="How it works" title="One reply, start to finish">
          <SalesRecoveryFlow />
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The model makes three decisions in this pipeline: what to say,
            whether to call a tool, and what to say once a tool has answered.
            Everything else — loading history, detecting signals, dispatching
            the tool the model asked for, validating arguments, checking the
            draft against eight policies, deciding what gets persisted, and
            shaping the final response — is application code that runs
            whether or not the model behaved. The model can request a tool;
            it does not own the dispatcher, the guardrails, the persistence
            boundary, or what the customer ultimately receives.
          </p>
        </Section>

        {/* 5. PROVIDER-AGNOSTIC TOOL CALLING */}
        <Section eyebrow="Tool-calling" title="One interface, two providers">
          <p className="max-w-3xl text-body text-ink-muted">
            <code>generateReply({"{ systemPrompt, messages }"})</code> is the
            one call every route makes. Behind it, separate Gemini and
            Anthropic adapters each translate their own SDK&apos;s
            request/response shape into three shared callbacks, and hand
            them to one provider-agnostic loop — the loop itself never
            touches a Gemini- or Anthropic-shaped object directly. Gemini is
            the active default; Anthropic is fully implemented behind the
            same interface but has not been the provider these evaluation
            figures were measured against — the two have not been
            independently benchmarked against each other here.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            A real multi-provider compatibility problem surfaced while
            building this: Gemini attaches an internal{" "}
            <code>thought_signature</code> to a function-call part that has
            to be echoed back unchanged on the next turn, or the API rejects
            the follow-up call. The first implementation reconstructed that
            part by hand from the tool name and arguments and silently lost
            the signature. The fix was structural, not a patch: the shared
            loop now threads each provider&apos;s own raw model turn through
            to how it re-attaches its tool exchange, so a provider can
            preserve metadata the loop itself doesn&apos;t need to
            understand.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The loop is capped at three model/tool round-trips, so a
            confused model can&apos;t loop forever. The tool dispatcher never
            throws: an unknown tool name, invalid arguments, or an
            unexpected internal failure all resolve to a plain{" "}
            <code>{"{ ok: false, error }"}</code> result rather than crashing
            the turn.
          </p>
        </Section>

        {/* 6. RAG VS. BUSINESS TOOLS */}
        <Section eyebrow="RAG vs. business tools" title="Two kinds of knowledge, one calling convention">
          <p className="max-w-3xl text-body text-ink-muted">
            Both are exposed to the model as ordinary tools through the same
            calling convention — the model decides which one, if either, a
            given message actually needs — but they answer fundamentally
            different questions and are kept as separate boundaries on
            purpose.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-card border border-line bg-canvas p-5">
              <p className="text-small font-semibold text-ink">
                RAG — <code>searchKnowledgeBase</code>
              </p>
              <p className="mt-2 text-small text-ink-muted">
                &ldquo;What does our policy say?&rdquo; Static documents —
                shipping, returns, product care, FAQ — chunked, embedded
                locally and searched. Changes rarely; a policy update means
                editing a document, not the assistant.
              </p>
            </div>
            <div className="rounded-card border border-line bg-canvas p-5">
              <p className="text-small font-semibold text-ink">
                Business tools — <code>getOrderStatus</code>,{" "}
                <code>checkStock</code>, <code>checkDiscount</code>
              </p>
              <p className="mt-2 text-small text-ink-muted">
                &ldquo;What&apos;s true right now, for this specific
                order/product/code?&rdquo; Deterministic mock functions
                standing in for a real store API. Changes on every request —
                a policy answer and a stock answer must never be treated as
                the same kind of fact.
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The mock data is fictional and hardcoded — order numbers, stock
            levels and discount codes exist only inside this repository.
            There is no real Shopify or CRM integration behind either tool.
          </p>
        </Section>

        {/* 7. BEHAVIORAL SIGNALS */}
        <Section eyebrow="Behavioral signals" title="Six signals, shaping tone only">
          <p className="max-w-3xl text-body text-ink-muted">
            A small set of hand-written regex patterns checks the
            customer&apos;s current message — and only the current message,
            never the conversation history — for six sales-relevant signal
            types:
          </p>
          <ul className="mt-4 grid gap-2 text-small text-ink-muted sm:grid-cols-2">
            <li>
              <strong className="text-ink">purchase_intent</strong> — showing
              intent to buy
            </li>
            <li>
              <strong className="text-ink">purchase_hesitation</strong> —
              undecided about buying
            </li>
            <li>
              <strong className="text-ink">shipping_concern</strong> —
              worried about cost, speed or arrival
            </li>
            <li>
              <strong className="text-ink">price_concern</strong> — concerned
              about price or affordability
            </li>
            <li>
              <strong className="text-ink">return_concern</strong> — worried
              about returns or refunds
            </li>
            <li>
              <strong className="text-ink">cart_abandonment_risk</strong> —
              showing signs of leaving without buying
            </li>
          </ul>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            A detected signal maps to one short, non-prescriptive directive
            folded into that turn&apos;s system prompt — never an action
            outside the reply, never a specific discount or promised outcome.
            This is deterministic application logic, not an ML classifier:
            free, instant, and every pattern is readable end to end. The
            explicit tradeoff, stated plainly rather than hidden, is that it
            only catches fairly direct English phrasing and will miss
            paraphrases or indirect hints a classifier would catch.
          </p>
        </Section>

        {/* 8. GUARDRAILS */}
        <Section eyebrow="Guardrails" title="Application-level response guardrails, not a broad safety claim">
          <p className="max-w-3xl text-body text-ink-muted">
            Eight explicit policies — plain functions, each individually
            tested against a violating and a safe case — check the
            model&apos;s draft reply against what actually ran this turn,
            regardless of whether the model followed its own instructions:
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-small text-ink-muted">
            <li>
              <strong className="text-ink">no_unverified_discount_claim</strong>{" "}
              — a discount/code claim without <code>checkDiscount</code>{" "}
              having run
            </li>
            <li>
              <strong className="text-ink">no_unverified_stock_claim</strong>{" "}
              — a stock claim without <code>checkStock</code> having run
            </li>
            <li>
              <strong className="text-ink">no_unverified_order_status_claim</strong>{" "}
              — an order-status claim without <code>getOrderStatus</code>{" "}
              having run
            </li>
            <li>
              <strong className="text-ink">no_unverified_policy_claim</strong>{" "}
              — a specific policy timeframe without{" "}
              <code>searchKnowledgeBase</code> having run
            </li>
            <li>
              <strong className="text-ink">no_unsupported_refund_promise</strong>{" "}
              — any refund/compensation promise, always, since no tool exists
              to fulfill one
            </li>
            <li>
              <strong className="text-ink">no_internal_disclosure</strong> —
              revealing the system prompt, keys or internal implementation
            </li>
            <li>
              <strong className="text-ink">no_deceptive_urgency</strong> —
              urgency/scarcity language not backed by a real stock check this
              turn
            </li>
            <li>
              <strong className="text-ink">no_sensitive_personal_inference</strong>{" "}
              — inferring a sensitive personal attribute about the customer
            </li>
          </ul>
          <Callout badge="!" heading="Enforced after the model, before persistence">
            <p className="mt-2 max-w-3xl text-small text-ink-muted">
              A policy failure never returns the original reply — it
              substitutes a fixed, honest fallback. If a policy function
              itself throws, that counts as a violation too, not a silent
              pass: a bug in a guardrail fails toward blocking, never toward
              letting an unchecked reply through. Guardrails run strictly
              before the conversation is persisted, so a blocked claim can
              never re-enter memory in a later turn either.
            </p>
          </Callout>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Stated limitation: these confirm the right <em>category</em> of
            tool ran, not that the reply&apos;s specific value matches the
            tool&apos;s exact result. Value-level correctness is the
            evaluation harness&apos;s job, not a runtime guardrail&apos;s.
          </p>
        </Section>

        {/* 9. MEMORY / PERSISTENCE BOUNDARY */}
        <Section eyebrow="Memory" title="Only the validated reply is remembered">
          <p className="max-w-3xl text-body text-ink-muted">
            Conversation history is SQLite-backed application persistence —
            one row per session, messages read back oldest-first — not model
            fine-tuning and not any form of long-term model memory. Each
            turn loads prior messages for that session before the model
            reasons about the new one.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            What gets written back is deliberately narrow: only the
            customer&apos;s plain message and the <em>final, validated</em>{" "}
            assistant reply are saved. The tool-call/tool-result exchange
            that may have happened inside a single turn, and any draft a
            guardrail rejected, never reach the stored conversation — so a
            later turn&apos;s history can&apos;t &ldquo;remember&rdquo; a
            claim the customer was never actually shown.
          </p>
        </Section>

        {/* 10. EVALUATION */}
        <Section eyebrow="Evaluation" title="A harness that drives the real request path">
          <p className="max-w-3xl text-body text-ink-muted">
            The evaluation harness calls the exact function the HTTP route
            calls — not a reimplementation — through a 16-case, 7-category
            dataset (<code>rag</code>, <code>tools</code>,{" "}
            <code>signals</code>, <code>safety</code>, <code>normal</code>,{" "}
            <code>memory</code>, <code>mixed</code>). Every metric is a
            deterministic set/string/regex comparison — no LLM judging its
            own or another model&apos;s output as ground truth.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            In <strong className="text-ink">mock mode</strong>, the harness
            replays each case&apos;s own scripted response instead of
            calling a real model — free, reproducible, and exactly what the
            figures in Engineering evidence below describe. Mock mode
            validates this codebase&apos;s own plumbing (tool routing, the
            guardrail cross-check, memory hygiene); it does{" "}
            <strong className="text-ink">not</strong> measure a live
            Gemini model&apos;s judgment, and no claim to the contrary is
            made here.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            An earlier repository record documents a 16/16 Gemini run, but
            that result was not independently reproduced during the current
            audit — no credentials or running Chroma server were available
            to do so. It is named here as a documented historical claim, not
            re-presented beside the verified mock-mode figures as though
            both were current measurements.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The same documented real run also surfaced a genuine bug in the
            harness&apos;s own grading, not in the agent: a correct,
            grounded reply used a typographic en dash (&ldquo;7–12 business
            days&rdquo;) where the expected-keyword check used a plain
            hyphen, so a fully correct answer registered as a miss. The fix
            — normalizing common Unicode dash variants before comparing — is
            covered by its own regression test, which is part of the 206
            tests verified in this audit.
          </p>
        </Section>

        {/* 11. ENGINEERING EVIDENCE */}
        <Section eyebrow="Engineering evidence" title="Verified, not claimed">
          <ResultsPanel results={RESULTS} caption={RESULTS_CAPTION} />
          <ul className="mt-6 flex flex-col gap-2 text-small text-ink-muted">
            <li>
              A provider-agnostic tool-calling loop, shared by two SDKs with
              genuinely different multi-turn tool formats, including the
              Gemini <code>thought_signature</code> fix described above.
            </li>
            <li>
              A tool dispatcher that never throws, bounded to three
              model/tool round-trips per turn.
            </li>
            <li>
              Guardrail validation that runs strictly before persistence, so
              a blocked claim can&apos;t re-enter memory in a later turn.
            </li>
            <li>
              A dash-normalization regression test locking in a real bug the
              evaluation harness found in its own grading logic — the
              clearest evidence the harness catches real things, not just
              produces a number.
            </li>
            <li>
              The evaluation harness exercises the same request-handling
              function a real request uses, not a second, parallel
              implementation.
            </li>
          </ul>
        </Section>

        {/* 12. PRODUCTION BOUNDARY */}
        <Section eyebrow="Production boundary" title="What's implemented, and what's been run">
          <p className="max-w-3xl text-small font-semibold text-ink">
            Implemented
          </p>
          <p className="mt-2 max-w-3xl text-small text-ink-muted">
            The full agent pipeline (history, signals, tool-calling, RAG,
            guardrails, persistence), the provider abstraction across Gemini
            and Anthropic, and the 206-test automated suite plus the
            deterministic evaluation harness.
          </p>
          <p className="mt-6 max-w-3xl text-small font-semibold text-ink">
            Not established as current production evidence
          </p>
          <p className="mt-2 max-w-3xl text-small text-ink-muted">
            Real customer traffic, real revenue impact, a real Shopify or
            CRM integration, an actual human handoff (the assistant can only
            state that a person will help — nothing here connects one),
            production-scale operation, and an independently reproduced
            live-Gemini evaluation benchmark.
          </p>
          <p className="mt-6 max-w-3xl text-small font-semibold text-ink">
            Deployment status
          </p>
          <p className="mt-2 max-w-3xl text-small text-ink-muted">
            A hosted Render URL is documented in the project, but its
            current live status could not be independently confirmed during
            this audit.
          </p>
        </Section>

        {/* 13. HONEST LIMITATIONS */}
        <Section eyebrow="Where it stands" title="What this is not, yet">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Fictional, hardcoded business data",
                detail:
                  "Orders, stock levels and discount codes exist only inside this repository — not a real store, inventory system, or CRM.",
              },
              {
                title: "No Shopify or store integration",
                detail:
                  "The tool layer is deliberately isolated from any provider SDK specifically so a real store API could be swapped in later — that swap hasn't happened.",
              },
              {
                title: "No CRM integration",
                detail: "Nothing here reads from or writes to a customer-relationship system.",
              },
              {
                title: "No real human handoff",
                detail:
                  "The guardrail fallback and the agent's own language say a person will help — no tool or mechanism actually connects one.",
              },
              {
                title: "Deployment status unresolved",
                detail:
                  "A hosted Render URL is documented; current live availability was not independently confirmed for this case study.",
              },
              {
                title: "Mock evaluation is not live-model evaluation",
                detail:
                  "The 16/16 mock-mode result validates this codebase's own logic against scripted responses — it says nothing about live Gemini's judgment.",
              },
              {
                title: "Historical Gemini result not independently reproduced",
                detail:
                  "A documented real-mode 16/16 run exists in the repository's own record; it was not re-run for this audit.",
              },
              {
                title: "RAG retrieval isn't comprehensively benchmarked",
                detail:
                  "Relevance-threshold behavior is documented against a handful of example queries, not a full retrieval-quality evaluation.",
              },
              {
                title: "Signal detection is regex-based",
                detail:
                  "Deterministic and readable, but it only catches fairly direct English phrasing — paraphrase and sarcasm are stated, known misses.",
              },
              {
                title: "Guardrails are pattern-based",
                detail:
                  "They confirm the right category of tool ran, not that a specific stated value is numerically correct.",
              },
              {
                title: "No CI workflow currently verified",
                detail:
                  "Every figure above comes from a manual run against the current checkout, not an automated, continuously-verified pipeline.",
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

        {/* 14. TECH STACK */}
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

        {/* 15. SCREENSHOTS + CLOSING CTA */}
        <Section eyebrow="The product" title="Seeing it work">
          <div className="columns-1 gap-8 sm:columns-2">
            <Screenshot
              src="/images/p1-policy-grounding.png"
              width={936}
              height={867}
              alt="The support agent answering a policy question using the store's own written policy."
              caption="RAG in action: a policy question answered from the store's own documents rather than from the model's general knowledge."
            />
            <Screenshot
              src="/images/p1-order-or-stock-lookup.png"
              width={938}
              height={802}
              alt="The support agent answering a question about an order or product by looking the answer up."
              caption="A business tool in action: an order or stock question answered from mock live data, looked up on the spot rather than guessed."
            />
            <Screenshot
              src="/images/p1-buying-signal-recovery.png"
              width={912}
              height={608}
              alt="The support agent recognising a hesitant buyer and responding to the concern they raised."
              caption="A detected purchase_hesitation signal shaping tone — the reply addresses the concern without inventing a discount."
            />
            <div className="mb-8 break-inside-avoid rounded-card border border-line bg-canvas p-6">
              <p className="text-small font-semibold text-ink">
                Try these yourself
              </p>
              <p className="mt-2 text-small text-ink-muted">
                The demo runs on fictional store data, so everything is safe
                to poke at. Ask about order 1001, whether the Ceramic Mug is
                in stock, whether code WELCOME10 is valid, how long
                international delivery takes — then try telling it you are
                still deciding.
              </p>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-control bg-brand px-4 py-2 text-small font-semibold text-white hover:bg-brand/90"
              >
                Open the demo
              </a>
            </div>
          </div>
        </Section>

        <section className="mx-auto max-w-5xl px-6 pb-20 pt-4">
          <div className="rounded-card border border-line bg-canvas p-8 sm:p-10">
            <h2 className="text-section text-ink">
              Try it on your own questions
            </h2>
            <p className="mt-3 max-w-2xl text-ink-muted">
              A hosted instance of this agent exists — see Production
              boundary above for what's currently confirmed about it. Ask it
              something a real customer of yours would ask, and watch which
              checks it runs before it answers.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-control bg-brand px-6 py-3 text-small font-semibold text-white hover:bg-brand/90"
              >
                Open the Hosted Demo
              </a>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-control border border-line-strong px-6 py-3 text-small font-semibold text-ink hover:border-ink-muted"
              >
                Read the Source on GitHub
              </a>
              <a
                href={enquiryMailto("AI Customer Support & Sales Recovery")}
                className="rounded-control px-4 py-3 text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Talk about your store
              </a>
            </div>
            <p className="mt-6 text-meta text-ink-muted">
              Demo data is fictional — the orders, products and discount
              codes are examples, not a real store. See Production boundary
              above for the current, verified deployment status.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
