import { DemoShell } from "../ui/DemoShell";
import { projectById } from "../../data/projects";
import { P2_SCENARIOS } from "../data/p2";

export default function P2Demo() {
  return (
    <DemoShell
      project={projectById("p2")}
      tagline="Follow one email from arrival to CRM record — including the point where the system stops and waits for a person."
      disclosure="Interactive demonstration using synthetic data. The workflow runs locally in your browser and does not connect to a real mailbox, CRM, customer or production database. Nothing is sent. No language model is called: every stage below is a deterministic description of how the pipeline behaves. The application itself has so far run only against scripted model answers (a mock replay); a real-model run is pending."
      scenarioLabel="Choose an email"
      scenarios={P2_SCENARIOS}
    />
  );
}
