/**
 * Verified engineering results. Every figure is reproducible from the
 * repository — `npm test` and the project's own evaluation command.
 * They describe the test and evaluation suites, deliberately not customer
 * outcomes: these are working prototypes on fictional data, and neither has
 * handled a real customer. The caption says so plainly.
 *
 * Parameterised so a second case study can state its own figures without a
 * second copy of this component. The defaults are Project 1's, so that page
 * renders exactly as before with no change at its call site.
 */

export interface Result {
  figure: string;
  label: string;
  detail: string;
}

const SALES_RECOVERY_RESULTS: Result[] = [
  {
    figure: "206",
    label: "Automated tests passing",
    detail: "Covering retrieval, lookups, memory, signals and the safety layer.",
  },
  {
    figure: "16 / 16",
    label: "Evaluation cases passing",
    detail: "A fixed scenario set the whole agent is graded against, end to end.",
  },
  {
    figure: "100%",
    label: "Evaluation pass rate",
    detail: "Graded by exact comparison, not by asking a model to mark its own work.",
  },
  {
    figure: "0%",
    label: "Hallucination rate",
    detail: "No answer in the evaluation stated something it had not actually looked up.",
  },
];

const SALES_RECOVERY_CAPTION =
  "These are engineering results from this project's own test and evaluation suites, measured on a fixed scenario set with fictional store data. They are not customer results — the agent has not yet been run against a live store — and a fixed scenario set is a rigorous smoke test, not proof of accuracy across everything real customers might ask.";

export default function ResultsPanel({
  results = SALES_RECOVERY_RESULTS,
  caption = SALES_RECOVERY_CAPTION,
}: {
  results?: Result[];
  caption?: string;
} = {}) {
  return (
    <div>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((result) => (
          <div
            key={result.label}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <dt className="text-3xl font-bold tracking-tight text-slate-900">
              {result.figure}
            </dt>
            <dd className="mt-2 text-sm font-semibold text-slate-800">
              {result.label}
            </dd>
            <dd className="mt-1 text-xs leading-relaxed text-slate-500">
              {result.detail}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">{caption}</p>
    </div>
  );
}
