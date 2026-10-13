import type { Scenario } from "../ui/DemoShell";

/**
 * Four scenarios for the support and sales-recovery agent, replayed from the
 * agent's own code.
 *
 * WHERE EVERY VALUE COMES FROM
 *
 * Nothing here is invented to look plausible. Each scenario is the output the
 * Sales-Recovery Agent repository's credential-free `demo` provider and its real
 * pipeline produce for the question shown: the signal detector's own result
 * (`server/src/signals`), the real tool and retrieval results over the
 * repository's mock data and knowledge-base documents (`server/src/tools`,
 * `server/data/kb`), the policies in `server/src/guardrails/policies.js`, and
 * the reply the pipeline returned. They were captured on 2026-10-13 from the
 * repository at the state described in its README.
 *
 * WHAT THIS IS NOT
 *
 * No language model is involved, here or in the captured runs. With a real model
 * (Gemini or Claude) the wording of a reply and the choice of tools come from
 * the model; the signals, the tools, the retrieval and the guardrails around it
 * are the same code. That run has not been recorded yet, so nothing below is a
 * claim about a model's behaviour.
 *
 * The earlier version of this file described a store with its own name, orders
 * and offers, a "frustration" signal, a proactive discount, a follow-up task and
 * a team flag. None of those exist in the code, so they are gone.
 */

const DEMO_REPLY_SOURCE =
  "Replies in this demo come from the repository's demo provider, which has no model: it recognises a fixed set of questions, calls the real tools, and answers from their results.";

const MEMORY_NOTE =
  "Only the customer's message and this final reply are saved to the conversation. Tool results and any blocked draft are not.";

/** The signal stage when nothing fires, which is most messages. */
const NO_SIGNAL = [
  {
    kind: "fields" as const,
    title: "Signal detection",
    caption: "Six regex patterns, run over this message only (never earlier turns).",
    rows: [{ label: "Signals detected", value: "None" }],
  },
  {
    kind: "note" as const,
    title: "Nothing is added to the prompt",
    body: "No pattern for hesitation, a price or shipping worry, a returns worry or leaving without buying matches, so the system prompt is sent unchanged.",
  },
];

