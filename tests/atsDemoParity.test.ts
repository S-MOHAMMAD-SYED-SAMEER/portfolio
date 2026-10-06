import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { test } from 'node:test'

import { buildP3Scenarios } from '../src/demo/data/p3.ts'
import { runDemo } from '../src/demo/p3/run.ts'

/**
 * The 2D ATS demo must say what the real Explainable ATS says.
 *
 * It used to be a hand-written simulation: five requirements, "points" scoring
 * and an 88% for Rowan, none of which the real system does. It is now built from
 * the project's own pipeline (`src/demo/p3/`) over the project's own dataset, and
 * this file holds it there three ways:
 *
 *   1. the real system's published numbers, written out below, must be what the
 *      demo produces and what its screens say;
 *   2. the vendored pipeline files must be byte-for-byte what their headers say
 *      they are, so nobody can edit a copy and quietly change a verdict;
 *   3. when the Explainable ATS is checked out beside this repository, the copies
 *      must also match its current source. The explainable-ats `demo-parity` test
 *      runs the whole pipeline against this demo's runner as well.
 *
 * The numbers in (1) are typed on purpose. They are the claim being checked, and
 * they are the ones in that project's README worked example.
 */

const ROOT = join(import.meta.dirname, '..')
const P3 = join(ROOT, 'src', 'demo', 'p3')

// --- what the real system produces ------------------------------------------------

const REAL_REQUIREMENTS = [
  { label: 'Node.js', kind: 'must_have', weight: 3 },
  { label: 'PostgreSQL', kind: 'must_have', weight: 2 },
  { label: 'Mentoring', kind: 'nice_to_have', weight: 2 },
]

type Real = {
  reference: string
  name: string
  tier: 'qualified' | 'needs_review' | 'gated' | 'not_evaluated'
  score: number | null
  verdicts: string[]
  contributions: number[]
  position: number
}

const REAL: Real[] = [
  { reference: 'demo-001', name: 'Rowan Ashfield', tier: 'qualified', score: 10000, verdicts: ['met', 'met', 'met'], contributions: [4286, 2857, 2857], position: 1 },
  { reference: 'demo-002', name: 'Devi Narayanan', tier: 'qualified', score: 7142, verdicts: ['met', 'met', 'unclear'], contributions: [4285, 2857, 0], position: 2 },
  { reference: 'demo-003', name: 'Marcus Oyelaran', tier: 'gated', score: 7142, verdicts: ['met', 'not_met', 'met'], contributions: [4285, 0, 2857], position: 4 },
  { reference: 'demo-004', name: 'Ines Fabre', tier: 'needs_review', score: 5714, verdicts: ['met', 'unclear', 'partial'], contributions: [4286, 0, 1428], position: 3 },
  { reference: 'demo-005', name: 'Toby Kestrel', tier: 'not_evaluated', score: null, verdicts: [], contributions: [], position: 5 },
]

const run = await runDemo()
const scenarios = buildP3Scenarios(run)

/** Every string on a candidate's screens, in one place to search. */
function textOf(reference: string): string {
  const scenario = scenarios.find((item) => item.id === reference)
  assert.ok(scenario, `${reference} has no scenario`)
  const strings: string[] = [scenario.label, scenario.summary]
  const walk = (value: unknown): void => {
    if (typeof value === 'string') strings.push(value)
    else if (Array.isArray(value)) value.forEach(walk)
    else if (value !== null && typeof value === 'object') Object.values(value).forEach(walk)
  }
  walk(scenario.stages)
  return strings.join('\n')
}

// --- 1. the numbers ---------------------------------------------------------------

test('the demo job is the real one: three requirements, with the real weights', () => {
  assert.deepEqual(
    run.requirements.map(({ label, kind, weight }) => ({ label, kind, weight })),
    REAL_REQUIREMENTS,
  )
})

