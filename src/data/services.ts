// Extension included so this module resolves under `node --test` as well as
// under Vite. Its sibling in three/data already imports this way; without it
// the relationship below cannot be tested at all, which is how it stayed
// unrendered and unverified for as long as it did.
import { projectById, type ProjectId } from "./projects.ts";

/**
 * What a client can actually buy.
 *
 * WHY THIS IS SEPARATE FROM `projects.ts`
 *
 * A project is a thing that was built; a service is a thing that can be
 * commissioned. They are close enough to be confused and different enough that
 * merging them would distort both — three of these four map onto one project
 * each, and the fourth deliberately maps onto none.
 *
 * THE RULE EVERY ENTRY FOLLOWS
 *
 * Each service names only capabilities the repository can back, and each
 * carries the figures that back it. Nothing here claims revenue, lead volume,
 * accuracy, ROI, client results or scale, because none of those is measured
 * anywhere in this codebase.
 *
 * "Website Modernization & Conversion" is deliberately absent. It is one of the
 * five positioning labels in CLAUDE.md, but no project evidences it — the only
 * front-ends built so far are this portfolio and the three products' own
 * dashboards, none of which was delivered to a client. Listing it would be the
 * one unsupported claim on the page.
 */
export type ServiceId =
  | "support-recovery"
  | "inbox-crm"
  | "recruitment"
  | "workflow-automation";

export interface Service {
  id: ServiceId;
  /** The client-facing name. Matches the positioning labels in CLAUDE.md. */
  name: string;
  /** One line: the outcome, in the client's words. */
  positioning: string;
  /** What is actually built. Specific enough to be checked against the code. */
  builds: string;
  /**
   * Verified figures, each reproducible from the repository — `npm test` in
   * the project's own folder, or a count of the rules in its source.
   */
  evidence: readonly string[];
  /** Said out loud where a service generalises rather than points at a build. */
  caveat?: string;
  cta: { label: string; href: string };
  /**
   * The project that proves this service, where one does.
   *
   * Absent for a service that generalises existing machinery rather than
   * having been shipped in its own right — which is a thing worth being
   * explicit about rather than papering over with a link.
   */
  provenBy?: ProjectId;
}

/**
 * The demo, dashboard and case-study links come from the canonical project
 * data rather than being restated, so a moved deployment moves in one file.
 */
const p1 = projectById("p1");
const p2 = projectById("p2");
const p3 = projectById("p3");

export const services: readonly Service[] = [
  {
    id: "support-recovery",
    name: "AI Customer Support & Sales Recovery",
    positioning:
      "Answer customer questions from your own policies and live data — and notice the buyer who is about to leave.",
    builds:
      "Retrieval over policy documents, tool-calling for live order/stock/discount lookups, conversation memory, deterministic buying-signal detection, and guardrails that check the reply before the customer sees it.",
    evidence: ["206 tests", "16/16 eval", "8 guardrail policies enforced in code"],
    cta: { label: "Try the interactive demo", href: p1.interactiveDemoHref ?? "#projects" },
    provenBy: "p1",
  },
  {
    id: "inbox-crm",
    name: "AI Inbox & Lead Management",
    positioning:
      "Turn the enquiries sitting in your inbox into tracked CRM records with drafted replies — nothing sent without your approval.",
    builds:
      "An 8-stage pipeline (ingest → understand → resolve → decide → policy → approve → execute → revise), CRM matching, a human approval gate, prompt-injection containment, and an append-only audit trail.",
    evidence: ["895 tests", "10/10 eval", "live read-only demo, no account needed"],
    // The one service whose proof a client can open without installing,
    // signing up or waiting for a walkthrough, so it leads to the real thing.
    cta: { label: "Open the live dashboard", href: p2.demoHref ?? "#projects" },
    provenBy: "p2",
  },
  {
    id: "recruitment",
    name: "AI Recruitment Intelligence",
    positioning: "Screening decisions you can defend to the person they were made about.",
    builds:
      "Personal details redacted before the CV is read, evidence quoted and verified word-for-word, deterministic integer scoring, an essential-requirement gate, and a recruiter decision with a required written reason on an append-only trail.",
    evidence: ["346 tests", "10-stage demo ending in Decision + Audit"],
    cta: { label: "Step through the demo", href: p3.interactiveDemoHref ?? "#projects" },
    provenBy: "p3",
  },
  {
    id: "workflow-automation",
    name: "Business Workflow Automation",
    positioning: "The connective work between systems that never quite talk to each other.",
    builds:
      "Integrations against a real adapter layer — CRM, email, outbound, and LLM providers behind one interface — with approval gates, audit trails and tests.",
    evidence: ["Proven by the Inbox-to-CRM adapter layer"],
    caveat:
      "This generalises the machinery behind the Inbox-to-CRM agent rather than describing a project of its own. The adapters, approval gate and audit trail are the same ones; the workflow they are pointed at would be yours.",
    cta: { label: "Describe the workflow you want removed", href: "#contact" },
  },
];
