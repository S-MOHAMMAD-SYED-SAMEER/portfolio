import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { enquiryMailto } from "../data/contact";
import { projectById, requiredLink } from "../data/projects";
import Screenshot from "../components/Screenshot";
import CaseStudyVideo from "../components/CaseStudyVideo";
import ExplainableAtsFlow from "../components/caseStudy/ExplainableAtsFlow";
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
 * The lookup was keyed on this page's own route until Phase 1; an id is used
 * now because a route is something that can legitimately move.
 */
const PROJECT = projectById("p3");
const REPO_URL = requiredLink(PROJECT, "repoHref");
const INTERACTIVE_DEMO_HREF = requiredLink(PROJECT, "interactiveDemoHref");

const CAPABILITIES = [
  {
    title: "Quotes the CV, not itself",
    detail:
      "Every requirement judgement points at a passage from the candidate's own CV. If a passage cannot be found in the document word for word, it is thrown out before it can count.",
  },
  {
    title: "Reads a CV without the personal details",
    detail:
      "Name, contact details, age and date of birth, gender, nationality, marital status, religion, photo references and address are removed before the reader sees the document, so they are not available to influence what it finds.",
  },
  {
    title: "Separates silence from shortfall",
    detail:
      "A CV that says nothing about a requirement is reported differently from one that says something which falls short. The two mean different things about a person and are never merged.",
  },
  {
    title: "Shows the arithmetic",
    detail:
      "Each requirement's contribution is shown alongside the total, and the parts add up to the whole exactly. Nothing about the number has to be taken on trust.",
  },
  {
    title: "Explains every placement",
    detail:
      "Each candidate's position in the list comes with a sentence saying why they are there — including when an essential requirement moved them down.",
  },
  {
    title: "Keeps the decision with the recruiter",
    detail:
      "Shortlist, reject or hold, each recorded with a written reason. The system produces the evidence and the ordering; a person makes the call.",
  },
];

const STACK = [
  { name: "Node.js 24 + TypeScript", role: "Application server, run without a build step" },
  { name: "Express 5", role: "HTTP layer" },
  { name: "React 19 + Vite + Tailwind 4", role: "Recruiter dashboard" },
  { name: "SQLite / PostgreSQL", role: "Assessments, evidence, decisions and audit trail" },
  { name: "Claude Haiku 4.5", role: "Proposes verdicts and quotes in the full application; evaluated once, on invented data" },
  { name: "Deterministic stand-in reader", role: "What the interactive demo runs on — see the limitations below" },
];

const RESULTS: Result[] = [
  {
    figure: "886",
    label: "Automated tests passing",
    detail:
      "673 covering the server and its scoring rules, 213 covering the dashboard, with the two portfolio repositories checked out beside the project (as its CI does). In a standalone clone 874 pass and 12 skip, because the parity tests need those repositories.",
  },
  {
    figure: "86.8%",
    label: "Verdicts matching the labels (one run)",
    detail:
      "Claude Haiku 4.5 read twenty invented CVs once, and 59 of 68 verdicts matched the labels (17 of 20 candidates landed in the right tier). The labels were drafted by ChatGPT, reviewed independently by ChatGPT and Claude, and approved by Sameer: not an independent human labelling. A rule-based check alone, on the same quotes, matched 38.2%.",
  },
  {
    figure: "4",
    label: "Distinct ranking outcomes",
    detail:
      "Meets every must-have, worth a look, missing an essential, and not yet assessed — each with its own wording.",
  },
  {
    figure: "0",
    label: "Scores produced by an AI",
    detail:
      "The model proposes verdicts and quotes. It has no field for a score, so a model cannot return one: the number is integer arithmetic done by code.",
  },
  {
    figure: "100%",
    label: "Contributions reconcile",
    detail:
      "Each requirement's share sums to exactly the stored total, asserted across every weighting the tests cover.",
  },
];

const RESULTS_CAPTION =
  "These are engineering results from this project's own test suite and one evaluation run, on invented candidates and CVs. They are not customer results — the system has not been run against real applicants — and a passing test suite is evidence that the rules behave as specified, not proof of good hiring outcomes. The 86.8% is one model, one run, twenty AI-written CVs and 68 labels that are not an independent human labelling, and the rules were chosen on those same rows, so it is not a held-out accuracy figure.";