test('every candidate gets the real tier, score, verdicts and per-requirement contributions', () => {
  assert.equal(run.candidates.length, REAL.length)

  for (const real of REAL) {
    const candidate = run.candidates.find((item) => item.candidate.reference === real.reference)
    assert.ok(candidate, `${real.reference} is missing`)
    const entry = run.ranking.entries.find((item) => item.reference === real.reference)
    assert.ok(entry, `${real.reference} is missing from the ranking`)

    assert.equal(entry.tier, real.tier, `${real.name}: tier`)
    assert.equal(entry.scoreBasisPoints, real.score, `${real.name}: score`)
    assert.equal(entry.position, real.position, `${real.name}: position`)
    assert.deepEqual(candidate.matches.map((match) => match.verdict), real.verdicts, `${real.name}: verdicts`)
    assert.deepEqual(
      candidate.matches.map((match) => match.contributionBasisPoints),
      real.contributions,
      `${real.name}: contributions`,
    )
    if (real.score !== null) {
      assert.equal(
        real.contributions.reduce((sum, value) => sum + value, 0),
        real.score,
        `${real.name}: contributions add up to the score`,
      )
    }
  }
})

test('the ranking puts Devi above Marcus at the same score, and Ines above Marcus at a lower one', () => {
  const order = run.ranking.entries.map((entry) => entry.displayName)
  assert.deepEqual(order, ['Rowan Ashfield', 'Devi Narayanan', 'Ines Fabre', 'Marcus Oyelaran', 'Toby Kestrel'])
})

// --- the screens say it -----------------------------------------------------------

test('there is one scenario per candidate, each with the same ten stages in the same order', () => {
  assert.deepEqual(
    scenarios.map((scenario) => scenario.id),
    REAL.map((real) => real.reference),
  )
  for (const scenario of scenarios) {
    assert.deepEqual(
      scenario.stages.map((stage) => stage.id),
      ['resume', 'requirements', 'redaction', 'evidence', 'verification', 'matching', 'scoring', 'ranking', 'decision', 'audit'],
      scenario.label,
    )
  }
})

test('the scoring stage shows the real formula and contributions that add up to the real score', () => {
  for (const real of REAL.filter((item) => item.score !== null)) {
    const scoring = scenarios
      .find((item) => item.id === real.reference)!
      .stages.find((stage) => stage.id === 'scoring')!
    const text = JSON.stringify(scoring.panels)

    assert.match(text, /floor\( Σ weight × points ÷ Σ weight \)/, `${real.name}: the formula`)
    assert.ok(text.includes(`floored to ${real.score}`), `${real.name}: states the score ${real.score}`)
    assert.ok(
      text.includes(`${real.contributions.join(' + ')} = ${real.score}`),
      `${real.name}: shows ${real.contributions.join(' + ')} = ${real.score}`,
    )
    assert.ok(text.includes('Σ weight'), `${real.name}: shows the weight total`)
    assert.ok(text.includes('÷ 7 ='), `${real.name}: divides by the real total weight of 7`)
  }
})

test("Ines's scoring stage shows the leftover basis point that makes the shares add up", () => {
  const text = JSON.stringify(
    scenarios.find((item) => item.id === 'demo-004')!.stages.find((stage) => stage.id === 'scoring')!.panels,
  )
  assert.ok(text.includes('4286'), 'Node.js gets 4286, not 4285')
  assert.ok(text.includes('plus 1 leftover point (largest remainder)'))
  assert.ok(text.includes('4286 + 0 + 1428 = 5714'))
})

test("Toby is listed, unranked, with no score and nothing invented in the stages that did not run", () => {
  const text = textOf('demo-005')
  assert.ok(text.includes('Not assessed yet'))
  assert.ok(text.includes('No score'))
  assert.ok(text.includes('Not run for this candidate'))
  const decision = scenarios.find((item) => item.id === 'demo-005')!.stages.find((stage) => stage.id === 'decision')!
  assert.equal(decision.action, undefined, 'an unscored assessment cannot take a decision')
})

