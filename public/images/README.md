# Project 1 screenshots

Real screenshots of the Sales-Recovery agent's chat page, referenced by the case study at
`src/pages/SalesRecoveryCaseStudy.tsx` and the homepage card in `src/data/projects.ts`. They were taken from the
demo recording of a **live Gemini run on 2026-10-15** (`gemini-3.5-flash-lite`), fictional store and data; the replies
and the steps beside them are what the server returned, and nothing was edited. The mobile one is rendered from
the recorded replies of the same run. The originals are in the agent repository's `docs/screenshots/`.

| File | What it shows |
|---|---|
| `p1-hesitation-operator.png` | The hesitation reply (30-day return window) with its chips, beside the Activity panel: signal, model call, knowledge-base search, files and chunks |
| `p1-order-lookup.png` | An order-status reply from a tool lookup, with its chips |
| `p1-operator-steps.png` | The Operator view for that reply: model call, tool call, model call, eight guardrail policies |
| `p1-guardrail-provenance.png` | A declined 50% off request; the guardrail line "WELCOME10: verified by checkDiscount on question 2" |
| `p1-dark-operator.png` | The dark theme with the Operator view |
| `p1-mobile-sheet.png` | The page at 390 px wide, the Activity panel as a bottom sheet |

Deliberately not filled with mock-ups: an illustration presented as a screenshot would misrepresent what the
product looks like.
