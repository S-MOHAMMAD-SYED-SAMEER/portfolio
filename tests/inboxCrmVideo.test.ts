import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

/**
 * The Inbox-to-CRM case study's demo video: the files exist, the captions are a real WebVTT track with timed cues of the
 * spoken text, the case study uses the shared player (which is the accessible kind: controls, metadata only, inline on a
 * phone, a poster, an English captions track that is available but NOT on by default), and the caption under it says
 * what the recording is and is not.
 */

const ROOT = join(import.meta.dirname, '..')
const read = (path: string) => readFileSync(join(ROOT, path), 'utf8')

test('the video, its poster and its captions exist and are a sensible size', () => {
  for (const file of ['public/videos/inbox-crm-agent-16x9.mp4', 'public/videos/inbox-crm-agent-poster.jpg', 'public/videos/inbox-crm-agent.vtt']) {
    assert.ok(existsSync(join(ROOT, file)), `${file} is missing`)
  }
  const mb = statSync(join(ROOT, 'public/videos/inbox-crm-agent-16x9.mp4')).size / 1e6
  assert.ok(mb > 1 && mb < 50, `the video is ${mb.toFixed(1)} MB`)
})

test('the captions are WebVTT with timed, non-overlapping cues of the spoken text', () => {
  const vtt = read('public/videos/inbox-crm-agent.vtt')
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
  assert.match(vtt, /These ten emails are invented/)
  assert.match(vtt, /nothing is ever sent/)
})

test('the case study uses the shared player, with a caption that says what the recording is', () => {
  const component = read('src/components/CaseStudyVideo.tsx')
  assert.match(component, /preload="metadata"/)
  assert.ok(!/<track[^>]*\bdefault\b/.test(component), 'the captions track is marked default')

  const page = read('src/pages/InboxToCrmCaseStudy.tsx')
  assert.match(page, /<CaseStudyVideo/)
  assert.match(page, /src="\/videos\/inbox-crm-agent-16x9\.mp4"/)
  assert.match(page, /poster="\/videos\/inbox-crm-agent-poster\.jpg"/)
  assert.match(page, /captions="\/videos\/inbox-crm-agent\.vtt"/)
  for (const claim of ['live Gemini run', '2026-10-18', 'invented', 'AI-voice', 'not hosted']) {
    assert.ok(page.includes(claim), `the video caption does not say "${claim}"`)
  }
})
