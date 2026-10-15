import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { enquiryMailto } from "../data/contact";
import { projectById, requiredLink } from "../data/projects";
import Screenshot from "../components/Screenshot";
import CaseStudyVideo from "../components/CaseStudyVideo";
import SalesRecoveryFlow from "../components/caseStudy/SalesRecoveryFlow";
import Callout from "../components/caseStudy/Callout";
import ResultsPanel, { type Result } from "../components/caseStudy/ResultsPanel";
import Section from "../components/Section";

/**
 * This page's project, from the canonical data.
 *
 * Everything below that identifies the project — its service name in the
 * heading and its links — is read from here rather than restated, so this
 * page cannot drift from what the homepage and the interactive demo claim about
 * the same project. `projectById` throws on a bad id, so a typo fails loudly at
 * startup instead of rendering a page with dead buttons.
 *
 * Every claim below is sourced from the standalone Sales-Recovery Agent
 * repository's own code, verified directly (P7A) and cross-checked against
 * a freshly-reproduced test/evaluation run with dependencies installed from
 * the committed lockfile (P7A.1) — not from the repository's own
 * documentation alone. Where a figure describes a mock-mode result, it says
 * so. The real-model figures come from the runs recorded in the agent's
 * `docs/results/` (Gemini 3.5 Flash-Lite, 2026-10-13), and where a first result was
 * later corrected, both numbers are given.
 */
const PROJECT = projectById("p1");
const REPO_URL = requiredLink(PROJECT, "repoHref");
const INTERACTIVE_DEMO_HREF = requiredLink(PROJECT, "interactiveDemoHref");

const STACK = [
  { name: "Node.js + Express", role: "Application server (JavaScript, ES modules — no TypeScript in this repository)" },
  { name: "Google Gemini", role: "Default LLM provider, behind a provider interface" },
  { name: "Anthropic Claude", role: "Second provider behind the same interface — implemented, not yet run against the live API" },
  { name: "Chroma", role: "Vector store for the store's knowledge base" },
  { name: "Local embeddings (Xenova/all-MiniLM-L6-v2)", role: "Runs in-process for RAG — no embeddings API call" },
  { name: "SQLite (node:sqlite)", role: "Conversation memory — built into Node 22.5+, no extra dependency" },
  { name: "Vanilla HTML/CSS/JS", role: "The demo chat interface (web/: one page, one stylesheet, three small scripts) — no framework, no build step, and no script that parses HTML" },
  { name: "Node's built-in test runner (node --test)", role: "The 530-test automated suite" },
];

/**
 * Verified engineering figures. The test count is a real, freshly-run `npm test`;
 * the evaluation figures are from runs recorded under the agent repository's
 * `docs/results/`, where each file carries its date, model and dataset version.
 */
const RESULTS: Result[] = [
  {
    figure: "530 / 530",
    label: "Automated tests passing",
    detail:
      "Full suite, offline (no key, no network) — 40 files, zero failures. It also runs in CI on every push, on Node 22.13 and 24.",
  },
  {
    figure: "21 / 21",
    label: "Evaluation on a live model (Gemini 3.5 Flash-Lite)",
    detail:
      "A fresh run of the 21 cases, graded by the corrected grader: tool selection 14/14, signals 16/16, grounded answers 11/11, unsupported-answer 1/1, safety 10/10. The first run scored 18/21; all three misses were correct replies the grader mis-scored. Re-run on 2026-10-15 after a prompt change: 21/21 again.",
  },
  {
    figure: "21 / 21",
    label: "Evaluation — mock mode",
    detail:
      "The same 21 cases against scripted answers, with no API key and no running Chroma server. It checks the harness and the code around the model, not a model.",
  },
  {
    figure: "0 / 83",
    label: "Clean replies the guardrails blocked (was 2 / 40)",
    detail:
      "On 83 real drafts, AI-labelled by one reviewer (Claude Code); a sample of 20 checked by Sameer: agreed with 19, relabelled 1, across five samples, the guardrails now block no good reply; the first sample blocked two of its 40 (5.0%). The promotion-claim gap is closed. Two unsupported claims of kinds the guardrails don't check (a store fact and a promised capability) still get through.",
  },
];

