/**
 * The path a CV takes, and — the point of the whole diagram — where the model's
 * involvement begins and ends.
 *
 * Project 1's diagram describes a single chat reply and Project 2's describes an
 * approval chain; neither fits this. What matters here is the boundary: the
 * model reads and quotes, and everything that produces a number happens after
 * it has stopped. A flat list of nine equal steps would hide exactly the thing
 * a buyer needs to see, so the handover is drawn as a line across the page.
 *
 * WHY THERE ARE THREE GROUPS AND NOT TWO
 *
 * The earlier version had two: "the AI takes part here", holding Redact and
 * Extract, and everything after Verify. But `redact.ts` calls no model — only
 * `extract.ts` does. Grouping redaction under the AI heading credited the model
 * with a step it has no part in, which is the exact failure this page exists to
 * argue against, and the Extract row had to correct the heading above it in its
 * own copy. Splitting the preparation out leaves one step under the AI heading,
 * which is the true number.
 *
 * The stages are numbered 1..9 in one sequence across all three groups, so the
 * numbering describes the pipeline rather than the layout.
 */

interface Stage {
  n: string;
  name: string;
  /** What a hiring manager would say happened. Leads, always. */
  plain: string;
  detail: string;
}

/**
 * Before the model is involved at all.
 *
 * Requirements are authored when the role is created — `ingest.ts` makes no
 * model call. Calling this "requirement extraction" would credit the AI with
 * reading the job spec, which nothing in the repository does.
 */
const BEFORE_MODEL: Stage[] = [
  {
    n: "1",
    name: "Job & requirements",
    plain: "The role is written down first, as a list of requirements with weights.",
    detail:
      "A person defines what the role needs and how much each requirement counts, and marks the ones that are essential. Nothing is inferred from a job advert — the criteria exist before any CV is read, so the bar cannot move to fit a candidate.",
  },
  {
    n: "2",
    name: "Redact",
    plain: "Personal details are removed before anything reads the CV.",
    detail:
      "Name, contact details, date of birth, nationality, gender and address are masked out first. This is ordinary pattern-matching, not a model. The reader never receives them, so they cannot influence what it finds.",
  },
];

const WITH_MODEL: Stage[] = [
  {
    n: "3",
    name: "Extract",
    plain: "The AI finds the passages that speak to each requirement — and quotes them.",
    detail:
      "This is the only step an AI takes part in. It is asked for passages and the place they came from. It is not asked whether a requirement is met, and it is given no way to answer that question.",
  },
];

const DETERMINISTIC: Stage[] = [
  {
    n: "5",
    name: "Match",
    plain: "Each requirement is judged against the passages that survived.",
    detail:
      "Fixed rules compare what the quoted passages actually contain against what the requirement asks for, and record the reasoning alongside the verdict.",
  },
  {
    n: "6",
    name: "Score",
    plain: "The score is calculated in ordinary arithmetic.",
    detail:
      "Each requirement contributes according to the weight the role gave it. The contributions add up to exactly the total shown — a recruiter can check the column against the headline figure and it will reconcile.",
  },
  {
    n: "7",
    name: "Rank",
    plain: "Candidates are placed in order, with the reason stated.",
    detail:
      "The order is worked out fresh from the current assessments each time the list is opened, and every placement carries a sentence explaining it. Nothing is judged on a stored ranking that has since gone stale.",
  },
  {
    n: "8",
    name: "Decide",
    plain: "A person makes the call, and writes down why.",
    detail:
      "Advance, reject or hold for review — each recorded with a written reason that stays on the record. The system ranks and explains; it does not hire or reject anyone.",
  },
  {
    n: "9",
    name: "Audit",
    plain: "Every step that produced the outcome is kept, in order.",
    detail:
      "Redaction, extraction, verification, scoring and the recruiter's decision are all written to an append-only trail, numbered in sequence. Nothing on it is edited or removed — a decision questioned months later can be reconstructed from the record rather than remembered.",
  },
];

function StageRow({ stage }: { stage: Stage }) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
        {stage.n}
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {stage.name} — {stage.plain}
        </p>
        <p className="mt-1 text-sm text-slate-600">{stage.detail}</p>
      </div>
    </li>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
      {children}
    </p>
  );
}

export default function ExplainableAtsFlow() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
      {/* The principle, stated once, before the nine steps that implement it.
          Deliberately three short sentences in the page's existing card
          language rather than a new visual device. */}
      <div className="mb-8 rounded-md border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
          The principle
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-900">
          AI extracts evidence. Deterministic code turns that evidence into
          reproducible scores and rankings. A person makes the final decision.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Input → processing → evidence → decision → audit. The model takes part
          in one of the nine steps below, and it is the step that quotes the CV
          rather than the step that judges it.
        </p>
      </div>

      <GroupLabel>Before the model sees anything</GroupLabel>
      <ol className="mt-4 flex flex-col gap-6">
        {BEFORE_MODEL.map((stage) => (
          <StageRow key={stage.n} stage={stage} />
        ))}
      </ol>

      <p className="mt-8 text-xs font-medium uppercase tracking-wide text-slate-600">
        The one step the AI takes part in
      </p>
      <ol className="mt-4 flex flex-col gap-6">
        {WITH_MODEL.map((stage) => (
          <StageRow key={stage.n} stage={stage} />
        ))}
      </ol>

      {/* The boundary. The single most important idea on the page. */}
      <div className="my-6 rounded-md border-2 border-indigo-200 bg-indigo-50 p-5">
        <div className="flex gap-4">
          <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
            4
          </span>
          <div>
            <p className="text-sm font-semibold text-indigo-900">
              Verify — every quote is checked against the real CV before it can
              count.
            </p>
            <p className="mt-1 text-sm text-indigo-800">
              A passage that cannot be found in the document, word for word, is
              rejected. It takes no part in the score and is never shown to a
              recruiter as evidence. A quote drawn from a masked personal detail
              is refused for the same reason.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              The AI&apos;s involvement ends here — everything below is arithmetic
            </p>
          </div>
        </div>
      </div>

      <GroupLabel>Decided by the application, not the AI</GroupLabel>
      <ol className="mt-4 flex flex-col gap-6">
        {DETERMINISTIC.map((stage) => (
          <StageRow key={stage.n} stage={stage} />
        ))}
      </ol>

      <p className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
        Because the judging is ordinary arithmetic over verified quotes, the same
        CV against the same role produces the same result every time — and the
        working can be reproduced by hand from what is on screen.
      </p>
    </div>
  );
}
