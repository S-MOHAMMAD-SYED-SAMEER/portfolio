import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

/**
 * Two statements on the Sales-Recovery case study that must stay true:
 *  - who labelled the real drafts the guardrail figures come from (one AI reviewer, not a person by hand);
 *  - what the chat endpoint returns (the reply, the tools, the signals and, since the Operator view, the trace).
 */

const ROOT = join(import.meta.dirname, '..')
const read = (path: string) => readFileSync(join(ROOT, path), 'utf8')

test('the guardrail figures say the drafts were labelled by one AI reviewer, never "by hand" or by a person', () => {
  const page = read('src/pages/SalesRecoveryCaseStudy.tsx')
  assert.match(page, /AI-labelled by one reviewer \(Claude Code\); a sample of 20 checked by Sameer: agreed with 19, relabelled 1/)
  assert.match(page, /one AI reviewer, Claude Code/)
  assert.match(page, /89 AI-labelled drafts/)
  // the figures and the two remaining unsupported claims, after Sameer's spot check
  assert.match(page, /figure: "0 \/ 83"/)
  assert.match(page, /\(was 2 \/ 40\)/)
  assert.match(page, /Two unsupported claims of kinds the guardrails don't check \(a store fact and a promised capability\) still get through/)
  assert.ok(!/unrelated unsupported/i.test(page), 'the page still calls the missed claims unrelated')
  // the old wording is gone: nothing on the page says the drafts were checked or read by hand
  assert.ok(!/checked by hand/i.test(page), 'the page still says "checked by hand"')
  assert.ok(!/drafts[^.]{0,60}by hand|by hand[^.]{0,60}drafts/i.test(page), 'the page ties "by hand" to the drafts')
})

test('the response step lists the trace as well as the reply, tools and signals', () => {
  const flow = read('src/components/caseStudy/SalesRecoveryFlow.tsx')
  assert.match(flow, /\{ reply, toolsUsed, signals, trace \} is returned to the caller/)
  assert.ok(!/\{ reply, toolsUsed, signals \}/.test(flow), 'the old response shape is still described')
})