test('the screens use the real code words and never the old simulation\'s', () => {
  for (const real of REAL) {
    const text = textOf(real.reference)
    for (const stale of ['88%', ' of 80', 'Distributed systems', 'Essentials met', 'Desirables met', 'Not evidenced']) {
      assert.ok(!text.includes(stale), `${real.name}'s screens still say "${stale}"`)
    }
  }
  // The decision outcomes are the code's.
  const decision = JSON.stringify(scenarios[0]!.stages.find((stage) => stage.id === 'decision')!.panels)
  for (const outcome of ['Shortlist', 'Reject', 'Hold']) assert.ok(decision.includes(outcome), outcome)
  assert.ok(!decision.includes('Advance'))
})

test('no number is typed into the scenario builder', () => {
  const source = readFileSync(join(ROOT, 'src', 'demo', 'data', 'p3.ts'), 'utf8')
  // A percentage or a score written as a literal in a string would be a value
  // someone typed rather than one the pipeline produced.
  assert.ok(!/["'`][^"'`\n]*\b\d+%/.test(source), 'a percentage is written out in p3.ts')
  assert.ok(!/["'`][^"'`\n]*\b\d{4,5}\b/.test(source), 'a score-sized number is written out in p3.ts')
})

// --- 2. the vendored files are what their headers say -----------------------------

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? filesUnder(path) : [path]
  })
}

/** The header's claim and the hash of what follows it, newline-normalised. */
function vendoredParts(path: string): { source: string; claimed: string; actual: string } {
  const text = readFileSync(path, 'utf8').replace(/\r\n/g, '\n')
  const source = /Source:\s*\n\s*\*\s*(\S+)/.exec(text)?.[1]
  const claimed = /Body SHA-256:\s*\n\s*\*\s*([0-9a-f]{64})/.exec(text)?.[1]
  assert.ok(source && claimed, `${relative(ROOT, path)} has no generated-file header`)
  const body = text.slice(text.indexOf('*/\n') + 3)
  return { source, claimed, actual: createHash('sha256').update(body).digest('hex') }
}

const VENDORED = filesUnder(join(P3, 'vendored'))

test('the pipeline is vendored whole, and nothing in it has been edited', () => {
  assert.ok(VENDORED.length >= 11, `only ${VENDORED.length} vendored files`)
  for (const path of VENDORED) {
    const { claimed, actual } = vendoredParts(path)
    assert.equal(actual, claimed, `${relative(ROOT, path)} was edited after it was generated`)
  }
})

test('the dataset and the runner are the ones the demo claims', () => {
  const dataset = readFileSync(join(P3, 'dataset.gen.ts'), 'utf8')
  assert.match(dataset, /GENERATED FILE — DO NOT EDIT/)
  assert.match(dataset, /explainable-ats\/server\/src\/demo\/dataset\.ts/)
  assert.equal(run.provenance.modelCalled, false)
  assert.equal(run.provenance.networkUsed, false)
})

// --- 3. against the real source, when it is here ----------------------------------

const ATS_ROOT = join(ROOT, '..', 'explainable-ats')
const atsPresent = existsSync(join(ATS_ROOT, 'server', 'src', 'agent', 'score.ts'))

test(
  'each vendored file matches the Explainable ATS source it was copied from',
  { skip: atsPresent ? false : `explainable-ats is not checked out at ${ATS_ROOT}` },
  () => {
    for (const path of VENDORED) {
      const { source, claimed } = vendoredParts(path)
      const original = join(ATS_ROOT, 'server', 'src', source.replace(/^explainable-ats\/server\/src\//, ''))
      const current = createHash('sha256')
        .update(readFileSync(original, 'utf8').replace(/\r\n/g, '\n'))
        .digest('hex')
      assert.equal(current, claimed, `${source} has changed in the Explainable ATS since it was copied; regenerate the demo`)
    }
  },
)
