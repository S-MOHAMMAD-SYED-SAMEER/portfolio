import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

import { projectById } from '../src/data/projects.ts'

/**
 * Rule for the DocIntel real-model figures: no accuracy figure appears without the count of wrong values that
 * were not flagged for review, and the limits, next to it.
 */

const ROOT = join(import.meta.dirname, '..')
const page = readFileSync(join(ROOT, 'src/pages/DocIntelCaseStudy.tsx'), 'utf8')
const card = projectById('p5').proof

test('the DocIntel card gives the accuracy figure with the unflagged count beside it', () => {
  const line = card.find((entry) => entry.includes('387 of 390'))
  assert.ok(line, 'the card carries the real-model line')
  assert.match(line, /30 synthetic invoices/)
  assert.match(line, /one run/)
  assert.match(line, /2 wrong values not flagged for review \(after the checker fix: 2\)/)
})

test('the DocIntel card states its test count first, as passing in CI', () => {
  assert.match(card[0] ?? '', /^658 tests passing \(CI\)$/)
})

test('the case study shows both checker versions and the main limits', () => {
  for (const needle of [
    'as run',
    'fixed checker',
    'synthetic',
    'labels are by construction',
    'one run of each prompt',
    'barely harder',
    'image-only',
    '0.850',
    'Not an accuracy figure for real invoices',
  ]) {
    assert.ok(page.toLowerCase().includes(needle.toLowerCase()), `the case study should say "${needle}"`)
  }
})

test('the case study no longer carries the pre-run claims', () => {
  for (const stale of [
    'No official real-model benchmark',
    'has no CI workflow',
    'no GET /api/v1/documents',
    'doesn&apos;t document whether the image',
    '521',
  ]) {
    assert.ok(!page.includes(stale), `stale claim still present: ${stale}`)
  }
})
