import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

import { projectById, projects, testCountOf, type ProjectId } from '../src/data/projects.ts'
import { services } from '../src/data/services.ts'
import { PROJECTS as SCENE_PROJECTS } from '../src/three/data/projects.ts'
import { SERVICES as SCENE_SERVICES } from '../src/three/data/services.ts'

/**
 * Every test count on the site comes from one place: `proof[0]` in
 * `src/data/projects.ts`. The services list and the 3D scene read it from there;
 * the case-study "Validation" panels are written by hand, so this file checks
 * them against it. A count changed in one place and forgotten in another fails
 * here instead of reaching a visitor.
 */

const ROOT = join(import.meta.dirname, '..')

/** The leading number of a count line: "1,135 tests · CI green" -> 1135. */
function leadingNumber(text: string): number {
  const match = /^([0-9][0-9,]*)/.exec(text.trim())
  assert.ok(match, `no leading number in "${text}"`)
  return Number(match[1]!.replace(/,/g, ''))
}

function caseStudySource(file: string): string {
  return readFileSync(join(ROOT, 'src/pages', file), 'utf8')
}

test('every project states its test count first, as a number', () => {
  for (const project of projects) {
    assert.ok(leadingNumber(testCountOf(project)) > 0, `${project.id} has no count`)
  }
})

test('the services list shows each project\'s own count', () => {
  for (const service of services) {
    if (service.provenBy === undefined) continue
    const project = projectById(service.provenBy)
    assert.equal(
      service.evidence[0],
      testCountOf(project),
      `service "${service.id}" says "${service.evidence[0]}" but ${project.id} says "${testCountOf(project)}"`,
    )
  }
})

test('the 3D scene reads the same counts as the cards', () => {
  for (const scene of SCENE_PROJECTS) {
    assert.equal(
      scene.proof.tests,
      leadingNumber(testCountOf(projectById(scene.id as ProjectId))),
      `the scene's ${scene.id} count differs from the card's`,
    )
  }
  for (const service of SCENE_SERVICES) {
    const canonical = services.find((candidate) => candidate.id === service.id)
    assert.ok(canonical, `the scene has a service "${service.id}" the site does not`)
    assert.deepEqual(service.evidence, canonical.evidence, `the scene's "${service.id}" evidence differs`)
  }
})

// "Tests passing" panels: [file, project, the label that carries the total].
const PANELS: Array<[string, ProjectId, RegExp]> = [
  ['SalesRecoveryCaseStudy.tsx', 'p1', /Automated tests passing/],
  ['InboxToCrmCaseStudy.tsx', 'p2', /Automated tests passing/],
  ['ExplainableAtsCaseStudy.tsx', 'p3', /Automated tests passing/],
  ['KnowledgeOsCaseStudy.tsx', 'p4', /Full suite passing, CI/],
  ['DocIntelCaseStudy.tsx', 'p5', /Tests passing/],
  ['VoiceDeskCaseStudy.tsx', 'p6', /Tests passing/],
]

test('each case study\'s test-count panel shows its project\'s count', () => {
  for (const [file, id, label] of PANELS) {
    const source = caseStudySource(file)
    const panel = new RegExp(`figure:\\s*"([^"]+)",\\s*label:\\s*"(${label.source})`).exec(source)
    assert.ok(panel, `${file} has no panel labelled ${label}`)
    assert.equal(
      leadingNumber(panel[1]!),
      leadingNumber(testCountOf(projectById(id))),
      `${file} shows ${panel[1]} but ${id} says "${testCountOf(projectById(id))}"`,
    )
  }
})

test('a panel that splits its count between server and dashboard adds up', () => {
  for (const [file, id] of [
    ['InboxToCrmCaseStudy.tsx', 'p2'],
    ['ExplainableAtsCaseStudy.tsx', 'p3'],
  ] as const) {
    const split = /([0-9][0-9,]*) covering the server[^,]*, ([0-9][0-9,]*) covering the dashboard/.exec(
      caseStudySource(file),
    )
    assert.ok(split, `${file} no longer states its server/dashboard split`)
    const [server, web] = [split[1]!, split[2]!].map((part) => Number(part.replace(/,/g, '')))
    assert.equal(
      server! + web!,
      leadingNumber(testCountOf(projectById(id))),
      `${file}: ${server} + ${web} is not ${id}'s total`,
    )
  }
})

test('no case study quotes a stale count in prose or a stack list', () => {
  // "the 247-test suite", "513 tests collected": the forms a figure hides in
  // after a panel has been corrected. Each must be the project's own count.
  for (const [file, id] of PANELS) {
    const own = leadingNumber(testCountOf(projectById(id)))
    for (const match of caseStudySource(file).matchAll(/\b([0-9][0-9,]*)(?:-test\b| tests collected)/g)) {
      assert.equal(
        Number(match[1]!.replace(/,/g, '')),
        own,
        `${file} says "${match[0]}" but ${id} has ${own}`,
      )
    }
  }
})
