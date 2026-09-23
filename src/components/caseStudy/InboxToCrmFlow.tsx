/**
 * The six stages an email passes through, in the order it actually passes
 * through them. Project 1's diagram describes a single chat reply and does not
 * fit this shape at all, so this is its own component rather than the other one
 * bent out of shape.
 *
 * The approval stage is given its own treatment on purpose. It is not step five
 * of six on this page — it is the reason a business would trust the other five,
 * and a diagram that rendered it as just another box would be selling the wrong
 * product.
 */

import Callout from "./Callout";

interface Stage {
  n: string;
  name: string;
  /** What a business owner would say happened. Leads, always. */
  plain: string;
  /** The supporting detail, for a reader who wants it. Never the headline. */
  detail: string;
}

const BEFORE_APPROVAL: Stage[] = [
  {
    n: "1",
    name: "Ingest",
    plain: "The email arrives and is logged.",
    detail:
      "Every message is recorded on arrival, so nothing depends on someone remembering to deal with it later.",
  },
  {
    n: "2",
    name: "Understand",
    plain: "It works out what the sender is actually asking for.",
    detail:
      "The request, the company, the people and the details are pulled out — and every value has to quote text that is genuinely in the email. Anything it cannot point at is dropped rather than guessed.",
  },
  {
    n: "3",
    name: "Resolve",
    plain: "It finds who this is in your existing records.",
    detail:
      "The sender is matched against the CRM by address, company domain and name. A confident match goes forward; an ambiguous one goes to a person instead of picking the likeliest and hoping.",
  },
  {
    n: "4",
    name: "Decide",
    plain: "It proposes what should happen — and drafts the reply.",
    detail:
      "A fixed set of business rules produces the plan: which records to create or update, which tasks to open, whether a reply is warranted. Every rule records why it did or did not apply.",
  },
];

const AFTER_APPROVAL: Stage[] = [
  {
    n: "6",
    name: "Execute",
    plain: "The approved plan is carried out — all of it, or none of it.",
    detail:
      "The work lands in one transaction with a before-and-after record of every change. Running the same approval twice does not double anything up. An approved reply is written to the outbox and held.",
  },
];

function StageRow({ stage }: { stage: Stage }) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-tint text-meta font-semibold text-brand">
        {stage.n}
      </span>
      <div>
        <p className="text-small font-semibold text-ink">
          {stage.name} — {stage.plain}
        </p>
        <p className="mt-1 text-small text-ink-muted">{stage.detail}</p>
      </div>
    </li>
  );
}

export default function InboxToCrmFlow() {
  return (
    <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
      <ol className="flex flex-col gap-6">
        {BEFORE_APPROVAL.map((stage) => (
          <StageRow key={stage.n} stage={stage} />
        ))}
      </ol>

      {/* The gate. Deliberately the heaviest element on the page. */}
      <Callout
        badge="5"
        heading="Approve — you see exactly what it wants to do, before it does it."
      >
        <p className="mt-1 text-small text-ink-muted">
          Anything consequential stops here and waits. You get the proposed
          changes side by side with what the records say now, the drafted
          reply in full, and the choice to approve it, reject it with a
          reason, or edit the wording first.
        </p>
        <p className="mt-3 text-meta text-ink-muted">
          Nothing past this point runs on its own. Out of the box, every
          plan waits for a person.
        </p>
      </Callout>

      <ol className="flex flex-col gap-6">
        {AFTER_APPROVAL.map((stage) => (
          <StageRow key={stage.n} stage={stage} />
        ))}
      </ol>

      <p className="mt-6 border-t border-line pt-4 text-meta text-ink-muted">
        The check that a plan was approved is re-run at the moment of execution,
        against the stored record rather than the screen you clicked on. An
        approval that has expired, was never given, or no longer matches the plan
        it was given for will not run.
      </p>
    </div>
  );
}
