import { useCallback, useMemo, useState } from "react";
import type { Project } from "../../data/projects";
import type { Panel } from "./panels";
import { PanelView } from "./panels";
import Footer from "../../components/Footer";
import SkipLink from "../../components/SkipLink";
import ThemeToggle from "../../components/ThemeToggle";

/**
 * The frame every interactive demo shares.
 *
 * WHAT THIS IS, AND WHAT IT IS CAREFUL NOT TO CLAIM
 *
 * A portfolio simulation. It runs entirely in the visitor's browser on
 * invented data, with no network call, no model, no account and no backend of
 * any kind. That is stated once, prominently and without being asked, because
 * a demonstration a client mistakes for the production system is worse than no
 * demonstration at all — the production deployments are linked separately and
 * described as what they are.
 *
 * WHY THE STAGES ARE NUMBERED
 *
 * Because the sequence is real: each stage consumes what the one before it
 * produced, and that dependency is most of what a client needs to see. Every
 * stage is reachable at any time — nothing is gated, because there is no work
 * to wait for. All of it was computed before the page rendered.
 */

export type Stage = {
  id: string;
  /** Short label for the rail. */
  label: string;
  /** The question this stage answers, in the client's language. */
  heading: string;
  blurb: string;
  panels: Panel[];
  /**
   * A decision the visitor makes, when the real system would ask a person.
   *
   * Used only where the production system genuinely stops for a human:
   * Project 2's approval gate, and Project 3's recruiter decision. Inventing
   * an interaction the real workflow does not have would misrepresent it.
   */
  action?: {
    label: string;
    /** Shown in place of the button once pressed. */
    doneLabel: string;
    /** Panels that only exist because the visitor approved. */
    reveals: Panel[];
  };
};

export type Scenario = {
  id: string;
  label: string;
  /** One line naming what this scenario is for. */
  summary: string;
  stages: Stage[];
};

