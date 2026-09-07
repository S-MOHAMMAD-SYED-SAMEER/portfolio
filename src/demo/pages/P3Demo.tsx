import { DemoShell } from "../ui/DemoShell";
import { projectById } from "../../data/projects";
import { P3_SCENARIOS } from "../data/p3";

export default function P3Demo() {
  return (
    <DemoShell
      project={projectById("p3")}
      tagline="Watch a candidate scored against a role, with the passage from their CV behind every verdict — and a fabricated quote caught and rejected."
      disclosure="Interactive demonstration using synthetic data. The workflow runs locally in your browser and does not connect to real applicants, CVs or a production database. No real applicants have been screened. The reader is a deterministic stand-in rather than a live language model, so a walkthrough behaves identically every time. The deployed application is linked separately."
      scenarioLabel="Choose a candidate"
      scenarios={P3_SCENARIOS}
    />
  );
}
