import type { ReactNode } from "react";

/**
 * A diagram of what each system actually does, drawn in the site's own palette.
 *
 * THESE ARE NOT SCREENSHOTS AND MUST NEVER BE MISTAKEN FOR THEM.
 *
 * Every card used to look different because Project 1 had an illustration and
 * the other two had nothing, which read as "one real project and two write-ups".
 * The fix is not a mock-up of a dashboard — an illustration dressed as a
 * product shot misrepresents the product, and the case studies keep genuinely
 * empty slots for real captures. It is a flow: each step below corresponds to a
 * stage that exists in the shipped system, so the card carries information
 * rather than decoration.
 *
 * Each is `aria-hidden` with the same sequence stated in text beneath it, so a
 * screen reader gets the steps once as prose rather than as a pile of
 * disconnected labels.
 */

export type SnapshotVariant = "sales-recovery" | "inbox-crm" | "explainable-ats";

type Step = {
  label: string;
  /** The one step that carries the system's strongest guarantee. */
  emphasis?: boolean;
};

const FLOWS: Record<SnapshotVariant, { steps: Step[]; caption: string }> = {
  "sales-recovery": {
    steps: [
      { label: "Customer question" },
      { label: "Grounded answer", emphasis: true },
      { label: "Buying signal" },
      { label: "Recovery" },
    ],
    caption:
      "A customer question is answered from the store's own documents, the reply is checked before it is sent, and a hesitant buyer is recognised from their own words.",
  },
  "inbox-crm": {
    steps: [
      { label: "Incoming email" },
      { label: "AI decision" },
      { label: "Draft" },
      { label: "Human approval", emphasis: true },
      { label: "CRM" },
    ],
    caption:
      "An email is read, matched to your records and turned into a proposed plan with a drafted reply — which waits for a person before anything is applied or sent.",
  },
  "explainable-ats": {
    steps: [
      { label: "CV" },
      { label: "Evidence" },
      { label: "Verification", emphasis: true },
      { label: "Score" },
      { label: "Ranking" },
    ],
    caption:
      "Passages are quoted from the CV and checked against it before they count; the score and the ranking are then worked out in ordinary arithmetic, not by the model.",
  },
};

function Arrow() {
  return (
    <span aria-hidden="true" className="text-line-strong">
      →
    </span>
  );
}

/**
 * One step. The emphasised step is filled rather than outlined, because on
 * these three systems the step that matters most is the one a buyer is least
 * likely to expect: the safety check, the approval gate, the verification.
 */
function Node({ step }: { step: Step }) {
  return (
    <span
      className={`inline-flex items-center rounded-control border px-2.5 py-1 text-meta ${
        step.emphasis
          ? "border-brand bg-brand-tint font-semibold text-brand"
          : "border-line bg-surface text-ink-muted"
      }`}
    >
      {step.label}
    </span>
  );
}

export default function ProjectSystemSnapshot({
  variant,
}: {
  variant: SnapshotVariant;
}): ReactNode {
  const flow = FLOWS[variant];

  return (
    <div className="rounded-control border border-line bg-canvas p-4">
      <p className="text-eyebrow uppercase tracking-wide text-ink-muted">
        How it works
      </p>

      {/* Wraps rather than scrolls: a horizontal scroller inside a card is a
          trap on a phone, and these are short enough to reflow onto two or
          three lines at 320px. */}
      <div
        aria-hidden="true"
        className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2"
      >
        {flow.steps.map((step, index) => (
          <span key={step.label} className="flex items-center gap-x-2">
            {index > 0 && <Arrow />}
            <Node step={step} />
          </span>
        ))}
      </div>

      {/* The same information as prose. This is what a screen reader reads, and
          it is also the honest label: a diagram of the system, not a picture
          of the product. */}
      <p className="mt-3 text-meta text-ink-muted">{flow.caption}</p>
    </div>
  );
}
