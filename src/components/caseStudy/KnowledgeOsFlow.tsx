/**
 * KnowledgeOS's nine-stage pipeline, in the order a document and a query
 * actually take through it. Presentational only — no runtime fetching, no
 * model calls, nothing fabricated. These are structural labels; the fuller
 * stage-by-stage explanation is written in P4B from the verified source.
 */

interface Stage {
  n: string;
  title: string;
  detail: string;
}

const STAGES: Stage[] = [
  { n: "1", title: "Ingest", detail: "A document is added to the system." },
  { n: "2", title: "Parse", detail: "The document is parsed into text." },
  {
    n: "3",
    title: "Chunk",
    detail: "Text is split into fixed-size, paragraph-aware chunks.",
  },
  {
    n: "4",
    title: "Index",
    detail: "Chunks are indexed for lexical and vector search.",
  },
  {
    n: "5",
    title: "Retrieve",
    detail: "Hybrid lexical and vector search finds candidate chunks.",
  },
  {
    n: "6",
    title: "Rerank",
    detail: "A local cross-encoder reorders the candidates.",
  },
  {
    n: "7",
    title: "Generate",
    detail: "An answer is drafted from the retrieved evidence.",
  },
  {
    n: "8",
    title: "Cite",
    detail: "Every citation is checked against the evidence before the answer is shown.",
  },
  {
    n: "9",
    title: "Evaluate",
    detail: "Retrieval and answer quality are measured by separate harnesses.",
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

export default function KnowledgeOsFlow() {
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
