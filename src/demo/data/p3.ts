import type { Scenario } from "../ui/DemoShell";

/**
 * Synthetic candidates for the explainable screening workflow.
 *
 * Every candidate, employer and address is invented, on the reserved
 * `.invalid` top-level domain. No real applicant has been screened by this
 * system, and nothing here describes a real person.
 *
 * Two limitations from the case study hold here and are stated in the demo
 * itself rather than being quietly dropped: the reader is a deterministic
 * stand-in rather than a live language model, and no real applicants have been
 * screened. This is a description of the workflow, not the pipeline.
 */

const ROLE = "Senior Backend Engineer";

/** The same job every candidate below is measured against. */
const REQUIREMENTS = [
  "PostgreSQL — essential",
  "Node.js or TypeScript — essential",
  "Distributed systems experience — essential",
  "Kubernetes — desirable",
  "Mentoring experience — desirable",
];

export const P3_SCENARIOS: Scenario[] = [
  {
    id: "rowan",
    label: "Rowan Ashfield",
    summary: "Meets every essential requirement, with a quoted passage behind each verdict.",
    stages: [
      {
        id: "resume",
        label: "Resume",
        heading: "The submitted CV",
        blurb: "An invented CV. Nothing about this person is real.",
        panels: [
          {
            kind: "message",
            from: "Rowan Ashfield",
            meta: "rowan.ashfield@example.invalid · +44 7700 900142",
            subject: `Application — ${ROLE}`,
            body: "Seven years building payment infrastructure. Led the migration of a monolithic billing service to a set of distributed services on PostgreSQL, handling around 40,000 transactions a day.\n\nDay to day I work in TypeScript on Node, and I have run the on-call rotation for two years. I mentor two junior engineers and run our internal backend guild.",
          },
        ],
      },
      {
        id: "requirements",
        label: "Requirements",
        heading: "What the role actually asks for",
        blurb:
          "Requirements are declared once for the role, not re-interpreted per candidate. Everyone is measured against the same list.",
        panels: [
          {
            kind: "list",
            title: `${ROLE} — requirements`,
            caption: "Essentials must be met. Desirables contribute to the score but cannot block.",
            items: REQUIREMENTS,
          },
        ],
      },
      {
        id: "redaction",
        label: "Redaction",
        heading: "Personal details are removed before anything reads the CV",
        blurb:
          "Not hidden afterwards — removed first. A detail the reader never receives cannot influence what it concludes.",
        panels: [
          {
            kind: "fields",
            title: "Masked before extraction",
            rows: [
              { label: "Name", value: "Masked", tone: "brand" },
              { label: "Email address", value: "Masked", tone: "brand" },
              { label: "Phone number", value: "Masked", tone: "brand" },
              { label: "Address", value: "Masked", tone: "brand" },
            ],
          },
          {
            kind: "note",
            title: "Why the order matters",
            body: "Redacting after a decision would leave the decision already influenced. The masked spans are also refused as evidence later, so a quote cannot smuggle a protected detail back in.",
          },
        ],
      },
      {
        id: "evidence",
        label: "Evidence",
        heading: "Passages proposed as evidence",
        blurb:
          "The reader proposes a passage for each requirement. Proposing is all it does — nothing is accepted at this stage.",
        panels: [
          {
            kind: "quote",
            title: "Proposed for: PostgreSQL",
            text: "migration of a monolithic billing service to a set of distributed services on PostgreSQL",
            source: "Proposed by the deterministic reader — not yet verified",
          },
          {
            kind: "quote",
            title: "Proposed for: Node.js / TypeScript",
            text: "I work in TypeScript on Node",
            source: "Proposed by the deterministic reader — not yet verified",
          },
        ],
      },
      {
        id: "verification",
        label: "Verification",
        heading: "Every quote is checked against the CV",
        blurb:
          "Character for character. A quote that reads perfectly but does not appear in the submitted text is rejected, which is what makes a citation worth anything.",
        panels: [
          {
            kind: "fields",
            title: "Verification result",
            rows: [
              { label: "Quotes proposed", value: "5" },
              { label: "Found verbatim", value: "5", tone: "positive" },
              { label: "Rejected as fabricated", value: "0", tone: "positive" },
              { label: "Overlapping a masked span", value: "0", tone: "positive" },
            ],
          },
          {
            kind: "note",
            tone: "brand",
            title: "The rule",
            body: "A requirement with no verified quote cannot be marked as met, however confident the reader was.",
          },
        ],
      },
      {
        id: "matching",
        label: "Matching",
        heading: "Requirement by requirement",
        blurb: "Each verdict names the evidence it rests on, so a decision can be defended line by line.",
        panels: [
          {
            kind: "fields",
            title: "Verdicts",
            rows: [
              { label: "PostgreSQL", value: "Met", note: "Verified quote", tone: "positive" },
              { label: "Node.js / TypeScript", value: "Met", note: "Verified quote", tone: "positive" },
              { label: "Distributed systems", value: "Met", note: "Verified quote", tone: "positive" },
              { label: "Kubernetes", value: "Not evidenced", note: "Desirable — does not block" },
              { label: "Mentoring", value: "Met", note: "Verified quote", tone: "positive" },
            ],
          },
        ],
      },
      {
        id: "scoring",
        label: "Scoring",
        heading: "Arithmetic a person can redo on paper",
        blurb:
          "Integer points, no floating point anywhere in the scoring path. The parts add up to the number at the top, and always will.",
        panels: [
          {
            kind: "fields",
            title: "Score breakdown",
            rows: [
              { label: "Essentials met", value: "3 of 3 · 60 points", tone: "positive" },
              { label: "Desirables met", value: "1 of 2 · 10 points" },
              { label: "Total", value: "70 of 80 · 88%", tone: "positive" },
              { label: "Essential missing", value: "None", tone: "positive" },
            ],
          },
        ],
      },
      {
        id: "ranking",
        label: "Ranking",
        heading: "Where this candidate is placed, and why",
        blurb:
          "Placement is not the raw percentage. A candidate missing an essential is placed below one who meets them all, whatever the arithmetic says.",
        panels: [
          {
            kind: "fields",
            title: "Placement",
            rows: [
              { label: "Tier", value: "Meets every essential", tone: "positive" },
              { label: "Score", value: "88%" },
              { label: "Reason shown to the recruiter", value: "All essentials evidenced" },
            ],
          },
          {
            kind: "note",
            title: "Still true, and worth repeating",
            body: "The reader here is a deterministic stand-in rather than a live language model, and no real applicants have been screened. Switch candidates above to see a rejected quote and a blocked essential.",
          },
        ],
      },
      {
        id: "decision",
        label: "Decision",
        heading: "The call is a person's, and it is written down",
        blurb:
          "Everything above produces evidence and an ordering. It does not produce a decision — a recruiter does, and the system will not record one without a reason.",
        panels: [
          {
            kind: "list",
            title: "What the recruiter can record",
            caption: "Three outcomes, and no fourth. Nothing is decided automatically.",
            items: [
              "Shortlist — take this candidate forward",
              "Reject — do not take this candidate forward",
              "Hold — decide later, without losing the assessment",
            ],
          },
          {
            kind: "note",
            tone: "signal",
            title: "A reason is required",
            body: "The written reason is part of the decision, not an optional note beside it. A decision submitted without one is refused, and a reason too short to mean anything is refused as well.",
          },
        ],
        action: {
          label: "Record: shortlist",
          doneLabel: "Recorded — shortlisted, with the reason attached",
          reveals: [
            {
              kind: "fields",
              title: "Decision recorded",
              rows: [
                { label: "Outcome", value: "Shortlist", tone: "positive" },
                { label: "Recorded by", value: "operator" },
                {
                  label: "Reason",
                  value:
                    "Both essentials evidenced by passages quoted from the CV; Node.js and PostgreSQL each backed by a verified quote.",
                },
              ],
            },
            {
              kind: "note",
              title: "What the recruiter is accountable for",
              body: "The system produced the evidence and the ordering. The decision, and the reason for it, belong to the person who made it — which is what makes it answerable to the candidate later.",
            },
          ],
        },
      },
      {
        id: "audit",
        label: "Audit",
        heading: "Everything that happened, kept in order",
        blurb:
          "Each step above appended a record as it ran. The trail is append-only: entries are added, never edited or removed, so the account of a decision cannot be tidied up afterwards.",
        panels: [
          {
            kind: "list",
            title: "History for this assessment",
            caption: "Written as each step completed, in the order it completed.",
            items: [
              "CV received and stored against the candidate",
              "Personal details removed before the CV was read",
              "Passages extracted and quoted from the CV",
              "Each quote checked word for word against the document",
              "A verdict recorded per requirement: met, partial, not met, or unclear",
              "Score computed from the stored verdicts",
              "Placement computed, with the essential requirement gate applied",
              "Decision recorded: shortlist, with its written reason",
            ],
          },
          {
            kind: "note",
            tone: "brand",
            title: "Why append-only matters here",
            body: "A screening decision may have to be explained months later. If the record could be rewritten, the explanation would be worth nothing — so the trail only ever grows.",
          },
        ],
      },
    ],
  },

  {
    id: "devi",
    label: "Devi Narayanan",
    summary:
      "Scores well on paper but misses an essential — the case that shows why ranking is not the raw score.",
    stages: [
      {
        id: "resume",
        label: "Resume",
        heading: "The submitted CV",
        blurb: "Strong experience, but not all of what the role declared as essential.",
        panels: [
          {
            kind: "message",
            from: "Devi Narayanan",
            meta: "devi.narayanan@example.invalid",
            subject: `Application — ${ROLE}`,
            body: "Six years on high-throughput services in Node and TypeScript, most recently an event pipeline running across a dozen services.\n\nI have run Kubernetes in production for three years and mentor across two teams. Primary datastore throughout has been MongoDB.",
          },
        ],
      },
      {
        id: "requirements",
        label: "Requirements",
        heading: "The same list, unchanged",
        blurb: "Requirements do not move between candidates. That is what makes the comparison fair.",
        panels: [{ kind: "list", title: `${ROLE} — requirements`, items: REQUIREMENTS }],
      },
      {
        id: "redaction",
        label: "Redaction",
        heading: "Personal details removed first",
        blurb: "Identical treatment for every candidate.",
        panels: [
          {
            kind: "fields",
            title: "Masked before extraction",
            rows: [
              { label: "Name", value: "Masked", tone: "brand" },
              { label: "Email address", value: "Masked", tone: "brand" },
            ],
          },
        ],
      },
      {
        id: "evidence",
        label: "Evidence",
        heading: "Including one the CV does not support",
        blurb:
          "The reader proposed a PostgreSQL quote. This is exactly the failure the verification stage exists to catch.",
        panels: [
          {
            kind: "quote",
            title: "Proposed for: Node.js / TypeScript",
            text: "high-throughput services in Node and TypeScript",
            source: "Proposed by the deterministic reader — not yet verified",
          },
          {
            kind: "quote",
            title: "Proposed for: PostgreSQL",
            text: "primary datastore has been PostgreSQL throughout",
            source: "Proposed by the deterministic reader — not yet verified",
          },
        ],
      },
      {
        id: "verification",
        label: "Verification",
        heading: "The fabricated quote is rejected",
        blurb:
          "The CV says MongoDB. The proposed quote is plausible, well formed, and not in the submitted text — so it does not count.",
        panels: [
          {
            kind: "fields",
            title: "Verification result",
            rows: [
              { label: "Quotes proposed", value: "5" },
              { label: "Found verbatim", value: "4", tone: "positive" },
              { label: "Rejected as fabricated", value: "1", tone: "signal" },
              { label: "Rejected quote", value: "The PostgreSQL claim", tone: "signal" },
            ],
          },
          {
            kind: "note",
            tone: "signal",
            title: "What just happened",
            body: "Without this check the candidate would have been marked as meeting an essential they do not meet, and the recruiter would have had a citation to point at. One bad finding does not discard the good ones — the other four stand.",
          },
        ],
      },
      {
        id: "matching",
        label: "Matching",
        heading: "An essential goes unmet",
        blurb: "No verified quote, so no met verdict. The rule does not bend for a strong candidate.",
        panels: [
          {
            kind: "fields",
            title: "Verdicts",
            rows: [
              { label: "PostgreSQL", value: "Not met", note: "Evidence rejected", tone: "signal" },
              { label: "Node.js / TypeScript", value: "Met", tone: "positive" },
              { label: "Distributed systems", value: "Met", tone: "positive" },
              { label: "Kubernetes", value: "Met", tone: "positive" },
              { label: "Mentoring", value: "Met", tone: "positive" },
            ],
          },
        ],
      },
      {
        id: "scoring",
        label: "Scoring",
        heading: "A high score that does not tell the whole story",
        blurb: "The arithmetic is good. The arithmetic is not the decision.",
        panels: [
          {
            kind: "fields",
            title: "Score breakdown",
            rows: [
              { label: "Essentials met", value: "2 of 3 · 40 points", tone: "signal" },
              { label: "Desirables met", value: "2 of 2 · 20 points", tone: "positive" },
              { label: "Total", value: "60 of 80 · 75%" },
              { label: "Essential missing", value: "PostgreSQL", tone: "signal" },
            ],
          },
        ],
      },
      {
        id: "ranking",
        label: "Ranking",
        heading: "Placed below a lower-scoring candidate",
        blurb:
          "This is the behaviour the project exists to demonstrate: a missing essential outranks a higher percentage, and the reason sits next to the placement.",
        panels: [
          {
            kind: "fields",
            title: "Placement",
            rows: [
              { label: "Tier", value: "Does not meet an essential", tone: "signal" },
              { label: "Score", value: "75%" },
              { label: "Reason shown to the recruiter", value: "Does not meet: PostgreSQL", tone: "signal" },
            ],
          },
          {
            kind: "note",
            title: "Still true, and worth repeating",
            body: "The reader here is a deterministic stand-in rather than a live language model, and no real applicants have been screened.",
          },
        ],
      },
      {
        id: "decision",
        label: "Decision",
        heading: "The call is a person's, and it is written down",
        blurb:
          "Everything above produces evidence and an ordering. It does not produce a decision — a recruiter does, and the system will not record one without a reason.",
        panels: [
          {
            kind: "list",
            title: "What the recruiter can record",
            caption: "Three outcomes, and no fourth. Nothing is decided automatically.",
            items: [
              "Shortlist — take this candidate forward",
              "Reject — do not take this candidate forward",
              "Hold — decide later, without losing the assessment",
            ],
          },
          {
            kind: "note",
            tone: "signal",
            title: "A reason is required",
            body: "The written reason is part of the decision, not an optional note beside it. A decision submitted without one is refused, and a reason too short to mean anything is refused as well.",
          },
        ],
        action: {
          label: "Record: reject",
          doneLabel: "Recorded — rejected, with the reason attached",
          reveals: [
            {
              kind: "fields",
              title: "Decision recorded",
              rows: [
                { label: "Outcome", value: "Reject", tone: "signal" },
                { label: "Recorded by", value: "operator" },
                {
                  label: "Reason",
                  value:
                    "PostgreSQL is an essential requirement and the CV does not evidence it: the passage found describes a university project rather than production use.",
                },
              ],
            },
            {
              kind: "note",
              title: "What the recruiter is accountable for",
              body: "The system produced the evidence and the ordering. The decision, and the reason for it, belong to the person who made it — which is what makes it answerable to the candidate later.",
            },
          ],
        },
      },
      {
        id: "audit",
        label: "Audit",
        heading: "Everything that happened, kept in order",
        blurb:
          "Each step above appended a record as it ran. The trail is append-only: entries are added, never edited or removed, so the account of a decision cannot be tidied up afterwards.",
        panels: [
          {
            kind: "list",
            title: "History for this assessment",
            caption: "Written as each step completed, in the order it completed.",
            items: [
              "CV received and stored against the candidate",
              "Personal details removed before the CV was read",
              "Passages extracted and quoted from the CV",
              "Each quote checked word for word against the document",
              "A verdict recorded per requirement: met, partial, not met, or unclear",
              "Score computed from the stored verdicts",
              "Placement computed, with the essential requirement gate applied",
              "Decision recorded: reject, with its written reason",
            ],
          },
          {
            kind: "note",
            tone: "brand",
            title: "Why append-only matters here",
            body: "A screening decision may have to be explained months later. If the record could be rewritten, the explanation would be worth nothing — so the trail only ever grows.",
          },
        ],
      },
    ],
  },
];
