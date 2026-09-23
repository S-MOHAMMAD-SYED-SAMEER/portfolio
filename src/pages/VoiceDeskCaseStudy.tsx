import Footer from "../components/Footer";
import SkipLink from "../components/SkipLink";
import ThemeToggle from "../components/ThemeToggle";
import { enquiryMailto } from "../data/contact";
import { projectById, requiredLink } from "../data/projects";
import VoiceDeskFlow from "../components/caseStudy/VoiceDeskFlow";
import Callout from "../components/caseStudy/Callout";
import ResultsPanel, { type Result } from "../components/caseStudy/ResultsPanel";
import Section from "../components/Section";

/**
 * This page's project, from the canonical data. See the equivalent comment
 * on the other case studies for why the lookup goes through the id rather
 * than any string that could independently drift.
 *
 * VoiceDesk has no `demoHref` or `interactiveDemoHref` — there is no public
 * deployment and no in-browser simulation, so this page is GitHub-first
 * throughout. Only `repoHref` is asserted with `requiredLink`.
 *
 * Every claim below is sourced from the standalone repository's own code
 * and README at the commit this case study was written from. Where a claim
 * describes a test suite or an evaluation run, it names what actually
 * produced the number — a real database-backed test run, or a scripted,
 * non-Claude evaluation harness — rather than leaving that ambiguous.
 */
const PROJECT = projectById("p6");
const REPO_URL = requiredLink(PROJECT, "repoHref");
const README_URL = `${REPO_URL}/blob/main/README.md`;

const STACK = [
  { name: "Python", role: "Application language" },
  { name: "FastAPI", role: "HTTP and WebSocket layer" },
  { name: "PostgreSQL", role: "Calendar and call state — required by the application itself, including the browser demo" },
  { name: "SQLAlchemy", role: "Data access, including the calendar's exclusion-constraint handling" },
  { name: "Alembic", role: "Schema migrations" },
  { name: "Anthropic", role: "The dialogue LLM — the only model provider, no offline substitute" },
  { name: "Deepgram", role: "Optional real speech-to-text provider, behind a provider interface" },
  { name: "ElevenLabs", role: "Optional real text-to-speech provider, behind a provider interface" },
  { name: "Twilio", role: "Telephony transport for the media stream" },
  { name: "WebSockets", role: "The browser harness and streaming transports" },
  { name: "pytest", role: "The test suite" },
  { name: "Docker / Docker Compose", role: "Application and demo packaging" },
];

/**
 * Verified engineering figures, reproduced from the repository's own
 * documentation — a real database-backed pytest run and a scripted
 * evaluation harness, not a claim about voice quality or real-model
 * performance. See the caption for the qualification that matters most.
 */
const RESULTS: Result[] = [
  {
    figure: "1,661",
    label: "Tests passing",
    detail:
      "1,661 collected, with a PostgreSQL database available — the repository's own documented, database-backed count.",
  },
  {
    figure: "1,053 / 608",
    label: "No-PostgreSQL run",
    detail:
      "1,053 pass, 608 skip — tests that need a database skip cleanly rather than failing when one isn't available.",
  },
  {
    figure: "18 / 18",
    label: "Scripted evaluation",
    detail:
      "18 scenarios, 18 passed, task success 100% — against ScriptedModel, a model that answers from a fixed script.",
  },
];

const RESULTS_CAPTION =
  "The scripted evaluation measures VoiceDesk's own tool-calling, guard and calendar logic against a scripted model — it does not measure Claude, real transcription, real voice quality or real provider behaviour, and it is not evidence of real-call performance. No external service has ever been called from this repository.";

