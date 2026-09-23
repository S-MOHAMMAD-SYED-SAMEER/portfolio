/**
 * DocIntel's twelve-stage pipeline, in the order a document actually takes
 * through it. Presentational only — no runtime fetching, no model calls, no
 * provider logic, nothing fabricated. These are structural labels; the
 * fuller stage-by-stage explanation is written in a later milestone from
 * the verified source.
 */

interface Stage {
  n: string;
  title: string;
  detail: string;
}

const STAGES: Stage[] = [
  { n: "1", title: "Upload", detail: "A document is submitted to the system." },
  { n: "2", title: "Storage", detail: "The file is validated and stored safely." },
  {
    n: "3",
    title: "Page rendering",
    detail: "Each page is rendered to an image.",
  },
  {
    n: "4",
    title: "Document-type registry",
    detail: "The document type selects its schema and rules.",
  },
  {
    n: "5",
    title: "Vision LLM extraction",
    detail: "A vision model reads the rendered pages.",
  },
  {
    n: "6",
    title: "Schema validation",
    detail: "The model's output is checked against a strict schema.",
  },
  {
    n: "7",
    title: "Deterministic validation",
    detail: "Dates, currency and totals are checked in code.",
  },
  {
    n: "8",
    title: "Confidence scoring",
    detail: "Each field is scored from multiple signals.",
  },
  {
    n: "9",
    title: "Human review",
    detail: "Uncertain fields are queued for a person.",
  },
  {
    n: "10",
    title: "Correction / audit trail",
    detail: "A correction is recorded without discarding the original.",
  },
  {
    n: "11",
    title: "JSON/CSV export",
    detail: "The current record is exported in either format.",
  },
  {
    n: "12",
    title: "Evaluation",
    detail: "Accuracy and reliability are measured separately.",
  },
];

function Step({ stage }: { stage: Stage }) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-tint text-meta font-semibold text-brand">
        {stage.n}
      </span>
      <div>
        <p className="text-small font-semibold text-ink">{stage.title}</p>
        <p className="mt-1 text-small text-ink-muted">{stage.detail}</p>
      </div>
    </li>
  );
}

export default function DocIntelFlow() {
  return (
    <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
      <ol className="flex flex-col gap-6">
        {STAGES.map((stage) => (
          <Step key={stage.n} stage={stage} />
        ))}
      </ol>
    </div>
  );
}
