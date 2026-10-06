import type { Scenario, Stage } from "../ui/DemoShell";
import type { Panel, Tone } from "../ui/panels";
import { DEMO_CANDIDATES } from "../p3/dataset.gen.ts";
import { runDemo, type CandidateRun, type DemoRunResult } from "../p3/run.ts";
import { MET_COVERAGE_PERCENT, PARTIAL_COVERAGE_PERCENT } from "../p3/vendored/agent/matchRules.ts";
import type { RankedCandidate, RankTier } from "../p3/vendored/agent/rankRules.ts";
import {
  DECISION_OUTCOMES,
  VERDICT_BASIS_POINTS,
  type DecisionOutcome,
  type MatchVerdict,
  type RequirementKind,
  type SensitiveCategory,
} from "../p3/vendored/domain/ats.ts";

/**
 * The Explainable ATS walkthrough, built from the real pipeline.
 *
 * WHAT THIS FILE IS ALLOWED TO DO
 *
 * Arrange. Every requirement, quote, verdict, weight, score, contribution, tier,
 * position and audit event below is read off a `DemoRunResult`, which comes from
 * `../p3/run.ts` running the project's own source (`../p3/vendored/`) over the
 * project's own generated dataset (`../p3/dataset.gen.ts`). Nothing numeric is
 * typed here. The only text this file owns is the explanation around the values:
 * headings, captions and the words that map a code term to what the project's
 * screens say.
 *
 * It used to be the other way round: a hand-written simulation with five
 * requirements, "points" scoring and a score for Rowan, none of which the real
 * system does. `tests/atsDemoParity.test.ts` now holds this file to the real
 * system's numbers, so that cannot quietly happen again.
 *
 * Two limitations hold here and are said in the demo itself: the reader is a
 * deterministic mock rather than a live language model, and no real applicants
 * have been screened.
 */

// --- the words the project's own screens use ----------------------------------
//
// Code terms on the left, recruiter wording on the right, as `web/src/copy.ts`
// has them in the project. Words only: no value is derived from these tables.

export const VERDICT_LABEL: Record<MatchVerdict, string> = {
  met: "Met",
  partial: "Partly met",
  not_met: "Does not meet",
  unclear: "Not demonstrated",
};

export const TIER_LABEL: Record<RankTier, string> = {
  qualified: "Meets every must-have",
  needs_review: "Worth a look",
  gated: "Missing an essential",
  not_evaluated: "Not assessed yet",
};

const KIND_LABEL: Record<RequirementKind, string> = {
  must_have: "Essential",
  nice_to_have: "Desirable",
};

const OUTCOME_LABEL: Record<DecisionOutcome, string> = {
  shortlist: "Shortlist",
  reject: "Reject",
  hold: "Hold",
};

const OUTCOME_DETAIL: Record<DecisionOutcome, string> = {
  shortlist: "take this candidate forward",
  reject: "do not take this candidate forward",
  hold: "decide later, without losing the assessment",
};

const CATEGORY_LABEL: Record<SensitiveCategory, string> = {
  name: "Name",
  age: "Age or date of birth",
  gender: "Gender",
  nationality: "Nationality",
  photo: "Photo",
  address: "Address",
  marital_status: "Marital status",
  religion: "Religion",
  contact: "Email address and phone number",
  other: "Other",
};

const VERDICT_TONE: Record<MatchVerdict, Tone> = {
  met: "positive",
  partial: "brand",
  not_met: "signal",
  unclear: "plain",
};

const TIER_TONE: Record<RankTier, Tone> = {
  qualified: "positive",
  needs_review: "brand",
  gated: "signal",
  not_evaluated: "plain",
};

/** The outcome the walkthrough records, chosen from the candidate's tier. */
const OUTCOME_FOR_TIER: Record<Exclude<RankTier, "not_evaluated">, DecisionOutcome> = {
  qualified: "shortlist",
  needs_review: "hold",
  gated: "reject",
};

// --- arithmetic, shown exactly --------------------------------------------------

/**
 * `numerator ÷ denominator` to two decimal places, truncated, by integer
 * arithmetic only. Display, never fed back into a score: the scorer's own
 * contributions are what is shown as the result.
 */
function exactQuotient(numerator: number, denominator: number): string {
  const whole = Math.floor(numerator / denominator);
  const hundredths = Math.floor(((numerator % denominator) * 100) / denominator);
  return `${whole}.${String(hundredths).padStart(2, "0")}`;
}

