import { useState } from "react";
import Footer from "../components/Footer";
import ExplainableAtsFlow from "../components/caseStudy/ExplainableAtsFlow";
import ResultsPanel, { type Result } from "../components/caseStudy/ResultsPanel";

const REPO_URL = "https://github.com/S-MOHAMMAD-SYED-SAMEER/ai-business-automation";

const CAPABILITIES = [
  {
    title: "Quotes the CV, not itself",
    detail:
      "Every requirement judgement points at a passage from the candidate's own CV. If a passage cannot be found in the document word for word, it is thrown out before it can count.",
  },
  {
    title: "Reads a CV without the personal details",
    detail:
      "Name, contact details, date of birth, nationality, gender and address are removed before the reader sees the document, so they are not available to influence what it finds.",
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
      "Advance, reject or hold, each recorded with a written reason. The system produces the evidence and the ordering; a person makes the call.",
  },
];

const STACK = [
  { name: "Node.js 24 + TypeScript", role: "Application server, run without a build step" },
  { name: "Express 5", role: "HTTP layer" },
  { name: "React 19 + Vite + Tailwind 4", role: "Recruiter dashboard" },
  { name: "SQLite / PostgreSQL", role: "Assessments, evidence, decisions and audit trail" },
  { name: "Deterministic stand-in reader", role: "What the current demo runs on — see the limitations below" },
];

const RESULTS: Result[] = [
  {
    figure: "315",
    label: "Automated tests passing",
    detail: "291 covering the server and its scoring rules, 24 covering the dashboard.",
  },
  {
    figure: "4",
    label: "Distinct ranking outcomes",
    detail:
      "Meets everything, worth a look, missing an essential, and not yet assessed — each with its own wording.",
  },
  {
    figure: "0",
    label: "Scores produced by an AI",
    detail:
      "The extraction step has no field for a verdict or a number, so a model cannot return one.",
  },
  {
    figure: "100%",
    label: "Contributions reconcile",
    detail:
      "Each requirement's share sums to exactly the stored total, asserted across every weighting the tests cover.",
  },
];

const RESULTS_CAPTION =
  "These are engineering results from this project's own test suite, measured against a fixed demo dataset with invented candidates. They are not customer results — the system has not been run against real applicants — and a passing test suite is evidence that the rules behave as specified, not proof of good hiring outcomes.";

/**
 * Placeholder for a screenshot of the real running product. These slots stay
 * visibly empty rather than being filled with a mock-up: an illustration
 * dressed as a screenshot would misrepresent what the product looks like.
 * Dropping the named file into portfolio/public/images/ replaces the
 * placeholder automatically — no code change needed.
 */
