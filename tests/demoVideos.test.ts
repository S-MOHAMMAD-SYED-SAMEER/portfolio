import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

import { RESULTS_IMAGES } from '../src/data/resultsImages.ts'

/**
 * The six case studies carry the same demo video and the same results image, so the rules that make them safe to ship are
 * checked once, for all six: the file is small enough to be fetched on a phone, it can start before it has finished
 * downloading, the page puts it under the summary with the standard caption, the results image is a WebP whose alt text
 * is the slide's own words, and the resume the nav and the hero point at is a real file under its own name.
 */

const ROOT = join(import.meta.dirname, '..')
const read = (path: string) => readFileSync(join(ROOT, path), 'utf8')

const CASE_STUDIES = [
  { id: 'explainable-ats', page: 'ExplainableAtsCaseStudy' },
  { id: 'knowledgeos', page: 'KnowledgeOsCaseStudy' },
  { id: 'docintel', page: 'DocIntelCaseStudy' },
  { id: 'voicedesk', page: 'VoiceDeskCaseStudy' },
  { id: 'inbox-crm-agent', page: 'InboxToCrmCaseStudy' },
  { id: 'sales-recovery-agent', page: 'SalesRecoveryCaseStudy' },
] as const

test('each demo video is at most 8 MB, starts with its index (faststart), and has a poster and captions', () => {
  for (const { id } of CASE_STUDIES) {
    const video = join(ROOT, `public/videos/${id}-clean-16x9.mp4`)
    for (const file of [video, join(ROOT, `public/videos/${id}-clean-poster.jpg`), join(ROOT, `public/videos/${id}.vtt`)]) {
      assert.ok(existsSync(file), `${file} is missing`)
    }
    assert.ok(statSync(video).size <= 8_000_000, `${id}: the video is over 8 MB`)
    // "+faststart" puts the moov box before the media data, so playback starts before the download ends.
    const head = readFileSync(video).subarray(0, 4096).toString('latin1')
    assert.ok(head.includes('moov'), `${id}: the moov box is not at the start of the file`)
    assert.ok(head.indexOf('moov') < (head.indexOf('mdat') === -1 ? Infinity : head.indexOf('mdat')), `${id}: mdat comes before moov`)
  }
})

test('the shared player starts muted, fetches nothing until pressed, and keeps a fixed 16:9 box', () => {
  const component = read('src/components/CaseStudyVideo.tsx')
  assert.match(component, /\bcontrols\b/)
  assert.match(component, /\bmuted\b/)
  assert.match(component, /preload="none"/)
  assert.match(component, /playsInline/)
  assert.match(component, /aspect-video/)
})

test('every case study puts the demo video under its summary with the standard caption', () => {
  const component = read('src/components/CaseStudyVideo.tsx')
  assert.match(component, /"Demo: the real app on a real model, fictional data, AI voice narration\."/)
  for (const { id, page } of CASE_STUDIES) {
    const source = read(`src/pages/${page}.tsx`)
    assert.match(source, new RegExp(`src="/videos/${id}-clean-16x9\\.mp4"`), `${page} does not use the clean cut`)
    assert.match(source, new RegExp(`poster="/videos/${id}-clean-poster\\.jpg"`))
    assert.ok(!/-16x9\.mp4|-1x1\.mp4|-4x5\.mp4/.test(source.replace(/-clean-16x9\.mp4/g, '')), `${page} still points at an older cut`)
    assert.match(source, /caption=\{[^}]*DEMO_CAPTION/)
    // The video sits in the hero, before the first section that follows it.
    assert.ok(source.indexOf('<CaseStudyVideo') < source.indexOf('{/* 2. '), `${page}: the video is not in the hero`)
    assert.equal(source.split('<CaseStudyVideo').length - 1, 1, `${page} has more than one video`)
  }
})

test('VoiceDesk says that voice and phone are not connected, in the caption under its video', () => {
  const source = read('src/pages/VoiceDeskCaseStudy.tsx')
  assert.match(source, /Typed text only\. Voice and phone are not connected yet\./)
})

test('every results image is a WebP that exists, with the slide\'s numbers and limits as its alt text', () => {
  for (const { id, page } of CASE_STUDIES) {
    const image = RESULTS_IMAGES[id]
    assert.equal(image.src, `/images/${id}-results.webp`)
    assert.ok(existsSync(join(ROOT, `public${image.src}`)), `${image.src} is missing`)
    const bytes = readFileSync(join(ROOT, `public${image.src}`))
    assert.equal(bytes.subarray(0, 4).toString('latin1'), 'RIFF')
    assert.equal(bytes.subarray(8, 12).toString('latin1'), 'WEBP')
    assert.match(image.alt, /What was measured\./)
    assert.match(image.alt, /Limits: /)
    assert.match(read(`src/pages/${page}.tsx`), new RegExp(`RESULTS_IMAGES\\["${id}"\\]`))
  }
  assert.match(RESULTS_IMAGES['explainable-ats'].alt, /86\.8% Verdicts matching the labels \(one run\)/)
  assert.match(RESULTS_IMAGES['explainable-ats'].alt, /not an independent human labelling/)
  assert.match(RESULTS_IMAGES['voicedesk'].alt, /Typed text only\. Voice and phone are not connected yet\./)
})

test('the resume is served under its own name and linked from the nav and the hero', () => {
  const name = 'Mohammad_Syed_Sameer_AI_Engineer_Resume.pdf'
  const file = join(ROOT, 'public', name)
  assert.ok(existsSync(file), 'the resume is missing from public/')
  assert.equal(readFileSync(file).subarray(0, 4).toString('latin1'), '%PDF')
  assert.match(read('src/data/contact.ts'), new RegExp(`RESUME_URL: string = "/${name}"`))
  for (const component of ['Nav', 'Hero']) {
    const source = read(`src/components/${component}.tsx`)
    assert.match(source, /RESUME_URL/)
    assert.match(source, /Resume \(PDF\)/)
  }
})