export default function VoiceDeskCaseStudy() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur">
        <SkipLink />
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <a href="/#projects" className="text-small font-semibold text-ink">
            ← AI Business Automation
          </a>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* GitHub-first: this project has no live deployment, so the
                filled primary slot the other case studies give their demo
                goes to the repository instead. */}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-control bg-brand px-4 py-2 text-small font-semibold text-white hover:bg-brand/90"
            >
              View on GitHub
            </a>
          </div>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        {/* 1. HERO */}
        <section className="mx-auto max-w-5xl px-6 pb-4 pt-16 sm:pt-20">
          <p className="text-eyebrow uppercase text-brand">Voice AI</p>
          <h1 className="mt-4 max-w-3xl text-display-sm text-ink sm:text-display">
            {PROJECT.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-muted">
            VoiceDesk connects realtime voice and session handling to
            tool-calling, calendar state and PostgreSQL persistence — one
            dialogue path that a browser harness and a telephony call both
            run, only the audio transport differing between them.
          </p>
          <p className="mt-4 max-w-2xl text-body font-semibold text-ink">
            The hard part is not speech — it&apos;s knowing when to stop
            talking and escalate.
          </p>
          <div className="flex flex-wrap gap-4 pt-8">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-control bg-brand px-6 py-3 text-small font-semibold text-white hover:bg-brand/90"
            >
              View on GitHub
            </a>
            <a
              href={README_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-control border border-line-strong px-6 py-3 text-small font-semibold text-ink hover:border-ink-muted"
            >
              Read the README
            </a>
          </div>
          <p className="mt-4 text-meta text-ink-muted">
            A standalone repository with no public deployment. Nothing here
            has answered a real customer call — see Production boundary
            below for exactly what has, and hasn&apos;t, been demonstrated.
          </p>
        </section>

        {/* 2. PROBLEM */}
        <Section eyebrow="The problem" title="More than transcribing speech">
          <p className="max-w-3xl text-body text-ink-muted">
            A voice assistant that only transcribes and replies isn&apos;t
            a receptionist. Speech has to become a structured turn; a turn
            may need to trigger a real business action; and a business
            action like booking an appointment mutates calendar state that
            other callers share.
          </p>
          <ul className="mt-4 flex max-w-3xl flex-col gap-2 text-small text-ink-muted">
            <li>
              Availability can&apos;t simply be invented by the model — it
              has to come from a real check.
            </li>
            <li>
              A booking conflict between two callers has to be resolved by
              authoritative application and database state, not by whichever
              reply happened to go out first.
            </li>
            <li>
              When the assistant should stop and hand off to a person, that
              has to be represented honestly rather than talked around.
            </li>
          </ul>
        </Section>

        {/* 3. SOLUTION */}
        <Section eyebrow="The solution" title="One dialogue path, two transports">
          <p className="max-w-3xl text-body text-ink-muted">
            Audio comes in from a caller or a browser, becomes text, becomes
            one turn of a conversation, and — when the model decides to call
            a tool — reaches an application action against a real calendar
            before a reply is synthesised back to audio:
          </p>
          <p className="mt-4 max-w-3xl text-small font-semibold text-ink">
            caller/browser → speech input → turn manager → LLM tool use →
            ToolExecutor → application tools → CalendarService / PostgreSQL
            → text-to-speech → audio response
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The browser harness and telephony are two transports for the
            same path: both reach the same Conversation, the same
            ToolExecutor, the same application tools and the same
            CalendarService. The audio in and out differs; the dialogue and
            business-action logic between them does not.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The architecture deliberately keeps provider implementations
            (speech and the language model) behind provider interfaces,
            keeps the six application tools independent of any provider or
            telephony library, keeps calendar logic inside CalendarService,
            and keeps persistence in PostgreSQL. None of that implies an
            external provider has actually been exercised — see How the
            voice pipeline works and Production boundary below.
          </p>
        </Section>

        {/* 4. HOW THE VOICE PIPELINE WORKS */}
        <Section eyebrow="How it works" title="Caller audio to a spoken reply">
          <VoiceDeskFlow />
          <p className="mt-6 max-w-3xl text-small text-ink-muted">
            Speech-to-text defaults to an offline provider and can be
            switched to Deepgram. Text-to-speech defaults to an offline
            provider and can be switched to ElevenLabs. The dialogue model
            is Anthropic only — there is no offline language model, so a
            real Anthropic credential is required for any real dialogue
            turn, including in the browser harness. The browser demo is not
            credential-free.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The offline providers are deterministic stand-ins, not speech
            recognition or synthesis: offline speech-to-text returns a
            fixed, canned transcript regardless of what was said, and
            offline text-to-speech returns a 220&nbsp;Hz sine tone rather
            than a synthesised voice. They remove the speech-provider
            network requirement; they do not demonstrate real transcription
            or real audio output.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            A streaming realtime path also exists — voice-activity
            detection, endpointing and barge-in cancellation — but it is
            off by default, and no real provider round-trip through it has
            been demonstrated in this repository.
          </p>
        </Section>

        {/* 5. TOOL-CALLING AND BUSINESS ACTIONS */}
        <Section eyebrow="Tool-calling" title="Six tools, not free text">
          <p className="max-w-3xl text-body text-ink-muted">
            The assistant does not act on a caller&apos;s request by
            writing prose — it calls one of six tools, each a plain,
            independently testable function.
          </p>
          <ul className="mt-4 flex max-w-3xl flex-col gap-3 text-small text-ink-muted">
            <li>
              <strong className="text-ink">check_availability</strong> —
              reads real, computed calendar slots; it never invents a time.
            </li>
            <li>
              <strong className="text-ink">book_appointment</strong> —
              writes a new appointment. The database constraint is the
              authority on a conflict, and the tool executor additionally
              refuses the call unless that exact slot was returned by an
              earlier, successful check_availability in the same
              conversation.
            </li>
            <li>
              <strong className="text-ink">reschedule</strong> — moves an
              existing appointment, deriving the service from the
              appointment itself rather than from the caller&apos;s
              argument. It is deliberately not checked against the same
              offered-slot ledger book_appointment is.
            </li>
            <li>
              <strong className="text-ink">cancel</strong> — a soft cancel:
              the row is kept and marked cancelled, which frees the slot
              under the database&apos;s partial exclusion constraint.
            </li>
            <li>
              <strong className="text-ink">take_message</strong> —
              validates the caller&apos;s name, phone number and message,
              and persists them through the application&apos;s own turn and
              tool-call records.
            </li>
            <li>
              <strong className="text-ink">transfer_to_human</strong> —
              records the intent and reason to escalate. It does not
              connect a human; nothing in this repository performs a live
              transfer.
            </li>
          </ul>
        </Section>

        {/* 6. CALENDAR / DATABASE CONSISTENCY */}
        <Section eyebrow="Calendar & database" title="Two callers, one slot, one winner">
          <p className="max-w-3xl text-body text-ink-muted">
            This is a database consistency guarantee, not a generic
            AI-safety claim. The authority on whether a slot is free is a
            PostgreSQL exclusion constraint:
          </p>
          <p className="mt-4 max-w-3xl text-small font-semibold text-ink">
            EXCLUDE USING gist ( staff_id WITH =, tstzrange(starts_at,
            ends_at, &apos;[)&apos;) WITH &amp;&amp; ) WHERE (status =
            &apos;booked&apos;)
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            It requires the btree_gist extension, and it scopes overlap to
            one staff member&apos;s diary — appointments.staff_id is
            denormalised from the service specifically so the constraint
            can reference it. Because it&apos;s partial (WHERE status =
            &apos;booked&apos;), a cancelled row stops holding its slot
            immediately.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            Availability is advisory; the write is authoritative. Booking
            and rescheduling don&apos;t check-then-insert — they attempt
            the write inside a savepoint (session.begin_nested()), and a
            PostgreSQL exclusion violation is translated into the domain
            error SlotUnavailable. Two callers racing for the same slot
            cannot both win, whatever order their requests arrive in.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            A second, application-level layer exists above the database:
            the tool executor keeps an in-memory ledger of the
            (service, instant) pairs a successful check_availability has
            actually returned in this conversation, and refuses
            book_appointment for anything not in it. reschedule is
            deliberately not gated by this same ledger — it relies on the
            database constraint alone.
          </p>
        </Section>

        {/* 7. THE DEFECT THE EVALUATION SUITE FOUND */}
        <Section eyebrow="Evaluation" title="A defect the evaluation suite caught">
          <Callout badge="!" heading="Found in milestone 9, fixed in milestone 10">
            <p className="mt-2 max-w-3xl text-small text-ink-muted">
              A refused reschedule — one PostgreSQL correctly rejected with
              an exclusion violation — could poison the SQLAlchemy
              transaction around it. Because reschedule performs an UPDATE
              rather than an INSERT, the failed write left the enclosing
              session transaction deactivated, and any later statement on
              that session raised PendingRollbackError — which could stop
              that call&apos;s transcript from being persisted at all.
            </p>
            <p className="mt-3 max-w-3xl text-small text-ink-muted">
              The fix is narrow: CalendarService._write now performs a
              session rollback on the IntegrityError path before raising
              the domain error, so the session stays usable for whatever
              the call does next.
            </p>
            <p className="mt-3 max-w-3xl text-small text-ink-muted">
              tests/test_calendar_recovery.py asserts the recovery at four
              layers — the calendar, the tool, the conversation and the
              cost recorder — because a fix that only holds at one of them
              is not a fix for an actual call. The defect does not exist in
              the current, fixed state; it&apos;s described here because an
              evaluation suite that never catches anything real isn&apos;t
              worth much, and this one did.
            </p>
          </Callout>
        </Section>

        {/* 8. BROWSER DEMO / BOUNDED HARNESS */}
        <Section eyebrow="The demo" title="A bounded browser harness">
          <p className="max-w-3xl text-body text-ink-muted">
            GET /harness serves a single vanilla-JavaScript page; WS
            /ws/harness is the call itself, supporting both a push-to-talk
            mode and a realtime streaming mode. The server always sends the
            JSON turn message before the binary audio that follows it, and
            the socket runs the same Conversation → ToolExecutor →
            application tools → CalendarService → PostgreSQL path telephony
            does — no Twilio credential is required to use it.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            An Anthropic credential still is: without one, the harness
            connects and plays its greeting, but every turn comes back as a
            failure rather than a reply. Speech defaults to the offline
            stand-ins described above.
          </p>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            The harness is closed entirely in production, whatever its
            enable flag says. While it is open, two bounds apply: a
            300-second maximum session and a 20-turn maximum, both checked
            against a monotonic timer and closed with the normal WebSocket
            close code 1000. These bounds exist to reduce runaway demo
            resource and usage exposure — they are not authentication and
            not a rate limit, and the harness otherwise remains
            unauthenticated.
          </p>
        </Section>

        {/* 9. ENGINEERING EVIDENCE */}
        <Section eyebrow="Engineering evidence" title="Verified, not claimed">
          <ResultsPanel results={RESULTS} caption={RESULTS_CAPTION} />
          <ul className="mt-6 flex flex-col gap-2 text-small text-ink-muted">
            <li>
              Under the scripted evaluation: tool correctness 26/26,
              hallucinated availability 0, escalation precision 4/4,
              escalation recall 4/4, and one unverified reschedule — flagged
              as non-blocking by design, because reschedule is not gated by
              the offered-slot ledger.
            </li>
            <li>
              None of the above are production voice-quality, transcription
              accuracy or call-completion metrics. No such figure exists in
              the repository.
            </li>
            <li>VoiceDesk has no CI workflow configured — these figures come from running the suite and the evaluation harness directly, not from an automated pipeline.</li>
            <li>
              No external provider — Anthropic, Deepgram, ElevenLabs or
              Twilio — has ever been called from this repository.
            </li>
          </ul>
        </Section>

        {/* 10. PRODUCTION BOUNDARY */}
        <Section eyebrow="Production boundary" title="What's implemented, and what's been run">
          <p className="max-w-3xl text-small font-semibold text-ink">
            Implemented
          </p>
          <p className="mt-2 max-w-3xl text-small text-ink-muted">
            Realtime/session architecture, provider boundaries, the
            conversation and tool-execution path, all six tools, the
            PostgreSQL calendar and its booking-conflict constraint, the
            browser harness, production preflight checks, separate
            readiness and liveness probes, a stream-token mechanism,
            admission limits, graceful shutdown and draining, structured
            logging with PII excluded from it, and a retention command that
            requires explicit confirmation before it deletes anything.
          </p>
          <p className="mt-6 max-w-3xl text-small font-semibold text-ink">
            Actually demonstrated by repository evidence
          </p>
          <p className="mt-2 max-w-3xl text-small text-ink-muted">
            The database-backed test suite, the browser harness&apos;s
            implementation, production-mode guard behaviour, health/ready
            behaviour, the scripted evaluation run, and tests that run
            against a real migrated PostgreSQL database.
          </p>
          <p className="mt-6 max-w-3xl text-small font-semibold text-ink">
            Requires real infrastructure or credentials
          </p>
          <p className="mt-2 max-w-3xl text-small text-ink-muted">
            PostgreSQL — required by the application itself, including the
            browser demo; Anthropic, for any real dialogue turn; Deepgram,
            for real speech-to-text; ElevenLabs, for real text-to-speech;
            Twilio, for telephony.
          </p>
          <p className="mt-6 max-w-3xl text-small font-semibold text-ink">
            Not demonstrated
          </p>
          <p className="mt-2 max-w-3xl text-small text-ink-muted">
            A real Docker build or container run, an orchestrated
            deployment, a real PSTN telephone call, a round-trip against
            any real external provider, customer usage, real production
            scale, and real voice or transcription quality metrics. By the
            repository&apos;s own evidence, this is an implemented, tested
            pipeline that has not yet been exercised against the real
            world it&apos;s built for.
          </p>
        </Section>

        {/* 11. HONEST LIMITATIONS */}
        <Section eyebrow="Where it stands" title="What this is not, yet">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "No real provider round-trip has been demonstrated",
                detail:
                  "Anthropic, Deepgram, ElevenLabs and Twilio request shapes are verified against mocks; none has been called for real from this repository.",
              },
              {
                title: "The scripted evaluation is not a real-model or voice-quality benchmark",
                detail:
                  "ScriptedModel answers from a script. The 18/18 result says the guard, tools and calendar work as designed — it says nothing about Claude, transcription or voice quality.",
              },
              {
                title: "Offline STT/TTS are deterministic stand-ins",
                detail:
                  "A fixed canned transcript and a 220 Hz sine tone, not actual speech recognition or synthesis — a development harness, not a claim about speech.",
              },
              {
                title: "The browser harness is intentionally unauthenticated",
                detail:
                  "Bounded by a session and turn limit, not by a login. It is a development surface, closed entirely in production, not a public production endpoint.",
              },
              {
                title: "No CI workflow is configured",
                detail:
                  "The test suite and evaluation harness are run directly, not automatically on push or pull request.",
              },
              {
                title: "Docker packaging exists; execution hasn't been demonstrated",
                detail:
                  "The Dockerfile and compose file are statically checked by tests. Building or running the image was environment-blocked and has not been recorded.",
              },
              {
                title: "transfer_to_human records intent, not a live transfer",
                detail:
                  "It stores the escalation reason. Nothing in this repository actually connects the caller to a person.",
              },
              {
                title: "No customer or production-call evidence exists",
                detail:
                  "No telephone call has ever been placed from this codebase, and no usage figures of any kind are claimed.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-card border border-line bg-canvas p-5"
              >
                <p className="text-small font-semibold text-ink">
                  {item.title}
                </p>
                <p className="mt-2 text-small leading-relaxed text-ink-muted">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-small text-ink-muted">
            These are a mix of deliberate demo boundaries (the harness is
            meant to run without a phone line) and open evidence gaps (no
            real provider has been exercised yet) — the distinction matters,
            and is kept above rather than collapsed into one list.
          </p>
        </Section>

        {/* 12. TECH STACK */}
        <Section eyebrow="Built with" title="Technology">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STACK.map((item) => (
              <div
                key={item.name}
                className="rounded-card border border-line px-4 py-3"
              >
                <p className="text-small font-semibold text-ink">
                  {item.name}
                </p>
                <p className="mt-1 text-meta text-ink-muted">{item.role}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 13. SCREENSHOTS */}
        <Section eyebrow="The product" title="Seeing it work">
          <p className="max-w-3xl text-body text-ink-muted">
            No screenshots exist yet. Future evidence targets: the
            /harness page mid-conversation, a check_availability →
            book_appointment exchange, the evaluation CLI&apos;s summary
            output, and the /ready endpoint&apos;s response.
          </p>
        </Section>

        {/* 14. CLOSING CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-4">
          <div className="rounded-card border border-line bg-canvas p-8 sm:p-10">
            <h2 className="text-section text-ink">Read the source</h2>
            <p className="mt-3 max-w-2xl text-ink-muted">
              The full engineering record — every decision, every
              limitation — is in the repository itself.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-control bg-brand px-6 py-3 text-small font-semibold text-white hover:bg-brand/90"
              >
                View on GitHub
              </a>
              <a
                href={enquiryMailto(PROJECT.service)}
                className="rounded-control px-4 py-3 text-small font-semibold text-ink-muted underline-offset-4 hover:text-ink hover:underline"
              >
                Talk about voice AI
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
