# S Mohammad Syed Sameer — AI / GenAI Engineer Portfolio

## Overview

This repository is the source for the portfolio site of S Mohammad Syed Sameer, an AI Automation Engineer. It presents six AI engineering projects — three with live, publicly reachable deployments and three shipped as tested, standalone systems — each backed by real source code, automated tests, and (where applicable) a running demo.

The work represented here centers on retrieval-augmented generation, tool-calling agents, document intelligence, voice AI, and the deterministic validation and evaluation layers that make an LLM-backed system trustworthy enough to ship. Every claim on the site is written to be checked against the linked repository behind it — nothing here is aspirational.

## Featured Projects

### AI Customer Support & Sales Recovery
An AI support agent that answers customer questions from a business's own policies and live data, remembers the conversation, and detects buying-hesitation signals to help recover otherwise-lost sales.
- **Engineering focus:** retrieval-augmented generation, tool-calling for order/stock lookups, conversation memory, guardrails, an evaluation harness
- **Technologies:** RAG, hybrid retrieval, LLM tool-calling, PostgreSQL
- **Repository:** [sales-recovery-agent](https://github.com/S-MOHAMMAD-SYED-SAMEER/sales-recovery-agent)

### Inbox-to-CRM Agent
Reads incoming business email, matches it against CRM records, drafts a reply, and logs the work — with a human approval gate on anything consequential, so nothing is sent without sign-off.
- **Engineering focus:** email understanding and CRM matching, human-in-the-loop approval, prompt-injection containment, an evaluation harness
- **Technologies:** LLM agents, tool-calling, PostgreSQL
- **Repository:** [inbox-crm-agent](https://github.com/S-MOHAMMAD-SYED-SAMEER/inbox-crm-agent)

### Explainable ATS
Ranks candidates against a job specification and explains every placement with the exact sentence from their CV that earned it, with personal details masked before the model sees the document and the recruiter's final decision recorded alongside the evidence.
- **Engineering focus:** evidence extraction and verification, deterministic scoring, PII redaction, an append-only decision record
- **Technologies:** LLM extraction, deterministic ranking logic, PostgreSQL
- **Repository:** [explainable-ats](https://github.com/S-MOHAMMAD-SYED-SAMEER/explainable-ats)

### KnowledgeOS
Retrieval-grounded answers over internal documents: hybrid search and a local reranker find the evidence, and every citation is checked against the source document in Python before an answer is shown.
- **Engineering focus:** hybrid retrieval and reranking, citation validation, a credential-free deterministic demo mode
- **Technologies:** PostgreSQL + pgvector, RAG, Docker
- **Repository:** [knowledgeos](https://github.com/S-MOHAMMAD-SYED-SAMEER/knowledgeos)

### DocIntel
Extracts structured data from invoices and purchase orders, validates it deterministically outside the model, scores per-field confidence, and routes anything uncertain to a human review queue.
- **Engineering focus:** structured extraction, deterministic field validation, confidence scoring, human review routing
- **Technologies:** FastAPI, PostgreSQL, Docker
- **Repository:** [docintel](https://github.com/S-MOHAMMAD-SYED-SAMEER/docintel)

### VoiceDesk
An AI phone receptionist that understands the caller, checks and books appointments in a real calendar, and hands off to a human when it should.
- **Engineering focus:** real-time voice pipeline, tool-calling against a live calendar, offline demo mode with bounded session limits
- **Technologies:** speech-to-text/text-to-speech, telephony integration, PostgreSQL
- **Repository:** [voicedesk](https://github.com/S-MOHAMMAD-SYED-SAMEER/voicedesk)

Sales Recovery, Inbox-to-CRM, and Explainable ATS each have a public deployment linked from their case-study page. KnowledgeOS, DocIntel, and VoiceDesk are complete, tested systems without a public deployment — their case studies link to the source repository and, where one exists, a credential-free demo mode documented in that project's own README.

## Interactive Experience

Three of the six projects — Sales Recovery, Inbox-to-CRM, and Explainable ATS — have an interactive demo page in this portfolio, built as a self-contained browser simulation over invented data. Each demo walks through the same staged sequence the real system follows and is explicit, on the page itself, about what it is: no network call, no model, no account, and no backend of any kind.

A separate 3D experience (`/3d.html`) presents the same project information as an explorable scene, built with Three.js and React Three Fiber. It is isolated into its own code path so visitors who never open it do not download its renderer.

## Portfolio Sections / Pages

- `index.html` — the main site: hero, about, skills, services, project cards, and contact
- `3d.html` — the 3D interactive experience
- `case-study-sales-recovery.html`, `case-study-inbox-crm.html`, `case-study-explainable-ats.html`, `case-study-knowledgeos.html`, `case-study-docintel.html`, `case-study-voicedesk.html` — one written case study per project
- `demo-sales-recovery.html`, `demo-inbox-crm.html`, `demo-explainable-ats.html` — the three interactive, deterministic project demos

## Technology

- **React 19** with **TypeScript**
- **Vite** — multi-page build, one entry point per HTML page above
- **Tailwind CSS v4** — via the official Vite plugin, CSS-first configuration
- **Three.js**, **React Three Fiber**, and **drei** — the 3D experience only, isolated from the rest of the site so other pages never load them
- **oxlint** for linting; Node's built-in test runner (`node --test`) for tests

## Local Development

```bash
npm install
npm run dev         # start the development server
npm test             # run the test suite
npm run typecheck    # type-check the project
npm run build         # production build (typecheck + vite build)
```

## Repository Structure

```
src/
  components/      shared site components (Hero, About, Skills, Services, Projects, Contact, Footer, ...)
  pages/           the six case-study page components
  demo/            the three interactive demo pages and their shared shell
  three/           the self-contained 3D experience (its own data, components, hooks, systems)
  data/            project, service, skill and contact data
public/
  images/          real screenshots used by the case studies
tests/             test suite (project data, 3D experience state, motion, workshop areas)
index.html, 3d.html, case-study-*.html, demo-*.html   multi-page entry points
```

## Engineering Notes

- **Multi-page Vite build.** Every page above is a real, separately-built static entry point rather than a client-side route, so each has a genuine URL with no router or rewrite rule required.
- **Deterministic demo presentation.** The three interactive demos run entirely client-side over fixed, invented data, deliberately kept separate from the deployed production applications they describe.
- **Isolated 3D experience.** The 3D code path is self-contained by design — its own data and component tree, reachable only from `3d.html` — so the cost of Three.js and React Three Fiber is never paid by a visitor reading a case study.
- **Single source of project data.** Project facts (status, links, proof points) live once in `src/data/projects.ts` and are read by the homepage cards, the case studies, and the demo pages alike, rather than being duplicated across each.

## Demo Disclosure

The interactive project demos in this portfolio are deterministic presentation/demo layers. They do not represent live execution of the production AI pipelines unless explicitly stated otherwise.

## Links

- GitHub profile: [github.com/S-MOHAMMAD-SYED-SAMEER](https://github.com/S-MOHAMMAD-SYED-SAMEER)
- LinkedIn: [linkedin.com/in/mohammad-syed-sameer-s-a879a235a](https://www.linkedin.com/in/mohammad-syed-sameer-s-a879a235a)
- Email: mohammadsyedsameer20@gmail.com
