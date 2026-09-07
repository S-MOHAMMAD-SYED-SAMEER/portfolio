import { DemoShell } from "../ui/DemoShell";
import { projectById } from "../../data/projects";
import { P1_SCENARIOS } from "../data/p1";

export default function P1Demo() {
  return (
    <DemoShell
      project={projectById("p1")}
      tagline="Step through how a customer message becomes a grounded answer — and how the system notices a buyer about to leave."
      disclosure="Interactive demonstration using synthetic data. The workflow runs locally in your browser and does not connect to a real store, customer, order, payment or knowledge base. No language model is called: every stage below is a deterministic description of how the production pipeline behaves. The deployed application is linked separately."
      scenarioLabel="Choose a scenario"
      scenarios={P1_SCENARIOS}
    />
  );
}
