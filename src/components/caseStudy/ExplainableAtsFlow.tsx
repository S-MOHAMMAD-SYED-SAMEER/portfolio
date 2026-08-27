/**
 * The path a CV takes, and — the point of the whole diagram — where the model's
 * involvement ends.
 *
 * Project 1's diagram describes a single chat reply and Project 2's describes an
 * approval chain; neither fits this. What matters here is the boundary: the
 * model reads and quotes, and everything that produces a number happens after
 * it has stopped. A flat list of eight equal steps would hide exactly the thing
 * a buyer needs to see, so the handover is drawn as a line across the page.
 */

interface Stage {
  n: string;
  name: string;
  /** What a hiring manager would say happened. Leads, always. */
  plain: string;
  detail: string;
}

const WITH_MODEL: Stage[] = [
  {
    n: "1",
    name: "Redact",
    plain: "Personal details are removed before anything reads the CV.",
    detail:
      "Name, contact details, date of birth, nationality, gender and address are masked out first. The reader never receives them, so they cannot influence what it finds.",
  },
  {
    n: "2",
    name: "Extract",
    plain: "The AI finds the passages that speak to each requirement — and quotes them.",
    detail:
      "This is the only step an AI takes part in. It is asked for passages and the place they came from. It is not asked whether a requirement is met, and it is given no way to answer that question.",
  },
];

const DETERMINISTIC: Stage[] = [
  {
    n: "4",
    name: "Match",
    plain: "Each requirement is judged against the passages that survived.",
    detail:
      "Fixed rules compare what the quoted passages actually contain against what the requirement asks for, and record the reasoning alongside the verdict.",
  },
  {
    n: "5",
    name: "Score",
    plain: "The score is calculated in ordinary arithmetic.",
    detail:
      "Each requirement contributes according to the weight the role gave it. The contributions add up to exactly the total shown — a recruiter can check the column against the headline figure and it will reconcile.",
  },
  {
    n: "6",
    name: "Rank",
    plain: "Candidates are placed in order, with the reason stated.",
    detail:
      "The order is worked out fresh from the current assessments each time the list is opened, and every placement carries a sentence explaining it. Nothing is judged on a stored ranking that has since gone stale.",
  },
  {
    n: "7",
    name: "Decide",
    plain: "A person makes the call, and writes down why.",
    detail:
      "Advance, reject or hold for review — each recorded with a written reason that stays on the record. The system ranks and explains; it does not hire or reject anyone.",
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

export default function ExplainableAtsFlow() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        The AI takes part here
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
            3
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

      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Decided by the application, not the AI
      </p>
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
