import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

/**
 * The Explainable ATS case study's demo video: the files exist, the captions are a real WebVTT track with timed cues of the
 * spoken text, the case study uses the shared player (controls, metadata only, inline on a phone, a poster, an English
 * captions track that is available but NOT on by default), and the caption under it says what the recording is and is not.
 */

const ROOT = join(import.meta.dirname, '..')
const read = (path: string) => readFileSync(join(ROOT, path), 'utf8')

test('the video, its poster and its captions exist and are a sensible size', () => {
  for (const file of ['public/videos/explainable-ats-clean-16x9.mp4', 'public/videos/explainable-ats-clean-poster.jpg', 'public/videos/explainable-ats.vtt']) {
    assert.ok(existsSync(join(ROOT, file)), `${file} is missing`)
  }
  const mb = statSync(join(ROOT, 'public/videos/explainable-ats-clean-16x9.mp4')).size / 1e6
  assert.ok(mb > 1 && mb <= 8, `the video is ${mb.toFixed(1)} MB`)
})

test('the captions are WebVTT with timed, non-overlapping cues of the spoken text', () => {
  const vtt = read('public/videos/explainable-ats.vtt')
  assert.ok(vtt.startsWith('WEBVTT'))
  const cues = [...vtt.matchAll(/^(\d\d:\d\d:\d\d\.\d{3}) --> (\d\d:\d\d:\d\d\.\d{3})/gm)]
  assert.ok(cues.length >= 10, `only ${cues.length} cues`)
  assert.ok(!/\d\d:\d\d:\d\d,\d{3}/.test(vtt), 'an SRT timestamp is in the VTT')
  const seconds = (t: string) => t.split(':').reduce((n, part) => n * 60 + Number(part), 0)
  let previousEnd = 0
  for (const [, start, end] of cues) {
    assert.ok(seconds(end!) > seconds(start!), `cue ${start} ends before it starts`)
    assert.ok(seconds(start!) >= previousEnd - 0.001, `cue ${start} overlaps the one before`)
    previousEnd = seconds(end!)
  }
  // The honest limits are in the spoken text, not only in the page.
  assert.match(vtt, /invented/)
  assert.match(vtt, /not an independent human labelling/)
  assert.match(vtt, /not an accuracy figure/)
})

test('the case study uses the shared player, with a caption that says what the recording is', () => {
  const component = read('src/components/CaseStudyVideo.tsx')
  assert.match(component, /preload="none"/)
  assert.ok(!/<track[^>]*\bdefault\b/.test(component), 'the captions track is marked default')

  const page = read('src/pages/ExplainableAtsCaseStudy.tsx')
  assert.match(page, /<CaseStudyVideo/)
  assert.match(page, /src="\/videos\/explainable-ats-clean-16x9.mp4"/)
  assert.match(page, /poster="\/videos\/explainable-ats-clean-poster.jpg"/)
  assert.match(page, /captions="\/videos\/explainable-ats\.vtt"/)
  for (const claim of ['Claude Haiku 4.5', '2026-10-19', 'invented', 'Narration: AI voice', 'second take', 'waiting for the model is cut']) {
    assert.ok(page.includes(claim), `the video caption does not say "${claim}"`)
  }
})
