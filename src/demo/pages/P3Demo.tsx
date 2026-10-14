import { useEffect, useState } from "react";
import { DemoShell, type Scenario } from "../ui/DemoShell";
import { projectById } from "../../data/projects";
import { loadP3Scenarios } from "../data/p3";

/**
 * The walkthrough is built from the project's real pipeline, which runs in the
 * visitor's browser when the page opens. The run is async because the pipeline's
 * model boundary is, so the shell is given its scenarios once it has finished.
 * It takes a few milliseconds: there is no network call and no model.
 */
export default function P3Demo() {
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let current = true;
    loadP3Scenarios().then(
      (loaded) => {
        if (current) setScenarios(loaded);
      },
      () => {
        if (current) setFailed(true);
      },
    );
    return () => {
      current = false;
    };
  }, []);

  if (!scenarios) {
    return (
      <main id="main" className="mx-auto max-w-5xl px-6 py-20 text-body text-ink-muted">
        {failed ? "The walkthrough could not be built in this browser." : "Running the screening pipeline…"}
      </main>
    );
  }

  return (
    <DemoShell
      project={projectById("p3")}
      tagline="Watch candidates screened against a role by the real pipeline: the passage from their CV behind every verdict, the arithmetic behind every score, and why one candidate is placed below another who scored the same."
      disclosure="Interactive demonstration using synthetic data. The project's own screening code runs in your browser over five invented candidates; it does not connect to real applicants, CVs or a database. No real applicants have been screened. The reader is a deterministic mock rather than a live language model, so a walkthrough behaves identically every time."
      scenarioLabel="Choose a candidate"
      scenarios={scenarios}
    />
  );
}