export const P1_SCENARIOS: Scenario[] = [
  {
    id: "availability",
    label: "Product availability",
    summary: "A stock question: answered by a tool, not by the model's memory.",
    stages: [
      {
        id: "message",
        label: "Message",
        heading: "A customer asks about stock",
        blurb: "The starting point is an ordinary chat message.",
        panels: [
          { kind: "message", from: "Customer", meta: "Demo chat", body: "Is the Ceramic Mug in stock?" },
        ],
      },
      {
        id: "signal",
        label: "Signals",
        heading: "Is there anything beyond the question?",
        blurb: "Signal detection is deterministic code that runs before the model, and only shapes tone.",
        panels: NO_SIGNAL,
      },
      {
        id: "lookup",
        label: "Tool call",
        heading: "Stock is looked up, not remembered",
        blurb: "Live data comes from a tool. The tool, not the model, decides what is in stock.",
        panels: [
          {
            kind: "fields",
            title: "checkStock",
            caption: 'Called with { "product": "ceramic mug" }. Mock data standing in for a store\'s inventory API.',
            rows: [
              { label: "SKU", value: "MUG-001" },
              { label: "Product", value: "Ceramic Mug" },
              { label: "In stock", value: "Yes", tone: "positive" },
              { label: "Quantity", value: "42" },
            ],
          },
          {
            kind: "note",
            title: "Who chooses the tool",
            body: "With a real model, the model decides to call checkStock. The demo provider recognises a stock question with a fixed pattern and makes the same call.",
          },
        ],
      },
      {
        id: "guardrail",
        label: "Guardrails",
        heading: "The draft is checked before it is shown",
        blurb: "Eight policies in application code check the reply against what actually ran this turn.",
        panels: [
          {
            kind: "fields",
            title: "Policies that apply to this reply",
            rows: [
              { label: "no_unverified_stock_claim", value: "Passed — checkStock ran this turn", tone: "positive" },
              { label: "no_deceptive_urgency", value: "Passed — no urgency language", tone: "positive" },
              { label: "The other six", value: "Passed" },
            ],
          },
          {
            kind: "note",
            title: "A stated limitation",
            body: "The check is that the right tool ran, not that the reply's number matches the tool's. It would not catch a reply that said 100 when the tool said 42.",
          },
        ],
      },
      {
        id: "reply",
        label: "Reply",
        heading: "What the customer sees",
        blurb: DEMO_REPLY_SOURCE,
        panels: [
          {
            kind: "message",
            from: "Support assistant",
            meta: "Demo provider · toolsUsed: checkStock",
            body: "Yes, the Ceramic Mug is in stock — 42 available.",
          },
          { kind: "note", title: "What is remembered", body: MEMORY_NOTE },
        ],
      },
    ],
  },

  {
    id: "order",
    label: "Order status",
    summary: "An order question: answered from the order record, with no authentication in the way.",
    stages: [
      {
        id: "message",
        label: "Message",
        heading: "A question about something already bought",
        blurb: "This cannot be answered from documents at all; it needs the order record.",
        panels: [
          { kind: "message", from: "Customer", meta: "Demo chat", body: "What's the status of order 1001?" },
        ],
      },
      {
        id: "signal",
        label: "Signals",
        heading: "Is there anything beyond the question?",
        blurb: "Signal detection is deterministic code that runs before the model, and only shapes tone.",
        panels: NO_SIGNAL,
      },
      {
        id: "lookup",
        label: "Tool call",
        heading: "The order record is fetched",
        blurb: "One tool call against the order system. No document retrieval is involved.",
        panels: [
          {
            kind: "fields",
            title: "getOrderStatus",
            caption: 'Called with { "orderId": "1001" }. Mock data standing in for a store\'s order system.',
            rows: [
              { label: "Status", value: "shipped", tone: "positive" },
              { label: "Carrier", value: "DHL" },
              { label: "Tracking number", value: "DHL-778812" },
              {
                label: "Estimated delivery",
                value: "2026-10-16",
                note: "The mock dates are set relative to the day the agent runs (three days ahead); this is the value from 2026-10-13.",
              },
              { label: "Items", value: "Ceramic Mug" },
            ],
          },
          {
            kind: "note",
            tone: "signal",
            title: "No authentication",
            body: "Anyone can look up any order number. That is fine for invented data and is listed as a limitation: a real store would need the customer to prove the order is theirs.",
          },
        ],
      },
      {
        id: "guardrail",
        label: "Guardrails",
        heading: "The draft is checked before it is shown",
        blurb: "Eight policies in application code check the reply against what actually ran this turn.",
        panels: [
          {
            kind: "fields",
            title: "Policies that apply to this reply",
            rows: [
              {
                label: "no_unverified_order_status_claim",
                value: "Passed — getOrderStatus ran this turn",
                tone: "positive",
              },
              { label: "The other seven", value: "Passed" },
            ],
          },
        ],
      },
      {
        id: "reply",
        label: "Reply",
        heading: "What the customer sees",
        blurb: DEMO_REPLY_SOURCE,
        panels: [
          {
            kind: "message",
            from: "Support assistant",
            meta: "Demo provider · toolsUsed: getOrderStatus",
            body: "Order 1001 is currently shipped. Tracking number DHL-778812 via DHL. Estimated delivery: 2026-10-16.",
          },
          { kind: "note", title: "What is remembered", body: MEMORY_NOTE },
        ],
      },
    ],
  },

  {
    id: "policy",
    label: "Returns policy",
    summary: "A policy question: answered from the store's own written policy, word for word.",
    stages: [
      {
        id: "message",
        label: "Message",
        heading: "A policy question",
        blurb: "The kind of message a small team answers a dozen times a week.",
        panels: [
          { kind: "message", from: "Customer", meta: "Demo chat", body: "What is your return policy?" },
        ],
      },
      {
        id: "signal",
        label: "Signals",
        heading: "Is there anything beyond the question?",
        blurb: "Signal detection is deterministic code that runs before the model, and only shapes tone.",
        panels: [
          ...NO_SIGNAL,
          {
            kind: "note",
            title: "A question is not a worry",
            body: "The return_concern signal needs wording such as “worried about returning” or “what if it doesn't fit”. Asking what the policy is does not match, and the detector does not guess.",
          },
        ],
      },
      {
        id: "lookup",
        label: "Retrieval",
        heading: "The store's own policy is retrieved",
        blurb: "Passages are pulled from four markdown documents by a local embedding model and Chroma.",
        panels: [
          {
            kind: "quote",
            title: "Best passage retrieved",
            text: "Items can be returned within 30 days of the delivery date for a full refund, provided they are unused, unwashed, and in their original packaging with tags attached. We are unable to accept returns after the 30-day window has closed.",
            source: "Returns & Refunds Policy > Return Window · similarity 0.587",
          },
          {
            kind: "fields",
            title: "searchKnowledgeBase: top three passages",
            caption: "Passages below a similarity of 0.35 are dropped. If none clears it, the tool says so and the agent must not invent a policy.",
            rows: [
              { label: "Return Window", value: "0.587" },
              { label: "Non-Returnable Items", value: "0.557" },
              { label: "Damaged or Defective Items", value: "0.517" },
            ],
          },
        ],
      },
      {
        id: "guardrail",
        label: "Guardrails",
        heading: "The draft is checked before it is shown",
        blurb: "Eight policies in application code check the reply against what actually ran this turn.",
        panels: [
          {
            kind: "fields",
            title: "Policies that apply to this reply",
            rows: [
              {
                label: "no_unverified_policy_claim",
                value: "Passed — searchKnowledgeBase ran this turn",
                tone: "positive",
              },
              { label: "no_unsupported_refund_promise", value: "Passed — states a policy, promises nothing", tone: "positive" },
              { label: "The other six", value: "Passed" },
            ],
          },
        ],
      },
      {
        id: "reply",
        label: "Reply",
        heading: "What the customer sees",
        blurb: DEMO_REPLY_SOURCE,
        panels: [
          {
            kind: "message",
            from: "Support assistant",
            meta: "Demo provider · toolsUsed: searchKnowledgeBase",
            body: "Items can be returned within 30 days of the delivery date for a full refund, provided they are unused, unwashed, and in their original packaging with tags attached. We are unable to accept returns after the 30-day window has closed. Final-sale and clearance items are not eligible for return or refund.",
          },
          {
            kind: "note",
            title: "How the wording is chosen",
            body: "The demo provider picks the sentences of the retrieved passages that best match the question and returns them verbatim. A real model would write its own answer from the same passages.",
          },
          { kind: "note", title: "What is remembered", body: MEMORY_NOTE },
        ],
      },
    ],
  },

  {
    id: "hesitating",
    label: "Hesitating buyer",
    summary: "The case the project is named for: a signal is detected, and no discount is invented.",
    stages: [
      {
        id: "message",
        label: "Message",
        heading: "Interest, with a reason to wait",
        blurb: "Nothing here is a question, which is why a support bot that only answers questions misses it.",
        panels: [
          {
            kind: "message",
            from: "Customer",
            meta: "Demo chat",
            body: "I like this but I'm still deciding if I need it.",
          },
        ],
      },
      {
        id: "signal",
        label: "Signals",
        heading: "The signal detector fires",
        blurb: "A hand-written pattern matches, and a one-line directive is added to this turn's system prompt.",
        panels: [
          {
            kind: "fields",
            title: "Signal detected",
            caption: "Structured output, not prose: a type, a fixed hand-set confidence, and the matched words.",
            rows: [
              { label: "Type", value: "purchase_hesitation", tone: "signal" },
              { label: "Confidence", value: "0.75", note: "Chosen by hand for this pattern, not learned." },
              { label: "Evidence", value: "“still deciding”" },
              { label: "Scope", value: "This message only" },
            ],
          },
          {
            kind: "quote",
            title: "Directive added to the system prompt",
            text: "The customer seems hesitant about buying — proactively address likely concerns (shipping, returns, fit) using your tools/knowledge base, and reassure them. Never invent or imply a discount that hasn't been verified with the discount tool.",
            source: "server/src/signals/index.js",
          },
        ],
      },
      {
        id: "lookup",
        label: "Tool call",
        heading: "No tool is called here",
        blurb: "The demo provider answers this message with a fixed reassurance.",
        panels: [
          {
            kind: "note",
            title: "What a real model might do",
            body: "Told to address likely concerns, a real model may look up shipping or returns information on its own. That behaviour has not been recorded yet, so this demo does not show it.",
          },
          {
            kind: "note",
            tone: "signal",
            title: "There is no discount offer, on purpose",
            body: "The agent only talks about a discount code the customer supplies and the checkDiscount tool confirms. Nothing in the signal, the prompt or the tools lets it offer one unprompted.",
          },
        ],
      },
      {
        id: "guardrail",
        label: "Guardrails",
        heading: "A discount claim would be blocked",
        blurb: "Eight policies in application code check the reply against what actually ran this turn.",
        panels: [
          {
            kind: "fields",
            title: "Policies that apply to this reply",
            rows: [
              {
                label: "no_unverified_discount_claim",
                value: "Passed — the reply makes no discount claim",
                tone: "positive",
              },
              { label: "no_deceptive_urgency", value: "Passed — no pressure language", tone: "positive" },
              { label: "The other six", value: "Passed" },
            ],
          },
          {
            kind: "note",
            title: "If a draft did mention a discount",
            body: "Without a checkDiscount call this turn, no_unverified_discount_claim would replace the whole reply with a fixed fallback, and the fallback is what would be saved.",
          },
        ],
      },
      {
        id: "reply",
        label: "Reply",
        heading: "What the customer sees",
        blurb: DEMO_REPLY_SOURCE,
        panels: [
          {
            kind: "message",
            from: "Support assistant",
            meta: "Demo provider · toolsUsed: none",
            body: "No worries — it's a big decision! I'm happy to check stock, look up a discount code, or answer a shipping or returns question for you. Just let me know what would help.",
          },
          {
            kind: "note",
            title: "Detecting is not acting",
            body: "A signal only shapes this reply. No email, CRM update or follow-up task happens outside the chat, and the signal is not stored beyond this response.",
          },
        ],
      },
    ],
  },
];
