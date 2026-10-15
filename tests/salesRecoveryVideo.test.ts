import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

/**
 * The Sales-Recovery case study's demo video: the files exist, the captions are a real WebVTT track, the player is
 * the accessible kind (controls, metadata only, inline on a phone, a poster, an English captions track that is
 * available but NOT on by default, because short captions are already burned into the picture), and the numbers on the page are the repository's current ones, not an older run's.
 */

const ROOT = join(import.meta.dirname, '..')
const read = (path: string) => readFileSync(join(ROOT, path), 'utf8')

test('the video, its poster and its captions exist and are a sensible size', () => {
  for (const file of ['public/videos/sales-recovery-agent-16x9.mp4', 'public/videos/sales-recovery-agent-poster.jpg', 'public/videos/sales-recovery-agent.vtt']) {
    assert.ok(existsSync(join(ROOT, file)), `${file} is missing`)
  }
  const mb = statSync(join(ROOT, 'public/videos/sales-recovery-agent-16x9.mp4')).size / 1e6
  assert.ok(mb > 1 && mb < 50, `the video is ${mb.toFixed(1)} MB`)
})

test('the captions are WebVTT with timed cues of the spoken text', () => {
  const vtt = read('public/videos/sales-recovery-agent.vtt')
  assert.ok(vtt.startsWith('WEBVTT'))
  const cues = [...vtt.matchAll(/^(\d\d:\d\d:\d\d\.\d{3}) --> (\d\d:\d\d:\d\d\.\d{3})/gm)]
  assert.ok(cues.length >= 10, `only ${cues.length} cues`)
  // WebVTT uses a full stop before the milliseconds; the SRT comma would make the cue invalid.
  assert.ok(!/\d\d:\d\d:\d\d,\d{3}/.test(vtt), 'an SRT timestamp is in the VTT')
  const seconds = (t: string) => t.split(':').reduce((n, part) => n * 60 + Number(part), 0)
  let previousEnd = 0
  for (const [, start, end] of cues) {
    assert.ok(seconds(end!) > seconds(start!), `cue ${start} ends before it starts`)
    assert.ok(seconds(start!) >= previousEnd - 0.001, `cue ${start} overlaps the one before`)
    previousEnd = seconds(end!)
  }
  assert.match(vtt, /Switch to Operator/)
})

test('the player has controls, loads metadata only, plays inline, has a poster and an English captions track that is off until the viewer turns it on', () => {
  const component = read('src/components/CaseStudyVideo.tsx')
  assert.match(component, /\bcontrols\b/)
  assert.match(component, /preload="metadata"/)
  assert.match(component, /\bplaysInline\b/)
  assert.match(component, /poster=\{poster\}/)
  // The track is there (the viewer can turn CC on) but is not the default one, so only the burned-in captions show at first.
  assert.match(component, /<track kind="captions" src=\{captions\} srcLang="en" label="English" \/>/)
  assert.ok(!/<track[^>]*\bdefault\b/.test(component), 'the captions track is marked default')
  assert.match(component, /aspect-video/)
  assert.match(component, /aria-label=\{label\}/)
})

test('the case study uses the video, with a caption that says what it is', () => {
  const page = read('src/pages/SalesRecoveryCaseStudy.tsx')
  assert.match(page, /<CaseStudyVideo/)
  assert.match(page, /src="\/videos\/sales-recovery-agent-16x9\.mp4"/)
  assert.match(page, /poster="\/videos\/sales-recovery-agent-poster\.jpg"/)
  assert.match(page, /captions="\/videos\/sales-recovery-agent\.vtt"/)
  for (const claim of ['live Gemini run', '2026-10-15', 'fictional', 'AI voice']) {
    assert.ok(page.includes(claim), `the video caption does not say "${claim}"`)
  }
})

test('the videos can be used from the 3D site: cross-origin captions need a CORS header', () => {
  const config = JSON.parse(read('vercel.json')) as { headers?: { source: string; headers: { key: string; value: string }[] }[] }
  const rule = config.headers?.find((h) => h.source.startsWith('/videos/'))
  assert.ok(rule, 'no header rule for /videos')
  assert.ok(rule.headers.some((h) => h.key === 'Access-Control-Allow-Origin' && h.value === '*'))
})

test('the Sales-Recovery numbers are the repository\'s current ones, in every file that states them', () => {
  const page = read('src/pages/SalesRecoveryCaseStudy.tsx')
  const projects = read('src/data/projects.ts')
  const results = read('src/components/caseStudy/ResultsPanel.tsx')
  assert.match(page, /529 \/ 529/)
  assert.match(page, /529-test/)
  assert.match(page, /40 files/)
  assert.match(projects, /"529 tests"/)
  assert.match(results, /figure: "529"/)
  // the old count must not survive anywhere on the page's sources
  for (const [name, source] of [['case study', page], ['projects', projects], ['results panel', results], ['3D scene data', read('src/three/data/projects.ts')]] as const) {
    assert.ok(!/\b372\b/.test(source), `${name} still says 372`)
  }
  // and the old screenshots are gone from every reference
  for (const old of ['p1-grounded-answer', 'p1-policy-grounding', 'p1-order-or-stock-lookup', 'p1-buying-signal-recovery']) {
    for (const file of ['src/pages/SalesRecoveryCaseStudy.tsx', 'src/data/projects.ts', 'src/three/data/projects.ts']) {
      assert.ok(!read(file).includes(old), `${file} still references ${old}`)
    }
    assert.ok(!existsSync(join(ROOT, `public/images/${old}.png`)), `${old}.png is still shipped`)
  }
})

test('every Sales-Recovery screenshot the pages reference exists, with the intrinsic size it declares', () => {
  const sources = ['src/pages/SalesRecoveryCaseStudy.tsx', 'src/data/projects.ts', 'src/three/data/projects.ts'].map(read).join('\n')
  const declared = [...sources.matchAll(/src[=:]\s*["']\/images\/(p1-[a-z-]+\.png)["'][\s\S]*?width[=:]\s*\{?(\d+)\}?[\s\S]*?height[=:]\s*\{?(\d+)/g)]
  assert.ok(new Set(declared.map((m) => m[1])).size >= 6, `only ${declared.length} screenshot references found`)
  for (const [, file, w, h] of declared) {
    const full = join(ROOT, 'public/images', file!)
    assert.ok(existsSync(full), `${file} is referenced but not shipped`)
    const header = readFileSync(full).subarray(0, 24)
    assert.equal(header.subarray(1, 4).toString('latin1'), 'PNG', `${file} is not a PNG`)
    assert.equal(`${header.readUInt32BE(16)}x${header.readUInt32BE(20)}`, `${w}x${h}`, `${file} declares ${w}x${h}`)
  }
})