function Screenshot({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  const [missing, setMissing] = useState(false);

  return (
    <figure>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        {missing ? (
          <div className="flex aspect-video items-center justify-center">
            <p className="px-6 text-center text-xs text-slate-400">
              Product screenshot to be added
            </p>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="h-auto w-full"
            onError={() => setMissing(true)}
          />
        )}
      </div>
      <figcaption className="mt-2 text-xs text-slate-500">{caption}</figcaption>
    </figure>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-6 py-14 sm:py-16">
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-2xl font-bold text-slate-900">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

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
      tier: "Meets every essential",
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
      <div className="grid gap-4 sm:grid-cols-2">
        {candidates.map((c) => (
          <div
            key={c.label}
            className={`rounded-lg border-2 p-5 ${
              c.accent
                ? "border-indigo-200 bg-indigo-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">{c.label}</p>
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                71%
              </p>
            </div>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
              {c.placement} · {c.tier}
            </p>

            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">
              Essential requirement · {c.verdict}
            </p>
            <blockquote className="mt-2 border-l-2 border-slate-300 pl-3 text-sm italic text-slate-700">
              “{c.quote}”
            </blockquote>
            <p className="mt-3 text-sm text-slate-600">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold text-slate-900">
          Same number. Different position. Nothing hidden.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Both candidates score 71%, and both still show 71% after the ordering
          is applied — the score is not quietly reduced to justify the
          placement. What separates them is that one CV demonstrates the
          essential requirement and the other does not, and the list says so on
          the row rather than leaving a recruiter to infer it from the order.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          That matters because the alternative is the sentence no ranking should
          ever produce: <em>strong overall, but cannot do the job</em> — with no
          way to see which half is which.
        </p>
      </div>

      {/* The distinction the whole fairness story rests on. These are the exact
          labels and wording a recruiter sees in the product. */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-slate-900">
          And a third candidate might have neither
        </p>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          A CV that never mentions a requirement is not the same as one that
          mentions it and falls short. Most tools collapse the two into a single
          &ldquo;no&rdquo;. This one keeps them apart, in the words a recruiter
          actually reads:
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">
              &ldquo;Does not meet&rdquo;
            </p>
            <p className="mt-2 text-sm text-slate-600">
              We found relevant text in the CV and it does not show this.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              A finding. The candidate was assessed on this and came up short.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">
              &ldquo;Not demonstrated&rdquo;
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Nothing in the CV speaks to this either way. Worth asking about
              rather than assuming.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              A gap in the document, not a mark against the person — so they are
              held for a look rather than ruled out.
            </p>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm text-slate-600">
          Treating silence as failure is how a good candidate disappears from a
          shortlist for something they simply did not think to write down.
        </p>
      </div>
    </div>
  );
}

export default function ExplainableAtsCaseStudy() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <a href="/#projects" className="text-sm font-semibold text-slate-900">
            ← AI Business Automation
          </a>
          <div className="flex items-center gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              View on GitHub
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* 1. HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-4 pt-16 sm:pt-20">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
            Case Study — Built, demo not yet deployed
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold text-slate-900 sm:text-5xl">
            AI Recruitment Intelligence
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            Ranks candidates against a role and explains every placement with the
            exact sentence from the CV that earned it — so a screening decision
            can be defended to the person it was made about.
          </p>
          <div className="flex flex-wrap gap-4 pt-8">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              View on GitHub
            </a>
            <a
              href="/#contact"
              className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Talk about your hiring process
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Built locally and verified by an automated test suite — a hosted demo
            is coming. Until then the source is public and the walkthrough below
            describes exactly what it does.
          </p>
          <div className="mt-10">
            <Screenshot
              src="/images/p3-ranking.png"
              alt="The ranked candidate list for a role, showing scores and placement reasons"
              caption="The ranked list for a role: each candidate's score, their standing, and the sentence explaining the placement."
            />
          </div>
        </section>

        {/* 2. PROBLEM */}
        <Section
          eyebrow="The problem"
          title="A number nobody can defend"
        >
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-4 text-slate-600">
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
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
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
          title="The AI quotes. The application judges."
        >
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-4 text-slate-600">
              <p>
                The split is the whole design. An AI reads the CV and pulls out
                the passages that speak to each requirement, quoting them
                directly. It is never asked whether a requirement is met, and it
                is given no way to answer that — the step it takes part in has no
                field for a verdict and no field for a number.
              </p>
              <p>
                Everything that produces a judgement happens afterwards, in
                ordinary application code: fixed rules against verified quotes,
                integer arithmetic, weights the role set in advance.
              </p>
              <p>
                So when someone asks why a candidate placed where they did, the
                answer is not a model&apos;s opinion. It is a requirement, a
                verdict, a reason, and a sentence from their own CV.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">
                What that means in practice
              </p>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                <li>Every judgement points at a passage from the CV.</li>
                <li>
                  A quote that is not in the document is discarded before it can
                  count.
                </li>
                <li>
                  The same CV against the same role produces the same result
                  every time.
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
        </Section>

        {/* 5. EVIDENCE VERIFICATION */}
        <Section
          eyebrow="Trust"
          title="A quote that isn't in the CV doesn't count"
        >
          <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6 sm:p-8">
            <p className="max-w-3xl text-base text-indigo-900">
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
                  className="rounded-md border border-indigo-200 bg-white p-4"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-3xl text-sm text-indigo-800">
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
            <div className="flex flex-col gap-4 text-slate-600">
              <p>
                Name, contact details, date of birth, nationality, gender and
                address are masked out of the copy the reader receives. They are
                not filtered afterwards and the reader is not instructed to
                ignore them — they are simply not in the text it is given.
              </p>
              <p>
                That is a stronger arrangement than an instruction, because it
                does not depend on anything complying. What was removed is
                recorded as a category and a position, never as a value, so the
                system can show a recruiter that a date of birth was taken out
                without storing the date itself.
              </p>
              <p>
                The masking keeps the document the same length, which is what
                lets a quoted passage still line up exactly with the original CV
                — the evidence stays checkable without the personal details ever
                being available.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">
                What this is, and what it is not
              </p>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
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
            <div className="flex flex-col gap-4 text-slate-600">
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
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">
                Why it is done this way
              </p>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                <li>
                  The same inputs produce the same score on any machine, every
                  time.
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
            <div className="flex flex-col gap-4 text-slate-600">
              <p>
                Opening a candidate shows the score and their standing, then
                every requirement the role asked for — including the ones the CV
                never addressed, which are listed rather than quietly omitted.
              </p>
              <p>
                Each requirement carries its verdict in plain words, the reason
                behind it, and the passage from the CV it rests on. The
                technical detail — weights, contributions, which reader produced
                the evidence — sits behind a disclosure, out of the way of
                someone making a decision but available to someone checking one.
              </p>
              <p>
                The decision is recorded there too: advance, reject or hold, each
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
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
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
                className="rounded-lg border border-slate-200 p-5"
              >
                <h3 className="text-sm font-semibold text-slate-900">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {capability.detail}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 11. SCREENSHOTS */}
        <Section eyebrow="The product" title="Seeing it work">
          <div className="grid gap-8 sm:grid-cols-2">
            <Screenshot
              src="/images/p3-candidate-explanation.png"
              alt="A candidate's assessment showing each requirement, its verdict and the quoted evidence"
              caption="A candidate opened up: every requirement, the verdict in plain words, and the passage from the CV behind it."
            />
            <Screenshot
              src="/images/p3-evidence-verification.png"
              alt="A requirement judgement alongside the verified quote it rests on"
              caption="A verdict and the quote it rests on — checked against the submitted CV before it was allowed to count."
            />
            <Screenshot
              src="/images/p3-decision-history.png"
              alt="The recorded decision and the full history of how the assessment was produced"
              caption="The recorded decision with its written reason, and the history of every step behind the assessment."
            />
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">
                Screenshots are being captured
              </p>
              <p className="mt-2 text-sm text-slate-600">
                These slots are deliberately empty rather than filled with
                mock-ups — an illustration presented as a screenshot would
                misrepresent the product. The source is public in the meantime,
                and a hosted demo is the next step.
              </p>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Read the source
              </a>
            </div>
          </div>
        </Section>

        {/* 12. TECHNOLOGY */}
        <Section eyebrow="Built with" title="Technology">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STACK.map((item) => (
              <div
                key={item.name}
                className="rounded-lg border border-slate-200 px-4 py-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">{item.role}</p>
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
                title: "No hosted demo yet",
                detail:
                  "It runs locally and is verified by its test suite. Deploying a public demo is the next piece of work on it.",
              },
              {
                title: "The reader is a deterministic stand-in",
                detail:
                  "The current build reads CVs with a fixed, offline stand-in rather than a live language model, so a walkthrough behaves identically every time. The adapter for a live model is in place; the demo does not use it.",
              },
              {
                title: "No real applicants have been screened",
                detail:
                  "Everything shown runs on an invented dataset. There are no customer outcomes to report, and none are claimed.",
              },
              {
                title: "Screenshots are placeholders",
                detail:
                  "The slots above stay empty until real captures of the running product replace them.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 15. CLOSING CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-slate-900">
              If you screen CVs and cannot explain the shortlist
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              That is the problem this was built for. If you are weighing up AI
              in your hiring process — or you have a tool whose output nobody can
              account for — it is worth a conversation.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Read the Source on GitHub
              </a>
              <a
                href="/#contact"
                className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
              >
                Start a conversation
              </a>
            </div>
            <p className="mt-6 text-xs text-slate-500">
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
