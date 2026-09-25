/**
 * Sales-Recovery Agent's request pipeline, from a customer message to a
 * persisted, validated reply. Presentational only — no runtime fetching, no
 * model calls, no provider logic, nothing fabricated. These are structural
 * labels; the fuller stage-by-stage explanation is written in a later
 * milestone from the verified source.
 *
 * Every stage is marked as either the model's own judgment or application
 * code that runs whether or not the model behaved — that boundary is the
 * project's central engineering story, so it is marked on every stage
 * rather than left to the surrounding prose alone.
 */

interface Stage {
  n: string;
  title: string;
  detail: string;
  kind: "model" | "application";
}

const STAGES: Stage[] = [
  {
    n: "1",
    title: "Customer message",
    detail: "POST /api/chat.",
    kind: "application",
  },
  {
    n: "2",
    title: "Conversation history",
    detail: "Prior turns for this session are loaded from SQLite.",
    kind: "application",
  },
  {
    n: "3",
    title: "Signal detection",
    detail: "Six deterministic patterns are checked against this message only.",
    kind: "application",
  },
  {
    n: "4",
    title: "Prompt assembly",
    detail: "The base system prompt plus a short directive built from any detected signal.",
    kind: "application",
  },
  {
    n: "5",
    title: "LLM reasoning",
    detail: "Gemini or Anthropic, behind one provider interface, decides what to say.",
    kind: "model",
  },
  {
    n: "6",
    title: "Tool selection",
    detail: "The model decides whether to call a tool, and which one — bounded to three round-trips.",
    kind: "model",
  },
  {
    n: "7a",
    title: "Business tools",
    detail: "getOrderStatus, checkStock, checkDiscount — deterministic mock lookups.",
    kind: "application",
  },
  {
    n: "7b",
    title: "RAG retrieval",
    detail: "searchKnowledgeBase — vector search over the store's own policy documents.",
    kind: "application",
  },
  {
    n: "8",
    title: "Draft reply",
    detail: "The model's response, informed by whatever a tool or retrieval returned.",
    kind: "model",
  },
  {
    n: "9",
    title: "Guardrail validation",
    detail: "Eight application-level policies check the draft against what actually ran this turn.",
    kind: "application",
  },
  {
    n: "10",
    title: "Final reply",
    detail: "The original reply if every policy passed, otherwise a fixed, safe fallback.",
    kind: "application",
  },
  {
    n: "11",
    title: "Persistence",
    detail: "Only the validated final reply is saved to SQLite — never the raw draft.",
    kind: "application",
  },
  {
    n: "12",
    title: "Response",
    detail: "{ reply, toolsUsed, signals } is returned to the caller.",
    kind: "application",
  },
];

function Step({ stage }: { stage: Stage }) {
  const isModel = stage.kind === "model";
  return (
    <li className="flex gap-4">
      <span
        className={
          "mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full text-meta font-semibold " +
          (isModel ? "bg-brand text-white" : "bg-brand-tint text-brand")
        }
      >
        {stage.n}
      </span>
      <div>
        <p className="text-small font-semibold text-ink">{stage.title}</p>
        <p className="mt-1 text-small text-ink-muted">{stage.detail}</p>
      </div>
    </li>
  );
}

export default function SalesRecoveryFlow() {
  return (
    <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
      <ol className="flex flex-col gap-6">
        {STAGES.map((stage) => (
          <Step key={stage.n} stage={stage} />
        ))}
      </ol>

      <div className="mt-6 border-t border-line pt-4">
        <div className="flex flex-wrap items-center gap-4 text-meta text-ink-muted">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 flex-none rounded-full bg-brand" />
            Model decision
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 flex-none rounded-full bg-brand-tint" />
            Application enforcement
          </span>
        </div>
        <p className="mt-2 text-meta text-ink-muted">
          The model decides what to say and which tool to call (filled).
          Signal detection, guardrail validation and persistence are
          application code that runs whether or not the model behaved
          (tinted) — that boundary is enforced, not requested.
        </p>
      </div>
    </div>
  );
}