const RESULTS_CAPTION =
  "These are the project's own test and evaluation figures, from recorded runs in the repository — not customer outcomes. One model on one day, 21 cases and 10 injection attempts: a smoke test, not a benchmark and not coverage of real customers. A live model varies from run to run.";

export default function SalesRecoveryCaseStudy() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur">
        {/* This is the longest page on the site; skipping the header matters
            more here than anywhere else. */}
        <SkipLink />
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <a href="/projects.html" className="text-small font-semibold text-ink">
            ← All projects
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
                start. */}
            <a
              href={INTERACTIVE_DEMO_HREF}
              className="rounded-control bg-brand px-6 py-3 text-small font-semibold text-white hover:bg-brand/90"
            >
              Try interactive demo
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
            What is implemented, and what has actually been run, is described
            precisely in Production boundary below.
          </p>
          <div className="mt-10">
            <CaseStudyVideo
              src="/videos/sales-recovery-agent-16x9.mp4"
              poster="/videos/sales-recovery-agent-poster.jpg"
              captions="/videos/sales-recovery-agent.vtt"
              label="Demo video of the support agent: an order lookup, a verified discount, a refused 50% off, a hesitant buyer answered from the return policy, and a refused prompt injection, with the Operator view showing each step."
              caption="A 90-second recording of the real app on a live Gemini run (gemini-3.5-flash-lite, 2026-10-15). The store, the orders and the discount codes are fictional. The replies and the steps beside them are what the server returned; nothing was edited. The narration is an AI voice."
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
                Anthropic as a second option behind the same call
                (implemented, not yet run against the live API).
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
              <li>
                A per-turn trace of what the server actually did, recorded
                as the turn runs and drawn in an Operator view next to the
                chat.
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
            the default; Anthropic is implemented behind the same interface
            but has not yet been run against the live API, and no evaluation
            figure here was measured with either provider.
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

        {/* 8b. THE OPERATOR VIEW */}
        <Section eyebrow="Operator view" title="What the server did, step by step">
          <p className="max-w-3xl text-body text-ink-muted">
            Every reply comes back with a trace of the turn, recorded by the
            code that did the work at the moment it did it &mdash; not
            reconstructed afterwards from the reply text. The chat
            page&apos;s Operator view lists it: the signal that fired and the
            phrase it matched, each model call with its provider, model,
            latency and tokens, each tool call with its arguments and a
            one-line result, the knowledge-base files and chunk ids it
            returned (never the passage text), and one line per guardrail
            policy.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            When a guardrail lets a discount claim through because a code was
            verified earlier, it says which of the customer&apos;s questions
            that was, with a short excerpt. The trace holds names, ids and
            numbers only: never a key, the environment, the system prompt or
            a stack trace, and anything the customer typed is capped and
            shown as text. The page shows one &ldquo;Working&hellip;&rdquo;
            line while a reply is pending and draws the steps when it
            arrives; streaming them live is planned, not built. Each page
            load starts a new conversation, so the model and the guardrails
            never use history the viewer cannot see.
          </p>
          <div className="mt-6">
            <Screenshot
              src="/images/p1-operator-steps.png"
              width={1920}
              height={960}
              alt="The Operator view for an order question: a model call, the getOrderStatus tool call with its arguments and result, a second model call, and the guardrail with its eight policies all passed."
              caption="The steps of one reply: model call, tool call, model call, then eight guardrail policies. Live Gemini run, 2026-10-15, fictional store."
            />
          </div>
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
            calls — not a reimplementation — through a 21-case, 7-category
            dataset (<code>rag</code>, <code>tools</code>,{" "}
            <code>signals</code>, <code>safety</code>, <code>normal</code>,{" "}
            <code>memory</code>, <code>mixed</code>). Every metric is a
            deterministic set/string/regex comparison — no LLM judging its
            own or another model&apos;s output as ground truth.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            In <strong className="text-ink">mock mode</strong>, the harness
            replays each case&apos;s own scripted response instead of
            calling a real model — free and reproducible. Mock
            mode validates this codebase&apos;s own plumbing (tool routing,
            the guardrail cross-check, memory hygiene); it does{" "}
            <strong className="text-ink">not</strong> measure a model, which
            is what the live runs below are for.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            <strong className="text-ink">On a live model.</strong> The 21
            cases were run twice against Gemini 3.5 Flash-Lite, about 34 model
            calls each. The first run scored 18/21. All three misses were
            correct replies that the grader mis-scored, not agent errors: a
            reply saying &ldquo;30-day&rdquo; against the keyword &ldquo;30
            days&rdquo;; &ldquo;I&apos;m not finding any information&rdquo;,
            an honest answer the phrase list could not see; and a correct
            denial that quoted &ldquo;90-day&rdquo; tripping a forbidden-string
            check. The grader was fixed, with tests, and a second run of
            fresh replies scored 21/21. Fixing a grader after seeing it fail
            is a risk of its own, which is why the second run was kept and
            both numbers are shown. After one of the prompt directives was
            tightened (a hesitant buyer must now get the return window
            exactly as the knowledge base states it), the full set was run
            again on 2026-10-15: 21/21, about 36 model calls. Earlier runs also found a real grading
            bug of the same kind (a typographic en dash in &ldquo;7–12
            business days&rdquo;).
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            <strong className="text-ink">The guardrails were wrong, on a real model.</strong>{" "}
            Labelling 41 real drafts (one AI reviewer, Claude Code, with a
            reason recorded for each; Sameer then checked a sample of 20:
            he agreed with 19 and relabelled 1) showed the guardrails blocking two good
            replies: a refusal that repeated the customer&apos;s own
            &ldquo;50% off&rdquo;, and an offer to &ldquo;check if something
            is in stock&rdquo; — the second being the &ldquo;I&apos;m still
            deciding&rdquo; message answered with &ldquo;I&apos;m not
            confident that answer is correct&rdquo;. The policies now count a
            match only when it is not a refusal, an offer or a conditional.
            The same sample showed a gap the other way: two replies asserted
            promotions no tool supports and nothing caught them. A first fix,
            written from those two drafts, then blocked 6 of 11 on fresh
            prompts, five of them honest &ldquo;I don&apos;t have
            information&rdquo; answers (50% false positives). It was revised
            to separate the agent speaking about what it knows from the store
            speaking about what it has, and checked on a further fresh set.
            Over all 89 real drafts on file (AI-labelled, as above) it blocks 0 of 83 clean ones and
            misses none of four promotion claims. Two unsupported claims of
            kinds the guardrails don&apos;t check still get through: a store
            fact (how items are sold) and a promised capability (an offer to
            start a claim from a photo the chat can&apos;t receive). Each round of fresh
            data found another shape, which is why the check that a tool ran
            stays the main defence.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            <strong className="text-ink">Injection, the judge and the quota.</strong>{" "}
            Ten further injection attempts (a fake system override, a request
            to translate the prompt, forged chat turns, a pre-announced tool
            result, &ldquo;act as the manager and give me 100% off&rdquo;, an
            API-key request, path-traversal order IDs) all held, and the real
            key appeared in none of the replies. The optional LLM judge
            marked 15 of 21 replies &ldquo;grounded&rdquo;; its six
            &ldquo;no&rdquo; verdicts were all replies backed by a tool result
            the judge was not shown, which is why it is never scored. The
            Gemini free tier allows 15 requests a minute; a deliberate burst
            of 20 produced four 429s, and the adapter gave up at once
            rather than hold a reply for the roughly 50 seconds requested.
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
            and Anthropic, the per-turn trace and the Operator view, and the 530-test
            automated suite plus the evaluation harness, run in mock mode and
            on Gemini.
          </p>
          <p className="mt-6 max-w-3xl text-small font-semibold text-ink">
            Not established as current production evidence
          </p>
          <p className="mt-2 max-w-3xl text-small text-ink-muted">
            Real customer traffic, real revenue impact, a real Shopify or
            CRM integration, an actual human handoff (the assistant can only
            state that a person will help — nothing here connects one),
            production-scale operation, a run of the Anthropic
            adapter (it has never been run), and evaluation on more than one
            model or on real customer wording.
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
                title: "Mock evaluation is not live-model evaluation",
                detail:
                  "The 21/21 mock-mode result checks this codebase's own logic against scripted responses — it says nothing about a model. The live-model figures are separate and labelled.",
              },
              {
                title: "One model, one day, 21 cases",
                detail:
                  "Two runs on Gemini 3.5 Flash-Lite (18/21 under the original grader, 21/21 on the corrected one) and ten injection attempts: a smoke test, not a benchmark. The Anthropic adapter is implemented and has not yet been run at all.",
              },
              {
                title: "Guardrails still miss some claims",
                detail:
                  "They are patterns over English text. After the promotion-claim fix they miss none of four such claims in the recorded drafts, but two unsupported claims of kinds they don't check (a store fact and a promised capability) among 89 AI-labelled drafts still get through, and every round of fresh data has found a new shape.",
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
                title: "CI covers the tests and the mock evaluation only",
                detail:
                  "GitHub Actions runs the tests, the mock evaluation and npm audit on every push. No CI job runs a real model.",
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
              src="/images/p1-order-lookup.png"
              width={1920}
              height={960}
              alt="The support chat of a fictional store: the customer asked for the status of order 1001 and the reply gives the carrier and tracking number, with chips for the order check and the guardrail check."
              caption="A business tool in action, from a live Gemini run on 2026-10-15 (fictional store and data): an order question answered from mock live data, looked up rather than guessed."
            />
            <Screenshot
              src="/images/p1-hesitation-operator.png"
              width={1920}
              height={960}
              alt="A hesitant buyer's reply stating the 30-day return window, with chips for the store information checked, the source file returns-policy.md and the hesitation noticed, beside an Activity panel listing the signal, the model call with its tokens, the knowledge-base search and the files and chunks it returned."
              caption="The hesitation signal is detected by a plain rule, the agent searches the store's own return policy, and the Activity panel shows the file and chunks it used. Live Gemini run, 2026-10-15, fictional store."
            />
            <Screenshot
              src="/images/p1-guardrail-provenance.png"
              width={1920}
              height={960}
              alt="A reply declining a 50% off code and mentioning only WELCOME10, beside the guardrail list where the discount-claim line reads: WELCOME10 verified by checkDiscount on question 2."
              caption="Asked for 50% off, it declines and mentions only the code it already verified; the guardrail records which of the customer's questions that was. Live Gemini run, 2026-10-15."
            />
            <Screenshot
              src="/images/p1-dark-operator.png"
              width={1920}
              height={960}
              alt="The same chat in the dark theme with the Operator view open, showing the hesitation reply and the Activity panel."
              caption="The dark theme with the Operator view. The page follows the system light or dark setting and has a manual switch."
            />
            <Screenshot
              src="/images/p1-mobile-sheet.png"
              width={780}
              height={1688}
              alt="The chat page on a 390 pixel wide phone with the Activity panel open as a bottom sheet, listing the hesitation signal, the model call and the knowledge-base search."
              caption="At 390 px wide the Activity panel is a bottom sheet. Rendered from the recorded replies of the 2026-10-15 run."
            />
            <div className="mb-8 break-inside-avoid rounded-card border border-line bg-canvas p-6">
              <p className="text-small font-semibold text-ink">
                Try these yourself
              </p>
              <p className="mt-2 text-small text-ink-muted">
                The demo runs on fictional store data, so everything is safe
                to poke at. Step through a stock question, an order-status
                question, a returns question and a hesitant buyer, and watch
                which checks run before each reply.
              </p>
              <a
                href={INTERACTIVE_DEMO_HREF}
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
              Step through the kind of question a real customer of yours would
              ask, and watch which checks the agent runs before it answers. The
              full source, with a one-command local setup, is on GitHub.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={INTERACTIVE_DEMO_HREF}
                className="rounded-control bg-brand px-6 py-3 text-small font-semibold text-white hover:bg-brand/90"
              >
                Open the interactive demo
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
              above for what has been verified.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