export function DemoShell({
  project,
  tagline,
  disclosure,
  scenarioLabel,
  scenarios,
}: {
  /**
   * The project this demo belongs to, from the canonical project data.
   *
   * Previously this was the title as a bare string, and the three links beside
   * it were three more strings passed in from the demo page — which meant every
   * demo page restated the case-study path, the production URL and the
   * repository that `projects.ts` already held. Taking the project itself makes
   * those links derived rather than repeated, and there is now exactly one
   * place where a moved deployment has to be edited.
   *
   * What is NOT taken from here is the demo's own content: the scenarios, the
   * tagline and the disclosure below stay with the demo, because they describe
   * this simulation rather than the project it simulates.
   */
  project: Project;
  tagline: string;
  disclosure: string;
  /** What a scenario is called here — "Scenario", "Email", "Candidate". */
  scenarioLabel: string;
  scenarios: Scenario[];
}) {
  const [scenarioId, setScenarioId] = useState(scenarios[0]!.id);
  const [stageIndex, setStageIndex] = useState(0);
  const [approved, setApproved] = useState(false);

  const scenario = useMemo(
    () => scenarios.find((s) => s.id === scenarioId) ?? scenarios[0]!,
    [scenarioId, scenarios],
  );
  const stage = scenario.stages[stageIndex] ?? scenario.stages[0]!;

  // Switching scenario resets position and any decision taken: the approval
  // belonged to the email that is no longer on screen.
  const selectScenario = useCallback((id: string) => {
    setScenarioId(id);
    setStageIndex(0);
    setApproved(false);
  }, []);

  const restart = useCallback(() => {
    setStageIndex(0);
    setApproved(false);
  }, []);

  const atStart = stageIndex === 0;
  const atEnd = stageIndex === scenario.stages.length - 1;

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur">
        {/* Ahead of the back-link, the theme toggle and the Contact button, so
            a keyboard visitor reaches the walkthrough itself in one press. */}
        <SkipLink />
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <a href="/#projects" className="whitespace-nowrap text-small font-semibold text-ink">
            ← Back to projects
          </a>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/#contact"
              className="inline-flex h-control items-center rounded-control bg-brand px-4 text-small font-semibold text-white hover:bg-brand/90"
            >
              Contact
            </a>
          </div>
        </nav>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-6 pb-20 pt-12 sm:pt-16">
        <p className="text-eyebrow uppercase text-brand">Interactive demo</p>
        <h1 className="mt-3 max-w-3xl text-display-sm text-balance text-ink">{project.title}</h1>
        <p className="mt-5 max-w-2xl text-body text-ink-muted">{tagline}</p>

        {/* The disclosure. Persistent, not dismissible, and above the demo
            rather than beneath it — a disclaimer a visitor reaches after
            forming an impression has been made too late. */}
        <aside
          aria-labelledby="demo-mode"
          className="mt-8 rounded-card border border-line bg-surface p-5 shadow-resting sm:p-6"
        >
          <h2 id="demo-mode" className="text-eyebrow uppercase text-signal">
            Demo mode
          </h2>
          <p className="mt-3 max-w-3xl text-small leading-relaxed text-ink-muted">{disclosure}</p>
        </aside>

        {/* Scenario picker */}
        <div className="mt-10">
          <p className="text-eyebrow uppercase text-ink-muted">{scenarioLabel}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {scenarios.map((option) => {
              const active = option.id === scenario.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectScenario(option.id)}
                  aria-pressed={active}
                  className={`rounded-control border px-4 py-2 text-small font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    active
                      ? "border-brand bg-brand text-white"
                      : "border-line-strong bg-surface text-ink hover:border-ink-muted"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-small text-ink-muted">{scenario.summary}</p>
        </div>

        {/* Stage rail. Scrolls sideways on a narrow screen rather than wrapping
            into a block that pushes the content off the first view. */}
        <nav aria-label="Workflow stages" className="mt-10 overflow-x-auto">
          <ol className="flex min-w-max gap-2 pb-2">
            {scenario.stages.map((item, index) => {
              const active = index === stageIndex;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setStageIndex(index)}
                    aria-current={active ? "step" : undefined}
                    className={`flex items-center gap-2 rounded-control border px-3 py-2 text-meta font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                      active
                        ? "border-brand bg-brand-tint text-brand"
                        : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    <span className="tabular-nums opacity-70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* The stage itself */}
        <section className="mt-8">
          <h2 className="text-section text-balance text-ink">{stage.heading}</h2>
          <p className="mt-3 max-w-2xl text-body text-ink-muted">{stage.blurb}</p>

          <div className="mt-6 grid gap-5">
            {stage.panels.map((panel, index) => (
              <PanelView key={`${stage.id}-${index}`} panel={panel} />
            ))}

            {stage.action && !approved && (
              <div className="rounded-card border border-signal/25 bg-signal-tint p-5 sm:p-6">
                <p className="text-small font-semibold text-signal">Waiting for a person</p>
                <p className="mt-2 text-small leading-relaxed text-ink-muted">
                  Nothing below this point happens until someone approves it. That is the
                  product&rsquo;s central rule, so the demo stops here too.
                </p>
                <button
                  type="button"
                  onClick={() => setApproved(true)}
                  className="mt-4 inline-flex h-control-lg items-center rounded-control bg-brand px-6 text-small font-semibold text-white shadow-resting hover:bg-brand/90"
                >
                  {stage.action.label}
                </button>
              </div>
            )}

            {stage.action && approved && (
              <>
                <div className="rounded-card border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
                  <p className="text-small font-semibold text-emerald-700">
                    {stage.action.doneLabel}
                  </p>
                </div>
                {stage.action.reveals.map((panel, index) => (
                  <PanelView key={`${stage.id}-approved-${index}`} panel={panel} />
                ))}
              </>
            )}
          </div>
        </section>

        {/* Stage navigation */}
        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <button
            type="button"
            onClick={() => setStageIndex((i) => Math.max(0, i - 1))}
            disabled={atStart}
            className="inline-flex h-control items-center rounded-control border border-line-strong px-4 text-small font-semibold text-ink hover:border-ink-muted disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setStageIndex((i) => Math.min(scenario.stages.length - 1, i + 1))}
            disabled={atEnd}
            className="inline-flex h-control items-center rounded-control bg-brand px-5 text-small font-semibold text-white hover:bg-brand/90 disabled:opacity-40"
          >
            Next stage
          </button>
          <button
            type="button"
            onClick={restart}
            className="inline-flex h-control items-center px-1 text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Restart
          </button>
          <p className="ml-auto text-meta tabular-nums text-ink-muted">
            Stage {stageIndex + 1} of {scenario.stages.length}
          </p>
        </div>

        {/* Where a convinced visitor goes next. */}
        <section className="mt-16 rounded-card border border-line bg-surface p-8 shadow-resting sm:p-10">
          <h2 className="text-section text-balance text-ink">
            This is the workflow, not the product
          </h2>
          <p className="mt-3 max-w-2xl text-body text-ink-muted">
            What you just stepped through is a simulation of how the system works. The case
            study explains how it is built, and the deployed application is linked separately.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* Each link is rendered only if the project actually has one, so
                a project with no deployment shows no button rather than one
                pointing nowhere. All three currently have all three. */}
            {project.caseStudyHref && (
              <a
                href={project.caseStudyHref}
                className="inline-flex h-control-lg items-center rounded-control bg-brand px-6 text-small font-semibold text-white shadow-resting hover:bg-brand/90"
              >
                View case study
              </a>
            )}
            {project.demoHref && (
              <a
                href={project.demoHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-control-lg items-center rounded-control border border-line-strong px-6 text-small font-semibold text-ink hover:border-ink-muted"
              >
                Open the deployed application
              </a>
            )}
            {project.repoHref && (
              <a
                href={project.repoHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-control-lg items-center px-1 text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              >
                GitHub
              </a>
            )}
            <a
              href="/#contact"
              className="inline-flex h-control-lg items-center px-1 text-small font-semibold text-ink underline-offset-4 hover:underline"
            >
              Discuss a similar workflow
            </a>
          </div>
          {/* The deployment's disclosure comes from the project data, so this
              page and the homepage card say the same thing. The sentence after
              it is this component's own: it is the only surface where the
              in-browser demo exists, so it is the only one that can truthfully
              say the demo needs nothing. */}
          <p className="mt-5 text-meta text-ink-muted">
            {project.demoNote && <>{project.demoNote} </>}
            The interactive demo above needs no account and no waiting — it runs
            entirely in this browser.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
