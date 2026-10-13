import { DemoShell } from "../ui/DemoShell";
import { projectById } from "../../data/projects";
import { P1_SCENARIOS } from "../data/p1";

export default function P1Demo() {
  return (
    <DemoShell
      project={projectById("p1")}
      tagline="Step through what the agent does with a customer message: signal detection, a tool or retrieval, and the guardrails, using real outputs from the repository's demo provider."
      disclosure="A replay, not the live system. Each scenario is the output of the repository's credential-free demo provider and real pipeline for the question shown, captured on 2026-10-13: the real signal detector, tools, retrieval and guardrails over invented data. No language model is called here, and nothing in this page talks to a server. With a real model the wording of replies and the choice of tools would come from the model; that run has not been recorded yet."
      scenarioLabel="Choose a scenario"
      scenarios={P1_SCENARIOS}
    />
  );
}