const plural = (count: number, one: string, many: string): string => (count === 1 ? one : many);

// --- one candidate ----------------------------------------------------------------

function stagesFor(run: CandidateRun, result: DemoRunResult, entry: RankedCandidate): Stage[] {
  const { job, requirements, ranking } = result;
  const name = run.candidate.displayName ?? run.candidate.reference;
  const labelOf = new Map(requirements.map((requirement) => [requirement.id, requirement.label]));
  const totalWeight = requirements.reduce((sum, requirement) => sum + requirement.weight, 0);
  const notRun = (what: string): Panel[] => [
    {
      kind: "note",
      title: "Not run for this candidate",
      body: `${name}'s CV was received, read and masked, but the assessment is queued and has not been run, so there is no ${what} to show. Nothing is invented to fill the gap. They still appear in the ranking, unranked, rather than quietly disappearing from it.`,
    },
  ];

  const stages: Stage[] = [];

  // 1. Resume ---------------------------------------------------------------------
  stages.push({
    id: "resume",
    label: "Resume",
    heading: "The submitted CV",
    blurb: "An invented CV, as plain text. Nothing about this person is real.",
    panels: [
      {
        kind: "message",
        from: name,
        meta: `${run.resume.charCount} characters of plain text`,
        subject: `Application — ${job.title}`,
        body: run.resume.contentText,
      },
    ],
  });

  // 2. Requirements ---------------------------------------------------------------
  stages.push({
    id: "requirements",
    label: "Requirements",
    heading: "What the role actually asks for",
    blurb:
      "A person declares the requirements once, for the role: a label, what it means, essential or desirable, and a weight. They are not read out of a job advert, and every candidate is measured against the same list.",
    panels: [
      {
        kind: "list",
        title: `${job.title} — ${requirements.length} requirements`,
        caption: `Weights add up to ${totalWeight}. A missed essential changes where a candidate is placed; a desirable only adds to the score.`,
        items: requirements.map(
          (requirement) =>
            `${requirement.label} — ${requirement.criterion}. ${KIND_LABEL[requirement.kind]}, weight ${requirement.weight}.`,
        ),
      },
    ],
  });

  // 3. Redaction ------------------------------------------------------------------
  const maskedByCategory = new Map<SensitiveCategory, number>();
  for (const span of run.resume.spans) {
    maskedByCategory.set(span.category, (maskedByCategory.get(span.category) ?? 0) + 1);
  }
  stages.push({
    id: "redaction",
    label: "Redaction",
    heading: "Personal details are removed before anything reads the CV",
    blurb:
      "Not hidden afterwards — removed first. Each detail becomes a block of the same length, so positions in the masked copy match the original. The model is only ever given the masked copy.",
    panels: [
      {
        kind: "fields",
        title: "Masked before extraction",
        caption: `${run.resume.spans.length} ${plural(run.resume.spans.length, "span", "spans")} masked.`,
        rows: [...maskedByCategory.entries()].map(([category, count]) => ({
          label: CATEGORY_LABEL[category],
          value: `${count} masked`,
          tone: "brand" as const,
        })),
      },
      {
        kind: "quote",
        title: "The text the model receives",
        text: run.resume.redactedText,
        source: "The masked copy. The original stays on this side of the boundary.",
      },
      {
        kind: "note",
        title: "Why the order matters",
        body: "Redacting after a decision would leave the decision already influenced. A quote that overlaps a masked span is also refused later, even if the words are in the CV, because the model never saw them.",
      },
    ],
  });

  // 4. Evidence -------------------------------------------------------------------
  const proposed = run.extraction?.accepted ?? [];
  const proposedFor = new Set(proposed.map((finding) => finding.requirementId));
  const silent = requirements.filter((requirement) => !proposedFor.has(requirement.id));
  stages.push({
    id: "evidence",
    label: "Evidence",
    heading: "Passages proposed as evidence",
    blurb:
      "The only step a model takes. It reads the masked CV and proposes a passage for each requirement, through a forced tool call that has no field for a verdict or a score. Proposing is all it does; nothing is accepted yet.",
    panels: run.assessed
      ? [
          ...proposed.map(
            (finding): Panel => ({
              kind: "quote",
              title: `Proposed for: ${labelOf.get(finding.requirementId) ?? finding.requirementId}`,
              text: finding.quote,
              source: `Proposed by the deterministic mock extractor, at characters ${finding.charStart}–${finding.charEnd} — not yet verified`,
            }),
          ),
          ...(silent.length > 0
            ? [
                {
                  kind: "note",
                  title: "Nothing proposed for",
                  body: silent.map((requirement) => requirement.label).join(", "),
                } satisfies Panel,
              ]
            : []),
        ]
      : notRun("proposed evidence"),
  });

  // 5. Verification ---------------------------------------------------------------
  const verification = run.verification;
  const notFound = verification?.rejected.filter((item) => item.reason === "not_found_in_resume").length ?? 0;
  const overMask = verification?.rejected.filter((item) => item.reason === "quotes_redacted_text").length ?? 0;
  const rejectedTotal = notFound + overMask;
  stages.push({
    id: "verification",
    label: "Verification",
    heading: "Every quote is checked against the CV",
    blurb:
      "Each quote is looked up in the original text as submitted, word for word, ignoring only differences in whitespace. A quote that reads well but is not in the CV is rejected, which is what makes a citation worth anything.",
    panels:
      verification && run.extraction
        ? [
            {
              kind: "fields",
              title: "Verification result",
              rows: [
                { label: "Quotes proposed", value: String(proposed.length) },
                { label: "Found in the CV", value: String(verification.verified.length), tone: "positive" },
                {
                  label: "Rejected: not in the CV",
                  value: String(notFound),
                  tone: notFound > 0 ? "signal" : "positive",
                },
                {
                  label: "Rejected: overlapping a masked span",
                  value: String(overMask),
                  tone: overMask > 0 ? "signal" : "positive",
                },
                { label: "Dropped for the wrong shape", value: String(run.extraction.malformed.length) },
              ],
            },
            rejectedTotal === 0
              ? {
                  kind: "note",
                  title: "Nothing was rejected here",
                  body: "This demo's extractor copies whole lines out of the CV, so every quote it proposes is really there. The check still ran on each one. A fabricated quote is rejected and kept, marked unverified, so the fabrication stays visible and takes no part in the score. The project's tests cover that case; this dataset does not produce one.",
                }
              : {
                  kind: "note",
                  tone: "signal",
                  title: "What just happened",
                  body: "Rejected quotes are stored, marked unverified, and never shown or scored. One bad finding does not discard the good ones.",
                },
            {
              kind: "note",
              tone: "brand",
              title: "The rule",
              body: "A requirement with no verified quote cannot be marked as met, however confident the reader was.",
            },
          ]
        : notRun("verification result"),
  });

  // 6. Matching -------------------------------------------------------------------
  stages.push({
    id: "matching",
    label: "Matching",
    heading: "Requirement by requirement",
    blurb: `Plain rules, not a model. A verdict comes from how many of a requirement's significant terms the verified quotes contain: ${MET_COVERAGE_PERCENT}% or more is met, ${PARTIAL_COVERAGE_PERCENT}% or more is partly met, a relevant quote that falls short is not met, and no quote at all is not demonstrated.`,
    panels: run.assessed
      ? [
          {
            kind: "fields",
            title: "Verdicts",
            rows: run.matches.map((match) => {
              const requirement = requirements.find((item) => item.id === match.requirementId);
              return {
                label: `${requirement?.label ?? match.requirementId} (${KIND_LABEL[requirement?.kind ?? "must_have"]})`,
                value: VERDICT_LABEL[match.verdict],
                note: `Confidence: ${match.confidence}. ${match.rationale}`,
                tone: VERDICT_TONE[match.verdict],
              };
            }),
          },
          {
            kind: "note",
            tone: "brand",
            title: "Silence is not failure",
            body: "Not demonstrated means the CV says nothing about the requirement. Does not meet means the CV says something and it falls short. They are different facts about a person, and the ranking treats them differently.",
          },
        ]
      : notRun("verdicts"),
  });

  // 7. Scoring --------------------------------------------------------------------
  const score = run.score;
  let scoringPanels: Panel[];
  if (score) {
    const earned = score.rows.map((row) => row.weightApplied * VERDICT_BASIS_POINTS[row.decision.verdict]);
    const numerator = earned.reduce((sum, value) => sum + value, 0);
    const contributions = score.rows.map((row) => row.contributionBasisPoints);
    const contributionTotal = contributions.reduce((sum, value) => sum + value, 0);
    if (Math.floor(numerator / score.totalWeight) !== score.scoreBasisPoints || contributionTotal !== score.scoreBasisPoints) {
      // The page must not show arithmetic that does not add up.
      throw new Error(`The scoring explanation for ${name} does not add up to the score the pipeline produced.`);
    }

    scoringPanels = [
      {
        kind: "fields",
        title: "The formula, with this candidate's numbers",
        caption: `score = floor( Σ weight × points ÷ Σ weight ). Points are met ${VERDICT_BASIS_POINTS.met}, partly met ${VERDICT_BASIS_POINTS.partial}, does not meet ${VERDICT_BASIS_POINTS.not_met}, not demonstrated ${VERDICT_BASIS_POINTS.unclear}. A score of ${VERDICT_BASIS_POINTS.met} is the maximum.`,
        rows: [
          ...score.rows.map((row, index) => ({
            label: `${row.requirement.label} — ${VERDICT_LABEL[row.decision.verdict]}`,
            value: `${row.weightApplied} × ${VERDICT_BASIS_POINTS[row.decision.verdict]} = ${earned[index]}`,
            tone: VERDICT_TONE[row.decision.verdict],
          })),
          { label: "Σ weight × points", value: String(numerator) },
          { label: "Σ weight", value: String(score.totalWeight) },
          {
            label: "Score",
            value: `${numerator} ÷ ${score.totalWeight} = ${exactQuotient(numerator, score.totalWeight)}…, floored to ${score.scoreBasisPoints}`,
            note: `${entry.scorePercent} as shown to a recruiter`,
            tone: "positive",
          },
        ],
      },
      {
        kind: "fields",
        title: "Each requirement's share, adding up exactly",
        caption:
          "Every share is its earned points ÷ Σ weight, rounded down. Any basis points lost to rounding go back, one each, to the largest remainders, so the column always adds up to the score.",
        rows: [
          ...score.rows.map((row, index) => {
            const base = Math.floor((earned[index] as number) / score.totalWeight);
            const extra = row.contributionBasisPoints - base;
            return {
              label: row.requirement.label,
              value: String(row.contributionBasisPoints),
              note:
                `${earned[index]} ÷ ${score.totalWeight} = ${exactQuotient(earned[index] as number, score.totalWeight)}…` +
                (extra > 0 ? `, plus ${extra} leftover ${plural(extra, "point", "points")} (largest remainder)` : ""),
            };
          }),
          {
            label: "Total",
            value: `${contributions.join(" + ")} = ${contributionTotal}`,
            tone: "positive" as const,
          },
        ],
      },
      {
        kind: "note",
        title: "Must-haves are counted, not subtracted",
        body: `${name} meets ${score.mustHavesMet} of ${score.mustHavesTotal} must-haves${score.mustHavesUnclear > 0 ? `, and the CV is silent on ${score.mustHavesUnclear}` : ""}. A missed must-have never lowers the number above, because that would stop the shares adding up. It changes where the candidate is placed, which is the next step.`,
      },
    ];
  } else {
    scoringPanels = notRun("score");
  }
  stages.push({
    id: "scoring",
    label: "Scoring",
    heading: "Arithmetic a person can redo on paper",
    blurb:
      "Integers only, in basis points, with a single division at the end. The parts add up to the number at the top, and always will.",
    panels: scoringPanels,
  });

  // 8. Ranking --------------------------------------------------------------------
  stages.push({
    id: "ranking",
    label: "Ranking",
    heading: "Where this candidate is placed, and why",
    blurb:
      "Placement is by tier first and score second, and it is worked out each time the list is read. Someone who failed a must-have sits below everyone who meets them all, however high their score; someone the CV is silent about sits in between, for a person to look at.",
    panels: [
      {
        kind: "fields",
        title: "Placement",
        rows: [
          { label: "Tier", value: TIER_LABEL[entry.tier], tone: TIER_TONE[entry.tier] },
          { label: "Position", value: `${entry.position} of ${ranking.entries.length}` },
          { label: "Score", value: entry.scorePercent ?? "No score" },
          ...(entry.mustHavesTotal !== null
            ? [{ label: "Must-haves met", value: `${entry.mustHavesMet} of ${entry.mustHavesTotal}` }]
            : []),
          { label: "Reason shown to the recruiter", value: entry.rationale },
        ],
      },
      {
        kind: "list",
        title: "The whole ranking",
        caption: "Same dataset, same rules, same order as the real system.",
        items: ranking.entries.map(
          (item) =>
            `${item.position}. ${item.displayName ?? item.reference} — ${item.scorePercent ?? "no score"} — ${TIER_LABEL[item.tier]}`,
        ),
      },
      {
        kind: "note",
        title: "Still true, and worth repeating",
        body: "The reader here is a deterministic mock rather than a live language model, and no real applicants have been screened.",
      },
    ],
  });

  // 9. Decision -------------------------------------------------------------------
  const decisionPanels: Panel[] = [
    {
      kind: "list",
      title: "What the recruiter can record",
      caption: "Three outcomes, and no fourth. Nothing is decided automatically.",
      items: DECISION_OUTCOMES.map((outcome) => `${OUTCOME_LABEL[outcome]} — ${OUTCOME_DETAIL[outcome]}`),
    },
    {
      kind: "note",
      tone: "signal",
      title: "A reason is required",
      body: "The written reason is part of the decision. A decision with no reason, or one too short to mean anything, is refused. Each assessment takes one decision, and an assessment that has not been scored cannot take one at all.",
    },
  ];
  const decision: Stage = {
    id: "decision",
    label: "Decision",
    heading: "The call is a person's, and it is written down",
    blurb:
      "Everything above produces evidence and an ordering. It does not produce a decision. A recruiter does, and the system will not record one without a reason.",
    panels: decisionPanels,
  };
  if (entry.tier !== "not_evaluated") {
    const outcome = OUTCOME_FOR_TIER[entry.tier];
    decision.action = {
      label: `Record: ${outcome}`,
      doneLabel: `Recorded — ${outcome}, with the reason attached`,
      reveals: [
        {
          kind: "fields",
          title: "Decision recorded",
          caption: "One example of the three outcomes, to show what gets written down. The reason is the placement sentence above.",
          rows: [
            { label: "Outcome", value: OUTCOME_LABEL[outcome], tone: TIER_TONE[entry.tier] },
            { label: "Recorded by", value: "demo-visitor" },
            { label: "Reason", value: entry.rationale },
          ],
        },
        {
          kind: "note",
          title: "What the recruiter is accountable for",
          body: "The system produced the evidence and the ordering. The decision, and the reason for it, belong to the person who made it, which is what makes it answerable to the candidate later.",
        },
      ],
    };
  }
  stages.push(decision);

  // 10. Audit ---------------------------------------------------------------------
  stages.push({
    id: "audit",
    label: "Audit",
    heading: "Everything that happened, kept in order",
    blurb:
      "Each step above appended a record as it ran. The trail is append-only: entries are added, never edited or removed, so the account of a decision cannot be tidied up afterwards. The score event carries every input, so the number can be recomputed from the trail alone.",
    panels: [
      {
        kind: "list",
        title: "History for this assessment",
        caption: "The events the pipeline wrote for this candidate, in the order it wrote them.",
        items: run.audit.map((event) => `${event.stage} · ${event.eventType} — ${event.summary}`),
      },
      {
        kind: "note",
        tone: "brand",
        title: "A decision is one more event",
        body: "In the real system a recorded decision is appended as a final event, `decision_recorded`, with the recruiter's reason. This walkthrough shows the decision but does not write it.",
      },
    ],
  });

  return stages;
}

/** Builds the walkthrough's scenarios, one per candidate in the dataset. */
export function buildP3Scenarios(result: DemoRunResult): Scenario[] {
  return result.candidates.map((run) => {
    const entry = result.ranking.entries.find((item) => item.reference === run.candidate.reference);
    if (!entry) throw new Error(`${run.candidate.reference} is missing from the ranking.`);
    const expected = DEMO_CANDIDATES.find((item) => item.reference === run.candidate.reference)?.expected;
    return {
      id: run.candidate.reference,
      label: run.candidate.displayName ?? run.candidate.reference,
      summary: expected?.demonstrates ?? "",
      stages: stagesFor(run, result, entry),
    };
  });
}

/** Runs the real pipeline in this browser and builds the scenarios from it. */
export async function loadP3Scenarios(): Promise<Scenario[]> {
  return buildP3Scenarios(await runDemo());
}
