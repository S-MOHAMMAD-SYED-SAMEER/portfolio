import type { Scenario } from "../ui/DemoShell";

/**
 * Synthetic scenarios for the support and sales-recovery workflow.
 *
 * Every customer, order, product and policy below is invented. Email addresses
 * use the `.invalid` top-level domain, which is reserved and can never be
 * registered, so nothing here can point at a real person or business.
 *
 * The figures are what a fixture says, not a measurement of anything. The
 * stages mirror the shape of the real pipeline — understand, retrieve, ground,
 * detect, act — but this file is a description of that shape, not the pipeline
 * itself. The deployed application is linked separately.
 */

const STORE = "Northlight Supply";

/** Reused wherever a stage needs to say where an answer came from. */
const SOURCE_NOTE =
  "Answers are assembled only from the store's own retrieved text. Nothing is written from general knowledge.";

export const P1_SCENARIOS: Scenario[] = [
  {
    id: "availability",
    label: "Product availability",
    summary:
      "A shopper asks whether something is in stock before committing to the order.",
    stages: [
      {
        id: "message",
        label: "Message",
        heading: "A customer asks a question the store can answer",
        blurb:
          "The starting point is an ordinary message. Nothing about it is structured, and the customer has no idea what the system needs.",
        panels: [
          {
            kind: "message",
            from: "Priya N.",
            meta: "Live chat · 14:02",
            body: "Hi — is the Harbour canvas tote back in stock in navy? I need it before the weekend.",
          },
        ],
      },
      {
        id: "understanding",
        label: "Understanding",
        heading: "What is actually being asked",
        blurb:
          "Two things have to be separated: the question itself, and the information required before it can be answered honestly.",
        panels: [
          {
            kind: "fields",
            title: "Read from the message",
            rows: [
              { label: "Intent", value: "Stock availability", tone: "brand" },
              { label: "Product", value: "Harbour canvas tote" },
              { label: "Variant", value: "Navy" },
              { label: "Deadline mentioned", value: "Before the weekend", tone: "signal" },
            ],
          },
          {
            kind: "note",
            title: "Needs a live lookup",
            body: "Stock is not something a policy document can answer. The request is routed to a tool rather than to retrieval.",
          },
        ],
      },
      {
        id: "signal",
        label: "Signal",
        heading: "Is there anything beyond the question?",
        blurb:
          "The system looks for hesitation or buying intent separately from the answer, because the two call for different actions.",
        panels: [
          {
            kind: "fields",
            title: "Signals",
            rows: [
              { label: "Hesitation", value: "None detected" },
              { label: "Urgency", value: "Deadline stated", tone: "signal" },
              { label: "Recovery action needed", value: "No" },
            ],
          },
          {
            kind: "note",
            title: "Why nothing fires here",
            body: "The customer is ready to buy and only needs a fact. Adding a discount to a question that was already answered would be noise.",
          },
        ],
      },
      {
        id: "lookup",
        label: "Lookup",
        heading: "The system checks before it speaks",
        blurb:
          "A stock question gets a stock answer from the catalogue, not a guess assembled from wording.",
        panels: [
          {
            kind: "fields",
            title: "Catalogue lookup (synthetic)",
            caption: "Fixture data standing in for the store's product feed.",
            rows: [
              { label: "SKU", value: "NL-TOTE-NAV" },
              { label: "In stock", value: "12 units", tone: "positive" },
              { label: "Dispatch", value: "Same day before 15:00" },
              { label: "Delivery estimate", value: "2 working days" },
            ],
          },
        ],
      },
      {
        id: "grounded",
        label: "Grounded answer",
        heading: "The answer carries its source",
        blurb:
          "Every claim in the reply traces back to something retrieved. That is what makes it checkable rather than plausible.",
        panels: [
          {
            kind: "quote",
            title: "Retrieved passage",
            text: "Orders placed before 15:00 on a working day are dispatched the same day. Standard delivery arrives within two working days.",
            source: "Store shipping policy · synthetic fixture",
          },
          { kind: "note", tone: "brand", title: "Grounding rule", body: SOURCE_NOTE },
        ],
      },
      {
        id: "action",
        label: "Action",
        heading: "What the system decides to do",
        blurb: "One decision, with the reason recorded beside it.",
        panels: [
          {
            kind: "list",
            title: "Chosen actions",
            items: [
              "Answer the stock question with the retrieved figure",
              "State the dispatch cut-off, because a deadline was mentioned",
              "No discount, no escalation, no follow-up task",
            ],
          },
        ],
      },
      {
        id: "reply",
        label: "Reply",
        heading: "What the customer sees",
        blurb: "The finished reply — every fact in it came from a stage above.",
        panels: [
          {
            kind: "message",
            from: `${STORE} support`,
            meta: "Sent 14:02",
            body: "Yes — the Harbour canvas tote in navy is in stock, with 12 available.\n\nIf you order before 15:00 today it ships the same day, and standard delivery is two working days, so it will reach you before the weekend.",
          },
        ],
      },
    ],
  },

  {
    id: "order",
    label: "Order status",
    summary: "An existing customer wants to know where their parcel is.",
    stages: [
      {
        id: "message",
        label: "Message",
        heading: "A question about something already bought",
        blurb: "This one cannot be answered from documents at all — it needs the order record.",
        panels: [
          {
            kind: "message",
            from: "Tom R.",
            meta: "Live chat · 09:41",
            body: "Order NL-4471 — it still says processing. Has it shipped yet?",
          },
        ],
      },
      {
        id: "understanding",
        label: "Understanding",
        heading: "An identifier changes what is possible",
        blurb: "The customer supplied an order number, so the system can look it up rather than ask.",
        panels: [
          {
            kind: "fields",
            title: "Read from the message",
            rows: [
              { label: "Intent", value: "Order status", tone: "brand" },
              { label: "Order reference", value: "NL-4471" },
              { label: "Sentiment", value: "Mild concern", tone: "signal" },
            ],
          },
        ],
      },
      {
        id: "signal",
        label: "Signal",
        heading: "Frustration is worth noticing",
        blurb: "A customer chasing an order is a retention risk, not a sales opportunity. The action reflects that.",
        panels: [
          {
            kind: "fields",
            title: "Signals",
            rows: [
              { label: "Hesitation", value: "None" },
              { label: "Frustration", value: "Low, but present", tone: "signal" },
              { label: "Recovery action needed", value: "No — reassurance instead" },
            ],
          },
        ],
      },
      {
        id: "lookup",
        label: "Lookup",
        heading: "The order record is fetched",
        blurb: "A single tool call against the order system. No document retrieval is involved.",
        panels: [
          {
            kind: "fields",
            title: "Order NL-4471 (synthetic)",
            rows: [
              { label: "Status", value: "Dispatched", tone: "positive" },
              { label: "Carrier", value: "Regional courier" },
              { label: "Dispatched", value: "Yesterday, 16:20" },
              { label: "Expected", value: "Tomorrow" },
            ],
          },
          {
            kind: "note",
            tone: "signal",
            title: "The storefront was out of date",
            body: "The order shows as dispatched in the order system while the customer's account page still says processing. The reply resolves the contradiction rather than repeating it.",
          },
        ],
      },
      {
        id: "grounded",
        label: "Grounded answer",
        heading: "Answer from the record, not the page",
        blurb: "Where two sources disagree, the system answers from the authoritative one and says so plainly.",
        panels: [
          { kind: "note", tone: "brand", title: "Grounding rule", body: SOURCE_NOTE },
        ],
      },
      {
        id: "action",
        label: "Action",
        heading: "What the system decides to do",
        blurb: "Answer, explain the discrepancy, and leave a trace for the team.",
        panels: [
          {
            kind: "list",
            title: "Chosen actions",
            items: [
              "Give the dispatch status and expected arrival",
              "Explain why the account page disagreed",
              "Flag the stale storefront status for the team to look at",
            ],
          },
        ],
      },
      {
        id: "reply",
        label: "Reply",
        heading: "What the customer sees",
        blurb: "Short, specific, and it addresses the thing that actually worried them.",
        panels: [
          {
            kind: "message",
            from: `${STORE} support`,
            meta: "Sent 09:41",
            body: "Good news — NL-4471 was dispatched yesterday at 16:20 and is due to arrive tomorrow.\n\nYour account page is lagging behind the courier update, which is why it still shows as processing. The parcel itself is on its way.",
          },
        ],
      },
    ],
  },

  {
    id: "policy",
    label: "Returns policy",
    summary: "A question a document can answer — and the case where retrieval must refuse.",
    stages: [
      {
        id: "message",
        label: "Message",
        heading: "A policy question",
        blurb: "The kind of message a small team answers a dozen times a week.",
        panels: [
          {
            kind: "message",
            from: "Ines F.",
            meta: "Email · 11:15",
            body: "If the jacket doesn't fit, how long do I have to send it back? And do I pay the return postage?",
          },
        ],
      },
      {
        id: "understanding",
        label: "Understanding",
        heading: "Two questions, not one",
        blurb: "Both halves must be answered or the reply will generate a follow-up.",
        panels: [
          {
            kind: "fields",
            title: "Read from the message",
            rows: [
              { label: "Intent", value: "Returns policy", tone: "brand" },
              { label: "Sub-question 1", value: "Return window" },
              { label: "Sub-question 2", value: "Who pays postage" },
            ],
          },
        ],
      },
      {
        id: "signal",
        label: "Signal",
        heading: "A returns question before purchase",
        blurb:
          "Asking about returns before buying is a hesitation marker: the customer is weighing the risk of it not working out.",
        panels: [
          {
            kind: "fields",
            title: "Signals",
            rows: [
              { label: "Hesitation", value: "Detected", tone: "signal" },
              { label: "Basis", value: "Returns asked pre-purchase" },
              { label: "Recovery action needed", value: "Yes — reassurance", tone: "signal" },
            ],
          },
        ],
      },
      {
        id: "lookup",
        label: "Retrieval",
        heading: "The store's own policy is retrieved",
        blurb: "Passages are pulled from the store's documents and ranked. Only retrieved text is allowed into the answer.",
        panels: [
          {
            kind: "quote",
            title: "Retrieved passage",
            text: "Unworn items may be returned within 30 days of delivery. Return postage is paid by the customer unless the item arrived damaged or incorrect.",
            source: "Store returns policy · synthetic fixture",
          },
        ],
      },
      {
        id: "grounded",
        label: "Grounded answer",
        heading: "Both halves are covered by the source",
        blurb:
          "The retrieved passage answers both sub-questions, so the reply can be written entirely from it.",
        panels: [
          {
            kind: "fields",
            title: "Coverage check",
            rows: [
              { label: "Return window", value: "Covered — 30 days", tone: "positive" },
              { label: "Postage", value: "Covered — customer pays", tone: "positive" },
              { label: "Unsupported claims", value: "0", tone: "positive" },
            ],
          },
          {
            kind: "note",
            title: "If it had not been covered",
            body: "Where retrieval returns nothing relevant, the system says it does not know and offers to pass the question to a person. It does not fill the gap from general knowledge.",
          },
        ],
      },
      {
        id: "action",
        label: "Action",
        heading: "Answer, then reduce the risk",
        blurb:
          "The recovery action here is not a discount. It is removing the thing making the customer hesitate.",
        panels: [
          {
            kind: "list",
            title: "Chosen actions",
            items: [
              "Answer both halves from the retrieved policy",
              "Lead with the reassuring part of the policy, since hesitation was detected",
              "No discount — the barrier is risk, not price",
            ],
          },
        ],
      },
      {
        id: "reply",
        label: "Reply",
        heading: "What the customer sees",
        blurb: "Accurate, complete, and framed to address the worry behind the question.",
        panels: [
          {
            kind: "message",
            from: `${STORE} support`,
            meta: "Sent 11:16",
            body: "You have 30 days from delivery to send anything back, as long as it is unworn — so there is no rush to decide once it arrives.\n\nReturn postage is paid by you, unless the item turns up damaged or we sent the wrong thing, in which case we cover it.",
          },
        ],
      },
    ],
  },

  {
    id: "hesitating",
    label: "Hesitating buyer",
    summary:
      "The case the project is named for: interest is real, but the customer is about to leave.",
    stages: [
      {
        id: "message",
        label: "Message",
        heading: "Interest, with a reason not to buy",
        blurb: "Nothing here is a question. That is exactly why it is easy to miss.",
        panels: [
          {
            kind: "message",
            from: "Marcus B.",
            meta: "Live chat · 20:37",
            body: "I like the look of the winter parka but it's a bit more than I wanted to spend. Might leave it for now.",
          },
        ],
      },
      {
        id: "understanding",
        label: "Understanding",
        heading: "No question was asked",
        blurb:
          "A support system that only answers questions has nothing to do with this message. Something else has to notice it.",
        panels: [
          {
            kind: "fields",
            title: "Read from the message",
            rows: [
              { label: "Intent", value: "No question asked", tone: "signal" },
              { label: "Product interest", value: "Winter parka" },
              { label: "Stated blocker", value: "Price" },
              { label: "Stated outcome", value: "Leaving without buying", tone: "signal" },
            ],
          },
        ],
      },
      {
        id: "signal",
        label: "Signal",
        heading: "The signal that makes this project worth building",
        blurb:
          "This is the moment a small team misses at 20:37 on a weeknight, and the one the system exists to catch.",
        panels: [
          {
            kind: "fields",
            title: "Signals",
            rows: [
              { label: "Hesitation", value: "Detected", tone: "signal" },
              { label: "Basis", value: "Price objection + stated intent to leave" },
              { label: "Confidence", value: "High" },
              { label: "Recovery action needed", value: "Yes", tone: "signal" },
            ],
          },
          {
            kind: "note",
            tone: "signal",
            title: "Signal detected",
            body: "Customer is interested but uncertain, and has named price as the reason. The opportunity is live but about to close.",
          },
        ],
      },
      {
        id: "lookup",
        label: "Lookup",
        heading: "What is available to offer",
        blurb:
          "Before anything is offered, the system checks what the store actually permits. Offers are not invented.",
        panels: [
          {
            kind: "fields",
            title: "Eligible offers (synthetic)",
            rows: [
              { label: "First-order code", value: "WELCOME10 — 10% off", tone: "positive" },
              { label: "Customer eligible", value: "Yes — no previous orders", tone: "positive" },
              { label: "Stackable", value: "No" },
              { label: "Expires", value: "7 days" },
            ],
          },
          {
            kind: "note",
            title: "Bounded by policy",
            body: "The system can only offer what the store has authorised. There is no discretion to invent a discount, and no path to a larger one.",
          },
        ],
      },
      {
        id: "grounded",
        label: "Grounded answer",
        heading: "The offer is real, or it is not made",
        blurb: "The code, the amount and the expiry all come from the store's own configuration.",
        panels: [
          { kind: "note", tone: "brand", title: "Grounding rule", body: SOURCE_NOTE },
        ],
      },
      {
        id: "action",
        label: "Action",
        heading: "Provide reassurance, preserve the opportunity",
        blurb:
          "Two things are done: the objection is addressed with a real offer, and the interest is recorded so it is not lost if the customer still leaves.",
        panels: [
          {
            kind: "list",
            title: "Chosen actions",
            items: [
              "Offer the authorised first-order code, once",
              "State the expiry so the decision does not have to be made now",
              "Record the interest against the product for follow-up",
              "Do not repeat the offer if the customer declines",
            ],
          },
        ],
      },
      {
        id: "reply",
        label: "Reply",
        heading: "What the customer sees",
        blurb: "Helpful rather than pushy — and the offer is one the store actually sanctioned.",
        panels: [
          {
            kind: "message",
            from: `${STORE} support`,
            meta: "Sent 20:37",
            body: "Completely understand — it is a considered buy.\n\nIf it helps, WELCOME10 takes 10% off a first order and is valid for the next seven days, so you do not have to decide tonight. Happy to answer anything about sizing or warmth in the meantime.",
          },
          {
            kind: "note",
            tone: "positive",
            title: "What was preserved",
            body: "Whether or not this customer buys tonight, the interest and the reason for hesitating are now recorded. That is the part a busy team loses.",
          },
        ],
      },
    ],
  },
];
