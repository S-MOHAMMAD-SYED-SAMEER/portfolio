import assert from 'node:assert/strict'
import { test } from 'node:test'

import { projects, projectById, type ProjectId } from '../src/data/projects.ts'
import { services } from '../src/data/services.ts'

/**
 * The relationship between what can be bought and what has been built.
 *
 * It exists twice in the canonical data, pointing in opposite directions:
 * `Service.provenBy` holds a project id, and `Project.service` holds a service
 * name. Two facts describing one relationship can disagree, and until Phase 5
 * nothing rendered either of them, so a disagreement would have been invisible
 * — which is the state this file exists to end.
 *
 * The homepage now draws both directions from these fields, so an orphaned
 * reference is no longer a dormant inconsistency: it is a link on the page
 * that goes nowhere, or a service claiming proof it does not have.
 */

test('there are exactly six projects and four services', () => {
  // Phase 6 approved three additional flagship projects — KnowledgeOS,
  // DocIntel, VoiceDesk — each built and shipped as its own standalone
  // repository. Services for them are a separate, later milestone, so the
  // service count is unchanged for now.
  assert.equal(projects.length, 6)
  assert.equal(services.length, 4)
})

test('every project names a service that exists', () => {
  // p4–p6 name a forward-looking service category — matched against the
  // standalone project's own category — but no Service entry exists for any
  // of them yet; that is the next, dedicated milestone. Until then
  // Projects.tsx's serviceAnchor renders no "Proves the service…" line for
  // them, which is not the dead link this test otherwise guards against.
  const pendingService: ProjectId[] = ['p4', 'p5', 'p6']

  for (const project of projects) {
    if (pendingService.includes(project.id)) continue
    const match = services.find((service) => service.name === project.service)
    assert.ok(
      match !== undefined,
      `project "${project.id}" names service "${project.service}", which no service declares`,
    )
  }
})

test('every provenBy resolves to a real project', () => {
  for (const service of services) {
    if (service.provenBy === undefined) continue
    assert.doesNotThrow(
      () => projectById(service.provenBy as ProjectId),
      `service "${service.id}" is proven by "${service.provenBy}", which is not a project`,
    )
  }
})

test('the two directions agree with each other', () => {
  for (const service of services) {
    if (service.provenBy === undefined) continue
    const project = projectById(service.provenBy)
    assert.equal(
      project.service,
      service.name,
      `service "${service.id}" claims project "${project.id}", but that project names service "${project.service}"`,
    )
  }

  for (const project of projects) {
    const claiming = services.filter((service) => service.provenBy === project.id)
    assert.ok(
      claiming.length <= 1,
      `project "${project.id}" is claimed by ${claiming.length} services; a project proves at most one`,
    )
    if (claiming.length === 1) {
      assert.equal(claiming[0]!.name, project.service)
    }
  }
})

test('a service without a project claims no proof, and says why', () => {
  for (const service of services) {
    if (service.provenBy !== undefined) continue
    // The one service that generalises rather than pointing at something
    // shipped has to say so on the card, because the "Proven by" line that
    // every other service carries is simply absent here.
    assert.ok(
      typeof service.caveat === 'string' && service.caveat.length > 0,
      `service "${service.id}" has no project and no caveat explaining that`,
    )
  }
})

test('every service links somewhere real', () => {
  for (const service of services) {
    const { href } = service.cta
    assert.ok(href.length > 0, `service "${service.id}" has an empty CTA`)
    assert.ok(
      href.startsWith('http') || href.startsWith('/') || href.startsWith('#'),
      `service "${service.id}" has a CTA that is neither a URL, a route nor an anchor: "${href}"`,
    )
  }
})

test('the case study a service points at is the one the project owns', () => {
  // The "Proven by" link renders `project.caseStudyHref`. A service whose
  // project has no case study renders no link rather than a dead one.
  for (const service of services) {
    if (service.provenBy === undefined) continue
    const project = projectById(service.provenBy)
    if (project.caseStudyHref === undefined) continue
    assert.match(
      project.caseStudyHref,
      /^\/case-study-[a-z-]+\.html$/,
      `project "${project.id}" has a case study href that is not a built page: "${project.caseStudyHref}"`,
    )
  }
})

test('no project is presented as unfinished, because none is', () => {
  // The homepage renders an "In development" group for any project that is not
  // featured. Every project is currently complete and featured, so that group
  // is empty — and it must stay empty rather than being filled to populate a
  // filter. If this ever fails, the data changed and the claim should be
  // checked before the UI is.
  //
  // "Live" is a stricter claim than "featured": it additionally asserts a
  // public deployment exists. p1–p3 still make that claim; p4–p6 do not —
  // there is no public deployment to claim — so their status is "Built",
  // never "In development", and Projects.tsx already renders that honestly
  // (no "· Deployed" badge, no demo button).
  const deployed: ProjectId[] = ['p1', 'p2', 'p3']

  for (const project of projects) {
    if (deployed.includes(project.id)) {
      assert.equal(project.status, 'Live', `project "${project.id}" is no longer live`)
    } else {
      assert.notEqual(
        project.status,
        'In development',
        `project "${project.id}" is presented as unfinished`,
      )
    }
    assert.equal(project.featured, true, `project "${project.id}" is no longer featured`)
  }
})

test('the verified proof figures are unchanged', () => {
  // These are reproduced by running each project's own suite — p1–p3 in
  // this monorepo, p4–p6 in their own standalone repository. They are the
  // portfolio's load-bearing claims, so they are pinned here: changing one
  // should require changing this line and saying why.
  const expected: Record<ProjectId, string[]> = {
    p1: ['206 tests', '16/16 eval'],
    p2: ['895 tests', '10/10 eval'],
    p3: ['346 tests', 'deterministic scoring'],
    p4: ['88 tests', 'deterministic, credential-free demo'],
    p5: ['494 tests', 'deterministic, credential-free demo'],
    p6: ['1,660 tests'],
  }

  for (const project of projects) {
    assert.deepEqual(project.proof, expected[project.id])
  }
})

test('every project keeps all four of its destinations', () => {
  // p1–p3 are the original, fully-showcased flagships: a case study, an
  // in-browser demo, a deployed instance and a repository. p4–p6 are
  // approved but have no case-study page or in-browser demo built yet, and
  // no public deployment to link — deliberate, not a lost link — so only
  // repoHref is required of them for now.
  const fullyLinked: ProjectId[] = ['p1', 'p2', 'p3']
  const allDestinations = ['caseStudyHref', 'interactiveDemoHref', 'demoHref', 'repoHref'] as const

  for (const project of projects) {
    const keys = fullyLinked.includes(project.id) ? allDestinations : (['repoHref'] as const)
    for (const key of keys) {
      const value = project[key]
      assert.ok(
        typeof value === 'string' && value.length > 0,
        `project "${project.id}" lost its ${key}`,
      )
    }
  }
})