/**
 * The centrepiece: two candidates on the same score, placed differently, with
 * the reason on screen. This is the demo dataset's actual behaviour — a test
 * asserts the two scores stay identical, precisely so this comparison cannot
 * quietly decay into ordinary sorting.
 */
function GateComparison() {
  const candidates = [
    {
      label: "Candidate A",
      placement: "Placed higher",
      tier: "Meets every must-have",
      verdict: "Met",
      quote:
        "Running PostgreSQL at scale for a multi-tenant billing system.",
      note: "The CV shows the essential requirement, in the candidate's own words.",
      accent: true,
    },
    {
      label: "Candidate B",
      placement: "Placed lower",
      tier: "Missing an essential",
      verdict: "Does not meet",
      quote: "Used PostgreSQL for a final-year university project.",
      note:
        "Relevant text was found. It does not show the requirement the role asks for.",
      accent: false,
    },
  ];

  return (
    <div>
      {/* The comparison below is what the demo on this site shows, and the demo folds
          word endings, as the application does. The page says what that means. */}
      <p className="mb-4 rounded-card border border-line bg-surface p-4 text-small text-ink-muted">
        <span className="font-semibold text-ink">How the words are matched.</span>{" "}
        Word endings are folded, so &ldquo;Running&rdquo; counts as the
        criterion&rsquo;s &ldquo;run&rdquo;; the demo here does the same. In the
        demo, rules rather than a model decide each verdict. In the full
        application the AI proposes the verdict and this rule is only a second
        opinion.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {candidates.map((c) => (
          <div
            key={c.label}
            className={`rounded-card border-2 p-5 ${
              c.accent
                ? "border-line-strong bg-brand-tint"
                : "border-line bg-canvas"
            }`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-small font-semibold text-ink">{c.label}</p>
              <p className="text-section text-ink">
                71%
              </p>
            </div>
            <p className="mt-1 text-meta font-medium uppercase tracking-wide text-ink-muted">
              {c.placement} · {c.tier}
            </p>

            <p className="mt-4 text-meta font-medium uppercase tracking-wide text-ink-muted">
              Essential requirement · {c.verdict}
            </p>
            <blockquote className="mt-2 border-l-2 border-line-strong pl-3 text-small italic text-ink-muted">
              “{c.quote}”
            </blockquote>
            <p className="mt-3 text-small text-ink-muted">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-card border border-line bg-surface p-6">
        <p className="text-small font-semibold text-ink">
          Same number. Different position. Nothing hidden.
        </p>
        <p className="mt-2 text-small text-ink-muted">
          Both candidates score 71%, and both still show 71% after the ordering
          is applied — the score is not quietly reduced to justify the
          placement. What separates them is that one CV demonstrates the
          essential requirement and the other does not, and the list says so on
          the row rather than leaving a recruiter to infer it from the order.
        </p>
        <p className="mt-3 text-small text-ink-muted">
          That matters because the alternative is the sentence no ranking should
          ever produce: <em>strong overall, but cannot do the job</em> — with no
          way to see which half is which.
        </p>
      </div>

      {/* The distinction the whole fairness story rests on. These are the exact
          labels and wording a recruiter sees in the product. */}
      <div className="mt-8">
        <p className="text-small font-semibold text-ink">
          And a third candidate might have neither
        </p>
        <p className="mt-2 max-w-3xl text-small text-ink-muted">
          A CV that never mentions a requirement is not the same as one that
          mentions it and falls short. Most tools collapse the two into a single
          &ldquo;no&rdquo;. This one keeps them apart, in the words a recruiter
          actually reads:
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="text-small font-semibold text-ink">
              &ldquo;Does not meet&rdquo;
            </p>
            <p className="mt-2 text-small text-ink-muted">
              We found relevant text in the CV and it does not show this.
            </p>
            <p className="mt-3 text-meta text-ink-muted">
              A finding. The candidate was assessed on this and came up short.
            </p>
          </div>
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="text-small font-semibold text-ink">
              &ldquo;Not demonstrated&rdquo;
            </p>
            <p className="mt-2 text-small text-ink-muted">
              Nothing in the CV speaks to this either way. Worth asking about
              rather than assuming.
            </p>
            <p className="mt-3 text-meta text-ink-muted">
              A gap in the document, not a mark against the person — so they are
              held for a look rather than ruled out.
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-small text-ink-muted">
          Treating silence as failure is how a good candidate disappears from a
          shortlist for something they simply did not think to write down.
        </p>
      </div>
    </div>
  );
}

export default function ExplainableAtsCaseStudy() {
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
          <p className="text-eyebrow uppercase text-brand">Case Study</p>
          <h1 className="mt-4 max-w-3xl text-display-sm text-ink sm:text-display">
            {PROJECT.service}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-muted">
            Ranks candidates against a role and explains every placement with the
            exact sentence from the CV that earned it — so a screening decision
            can be defended to the person it was made about.
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
            <a
              href={enquiryMailto("AI Recruitment Intelligence")}
              className="rounded-control border border-line-strong px-6 py-3 text-small font-semibold text-ink hover:border-ink-muted"
            >
              Talk about your hiring process
            </a>
          </div>
          {/* What the demo actually gets you, said before it is pressed. The
              limitations named here are the same ones set out in full further
              down the page; they are repeated in one line because a reader who
              opens the demo from here may never scroll that far. */}
          <p className="mt-4 text-meta text-ink-muted">
            The interactive demo runs in this tab — no account, nothing to
            install. It uses an invented dataset and a deterministic stand-in
            reader: no real applicants have been screened, and no customer
            outcomes are claimed.
          </p>
          <div className="mt-10">
            <Screenshot
              src="/images/p3-candidate-ranking.png"
              width={2200}
              height={918}
              alt="The ranking for a role with three invented candidates. The first meets every must-have at 100%. The second also scores 100% but is marked worth a look, because the quotes credited on two requirements share no words with them. The third scores 43% and is placed last for missing an essential requirement, with the sentence that says so."
              caption="The ranking: three invented candidates, each placed with a sentence saying why. Two score 100%, and the one whose quotes need a person's check sits below the one that does not. A missing essential requirement moves a candidate down without changing the score. A crop of the page."
            />
          </div>
        </section>

        {/* 2. PROBLEM */}
        <Section
          eyebrow="The problem"
          title="A number nobody can defend"
        >
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-4 text-ink-muted">
              <p>
                Screening tools hand back a score. Ask where it came from and the
                answer is a model, a weighting nobody can see, and a ranking that
                cannot be traced back to anything a candidate actually wrote.
              </p>
              <p>
                That is fine right up until it is not. A rejected candidate asks
                why. A hiring manager disagrees with the order. Someone senior
                wants to know the shortlist was not shaped by something it should
                never have seen. In each case, &ldquo;the system scored them at
                62&rdquo; is not an answer.
              </p>
              <p>
                There is a quieter problem underneath. Most tools cannot tell the
                difference between a CV that says nothing about a requirement and
                one that says something falling short — so a candidate who simply
                did not mention a skill is treated exactly like one who was
                assessed and found wanting.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                "A score with no working shown",
                "No way to trace a ranking back to the CV",
                "Silence about a skill treated as failure at it",
                "Rejections that cannot be explained to the candidate",
              ].map((point) => (
                <li
                  key={point}
                  className="rounded-card border border-line bg-canvas px-4 py-3 text-small text-ink-muted"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* 3. SOLUTION */}
        <Section
          eyebrow="The solution"
          title="The AI proposes. The application checks."
        >
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-4 text-ink-muted">
              <p>
                The split is the whole design. An AI reads the CV and, for each
                requirement, proposes a verdict and quotes the passages it relies
                on. It is never asked for a score, a ranking or a decision, and
                it is given no way to give one — the step it takes part in has no
                field for a number.
              </p>
              <p>
                Everything after that happens in ordinary application code: every
                quote is looked up in the CV, a verdict with no verified quote is
                lowered to &ldquo;not demonstrated&rdquo;, a fixed rule reads the
                same quotes as a second opinion, and the score is integer
                arithmetic over weights the role set in advance.
              </p>
              <p>
                So when someone asks why a candidate placed where they did, the
                answer is a requirement, a verdict, the AI&apos;s one-line reason,
                and a sentence from their own CV that was checked against the
                document.
              </p>
              <p>
                It did not begin this way. The first design had the AI only quote
                and fixed rules judge. Measured against the labels, those rules
                matched 35 to 40% of the time even when handed perfect quotes, so
                the judgement moved to the AI and the rules became the check.
              </p>
            </div>
            <div className="rounded-card border border-line bg-canvas p-6">
              <p className="text-small font-semibold text-ink">
                What that means in practice
              </p>
              <ul className="mt-4 flex flex-col gap-3 text-small text-ink-muted">
                <li>Every judgement points at a passage from the CV.</li>
                <li>
                  A quote that is not in the document is discarded before it can
                  count, and a verdict left with no quote reads &ldquo;not
                  demonstrated&rdquo;.
                </li>
                <li>
                  The arithmetic is the same every time. The AI&apos;s own
                  reading can differ from one run to the next.
                </li>
                <li>
                  The recruiter decides. The system ranks, explains, and records
                  the reasoning.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 4. HOW A DECISION IS MADE */}
        <Section
          eyebrow="How it works"
          title="One CV, from arrival to shortlist"
        >
          <ExplainableAtsFlow />

          {/* A text link, not another button: the actions in the hero are the
              page's calls to action and this is a way to see the flow move. */}
          <p className="mt-4 text-small text-ink-muted">
            <a
              href={INTERACTIVE_DEMO_HREF}
              className="text-small font-semibold text-brand underline underline-offset-4 hover:text-brand/90"
            >
              Try the interactive demo
            </a>{" "}
            to step through this flow in your browser, run by the project&apos;s own screening code on invented candidates —
            no account needed.
          </p>
        </Section>

        {/* 5. EVIDENCE VERIFICATION */}
        <Section
          eyebrow="Trust"
          title="A quote that isn't in the CV doesn't count"
        >
          <div className="rounded-card border-2 border-line-strong bg-brand-tint p-6 sm:p-8">
            <p className="max-w-3xl text-body text-ink">
              An AI asked to quote a document will occasionally produce a passage
              that reads perfectly and does not exist. Nothing about the text
              gives it away — which is exactly why this system does not try to
              judge quotes by reading them.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Every quote is looked up",
                  detail:
                    "Each passage is checked against the CV that was actually submitted, word for word, before it is allowed to count.",
                },
                {
                  title: "What cannot be found is dropped",
                  detail:
                    "A passage that is not in the document takes no part in the score and is never shown to a recruiter as evidence.",
                },
                {
                  title: "The attempt is still recorded",
                  detail:
                    "Rejected passages are kept in the history rather than deleted, so a problem is visible rather than silently tidied away.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-control border border-line bg-surface p-4"
                >
                  <p className="text-small font-semibold text-ink">
                    {item.title}
                  </p>
                  <p className="mt-2 text-small text-ink-muted">{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-small text-ink-muted">
              This is what makes the evidence on screen safe to repeat. A
              recruiter can read a quote back to a candidate, or to a hiring
              manager, knowing it came out of the document in front of them.
            </p>
          </div>
        </Section>

        {/* 6. PROTECTED ATTRIBUTES */}
        <Section
          eyebrow="Fairness by construction"
          title="Personal details are removed before the CV is read"
        >
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-4 text-ink-muted">
              <p>
                Name, contact details, age and date of birth, gender,
                nationality, marital status, religion, photo references and address are masked out of the copy the reader receives. They are
                not filtered afterwards and the reader is not instructed to
                ignore them — they are simply not in the text it is given.
              </p>
              <p>
                That is a stronger arrangement than an instruction, because it
                does not depend on anything complying. What was removed is
                recorded as a category and a position, never as a value, so the
                system can show a recruiter that a date of birth was taken out
                without the finding holding the date itself. The original CV
                text is stored, because every quote is checked against it, so
                the stored copy still contains those details; what the reader
                never receives is the masked-out text.
              </p>
              <p>
                The masking keeps the document the same length, which is what
                lets a quoted passage still line up exactly with the original CV
                — the evidence stays checkable even though the reader never saw
                the personal details.
              </p>
            </div>
            <div className="rounded-card border border-line bg-canvas p-6">
              <p className="text-small font-semibold text-ink">
                What this is, and what it is not
              </p>
              <ul className="mt-4 flex flex-col gap-3 text-small text-ink-muted">
                <li>
                  It removes a specific, listed set of personal details before
                  the reading step.
                </li>
                <li>
                  It records that they were removed, so the exclusion can be
                  shown rather than asserted.
                </li>
                <li>
                  It is not a claim that bias has been solved, and it is not
                  legal or regulatory advice.
                </li>
                <li>
                  A CV can still carry signals in its wording. This closes one
                  clear route, not every route.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 7. DETERMINISTIC SCORING */}
        <Section
          eyebrow="The number"
          title="Arithmetic you can check by hand"
        >
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-4 text-ink-muted">
              <p>
                No AI calculates the score. Each requirement carries a weight the
                role set in advance; each verdict earns a share of it; the total
                is a weighted average worked out in integer arithmetic.
              </p>
              <p>
                Every requirement&apos;s contribution is shown alongside the
                headline figure, and the contributions add up to it exactly —
                not approximately. A recruiter who adds the column gets the
                number at the top.
              </p>
              <p>
                It sounds like a small thing. It is the difference between a
                figure a hiring manager can interrogate and one they have to
                accept.
              </p>
            </div>
            <div className="rounded-card border border-line bg-canvas p-6">
              <p className="text-small font-semibold text-ink">
                Why it is done this way
              </p>
              <ul className="mt-4 flex flex-col gap-3 text-small text-ink-muted">
                <li>
                  The same verdicts and quotes produce the same score on any
                  machine, every time.
                </li>
                <li>
                  A score from six weeks ago can still be reproduced from what
                  was stored with it.
                </li>
                <li>
                  Changing what a role values means changing a weight, not
                  retraining anything.
                </li>
                <li>
                  Nothing about the figure has to be taken on trust — the
                  working is on the page.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 8. THE MUST-HAVE GATE — CENTREPIECE */}
        <Section
          eyebrow="The essential requirement"
          title="Two candidates on 71%, placed differently"
        >
          <GateComparison />
        </Section>

        {/* 9. CANDIDATE EXPLANATION */}
        <Section
          eyebrow="The candidate view"
          title="Everything behind a placement, on one screen"
        >
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-4 text-ink-muted">
              <p>
                Opening a candidate shows the score and their standing, then
                every requirement the role asked for — including the ones the CV
                never addressed, which are listed rather than quietly omitted.
              </p>
              <p>
                Each requirement carries its verdict in plain words, the reason
                behind it, and the passage from the CV it rests on. Where the
                AI&apos;s verdict and a rule-based check differ, both are shown;
                where a credited quote shares no word with the requirement, the
                page says so and asks a person to check. The
                technical detail — weights, contributions, which reader produced
                the evidence — sits behind a disclosure, out of the way of
                someone making a decision but available to someone checking one.
              </p>
              <p>
                The decision is recorded there too: shortlist, reject or hold, each
                requiring a written reason that stays on the record alongside the
                full history of how the assessment was produced.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                "The score, and how the candidate stands against the essentials",
                "Every requirement, with its verdict in plain language",
                "The quoted passage each verdict rests on",
                "Which personal details were removed before reading — by category",
                "The decision, its written reason, and the full history",
              ].map((point) => (
                <li
                  key={point}
                  className="rounded-card border border-line bg-canvas px-4 py-3 text-small text-ink-muted"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* 10. CAPABILITIES */}
        <Section eyebrow="Capabilities" title="What it actually does">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((capability) => (
              <div
                key={capability.title}
                className="rounded-card border border-line p-5"
              >
                <h3 className="text-small font-semibold text-ink">
                  {capability.title}
                </h3>
                <p className="mt-2 text-small leading-relaxed text-ink-muted">
                  {capability.detail}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 11. SCREENSHOTS */}
        <Section eyebrow="The product" title="Seeing it work">
          <div className="mb-10">
            <CaseStudyVideo
              src="/videos/explainable-ats-16x9.mp4"
              poster="/videos/explainable-ats-poster.jpg"
              captions="/videos/explainable-ats.vtt"
              label="Demo video of the Explainable ATS: requirements, a CV masked before a model reads it, a verdict with its quoted passage, a flag where a quote shares no words with the requirement, two candidates with the same score placed differently, a recorded decision with a written reason, and the measured results."
              caption="An 88-second recording of the real app on live Claude Haiku 4.5 runs (2026-10-19). Every CV is invented. The answers and the screens are what the server returned; the time spent waiting for the model is cut, the last scene is a card of the measured figures rather than the app, and the decision scene was recorded in a second take. Narration: AI voice."
            />
          </div>
          <div className="columns-1 gap-8 sm:columns-2">
            <Screenshot
              src="/images/p3-model-checked.png"
              width={2360}
              height={2990}
              alt="A candidate page for a CV scored from a live model's verdicts: a 100% score marked worth a look, a flag saying the quote shares no words with the requirement, and two requirements each showing the model's verdict and one-line reason, the rule-based second opinion and the flag."
              caption="One live run of Claude Haiku 4.5 on an invented CV (cv-02), 2026-10-19, shown again from the saved reply with no new request."
            />
            <Screenshot
              src="/images/p3-candidate-evidence.png"
              width={1920}
              height={611}
              alt="A requirement judgement shown alongside the passage quoted from the candidate's CV that it rests on."
              caption="A verdict and the passage it rests on — checked against the submitted CV before it was allowed to count."
            />
            <Screenshot
              src="/images/p3-decision-audit-trail.png"
              width={1900}
              height={1690}
              alt="The recorded recruiter decision and the history of every step taken to produce the assessment."
              caption="The decision with its written reason, above the append-only history of how the assessment was produced."
            />
            <Screenshot
              src="/images/p3-system-status.png"
              width={1900}
              height={2759}
              alt="The Explainable ATS status screen, reporting how the running system is configured."
              caption="The status screen: what the running system is configured with, reported without exposing any value. Top of a longer page."
            />
          </div>
        </Section>

        {/* 12. TECHNOLOGY */}
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

        {/* 13. VALIDATION */}
        <Section eyebrow="Validation" title="Measured, not just described">
          <ResultsPanel results={RESULTS} caption={RESULTS_CAPTION} />
        </Section>

        {/* 14. HONEST LIMITATIONS */}
        <Section eyebrow="Where it stands" title="What this is not, yet">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "The demo's reader is a deterministic stand-in",
                detail:
                  "The interactive demo on this site reads CVs with a fixed, offline stand-in rather than a live language model, and fixed rules decide each verdict, so a walkthrough behaves identically every time. The full application can call a live model (Claude Haiku 4.5 is the default); the demo does not.",
              },
              {
                title: "Evaluated once, on invented data",
                detail:
                  "Claude Haiku 4.5 read twenty invented CVs once: 86.8% of 68 verdicts matched the labels, and 17 of 20 candidates landed in the right tier. One model, one run; each verdict is about 1.5 points. The rules were chosen on the same rows, so this is not a held-out figure.",
              },
              {
                title: "The labels are not an independent human labelling",
                detail:
                  "Labels drafted by ChatGPT; reviewed independently by ChatGPT and Claude (agreed on 64 of 68 rows); final decisions approved by Sameer. Not an independent human labelling. Five more CVs were written to be held out and were never labelled or run.",
              },
              {
                title: "Keyword stuffing is a known limit",
                detail:
                  "A quote that lists every word of a requirement is real text in the CV, so it is verified and credited, and the live check did exactly that. In offline tests, an AI that obeyed every injected instruction would be scored as it said, with every such credit flagged and the candidate sent to review. In one live run, none of the seven CVs with hidden instructions fooled the real model.",
              },
              {
                title: "No real applicants have been screened",
                detail:
                  "Everything shown runs on an invented dataset. There are no customer outcomes to report, and none are claimed.",
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

        {/* 15. CLOSING CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-4">
          <div className="rounded-card border border-line bg-canvas p-8 sm:p-10">
            <h2 className="text-section text-ink">
              If you screen CVs and cannot explain the shortlist
            </h2>
            <p className="mt-3 max-w-2xl text-ink-muted">
              That is the problem this was built for. If you are weighing up AI
              in your hiring process — or you have a tool whose output nobody can
              account for — it is worth a conversation.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-control bg-brand px-6 py-3 text-small font-semibold text-white hover:bg-brand/90"
              >
                Read the Source on GitHub
              </a>
              <a
                href={enquiryMailto("AI Recruitment Intelligence")}
                className="rounded-control border border-line-strong px-6 py-3 text-small font-semibold text-ink hover:border-ink-muted"
              >
                Start a conversation
              </a>
            </div>
            <p className="mt-6 text-meta text-ink-muted">
              The demo dataset is invented — the candidates, employers and
              personal details are examples written for this project, not real
              people. This system ranks and explains; it does not hire or reject
              anyone.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
