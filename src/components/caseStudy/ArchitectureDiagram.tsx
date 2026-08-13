/**
 * Product-flow diagram. Every box and branch corresponds to a step that exists
 * in the shipped implementation — the order is the one the request actually
 * takes: history → signals → prompt → model reasoning → optional lookups →
 * safety check → reply → save. Nothing here is aspirational.
 */

const LOOKUPS = [
  "Store information",
  "Order status",
  "Product availability",
  "Promotions",
];

function Step({
  n,
  title,
  detail,
}: {
  n: string;
  title: string;
  detail: string;
}) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
        {n}
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-600">{detail}</p>
      </div>
    </li>
  );
}

export default function ArchitectureDiagram() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
      <ol className="flex flex-col gap-6">
        <Step
          n="1"
          title="The customer sends a message"
          detail="Earlier turns from the same conversation are loaded first, so the customer never has to repeat themselves."
        />
        <Step
          n="2"
          title="The message is read for buying signals"
          detail="Hesitation, price worry, delivery worry and similar cues are detected from the customer's own words, and shape how this one reply is written."
        />
        <Step
          n="3"
          title="The agent decides what it needs to know"
          detail="Rather than guessing, it chooses which of the four lookups below — if any — will answer the question in front of it."
        />
      </ol>

      <div className="my-6 grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 sm:grid-cols-4">
        {LOOKUPS.map((lookup) => (
          <div
            key={lookup}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-center text-xs font-medium text-slate-700"
          >
            {lookup}
          </div>
        ))}
      </div>

      <ol className="flex flex-col gap-6">
        <Step
          n="4"
          title="The answer is checked before it is sent"
          detail="A separate safety layer verifies the reply against what was actually looked up. A claim about stock, an order, a promotion or a policy that no lookup supports is replaced, not sent."
        />
        <Step
          n="5"
          title="The customer gets the reply — and sees the working"
          detail="Each answer is labelled with what the agent checked and what it noticed, so nothing about the response is a black box."
        />
      </ol>

      <p className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
        The safety check runs before the conversation is saved, so a blocked
        claim never re-enters the agent's memory of the conversation either.
      </p>
    </div>
  );
}
