/**
 * VoiceDesk's call path, from audio in to audio out. Presentational only —
 * no runtime fetching, no model calls, no provider logic, nothing
 * fabricated. Both the browser harness and telephony run this exact path —
 * only the audio transport at either end differs — and nothing here claims
 * that a real telephone call, or a real external provider, has actually
 * been exercised.
 */

interface Stage {
  n: string;
  title: string;
  detail: string;
}

const STAGES: Stage[] = [
  {
    n: "1",
    title: "Caller / browser",
    detail:
      "Audio enters as a Twilio media stream or a browser harness microphone frame — the same dialogue path runs behind either transport.",
  },
  {
    n: "2",
    title: "Speech-to-text",
    detail:
      "Transcribed behind a provider interface: offline by default (a fixed transcript), Deepgram as an optional real provider that has not been called for real from this repository.",
  },
  {
    n: "3",
    title: "Conversation / turn manager",
    detail:
      "The transcript becomes one turn, held in the conversation's own in-memory history.",
  },
  {
    n: "4",
    title: "LLM tool use",
    detail:
      "Anthropic — the only LLM provider, with no offline substitute — decides what to say and which tool, if any, to call.",
  },
  {
    n: "5",
    title: "Tool executor",
    detail:
      "A requested tool call is checked and dispatched to one of six application tools, independent of any provider or telephony library.",
  },
  {
    n: "6",
    title: "Calendar + PostgreSQL",
    detail:
      "Availability is read, and bookings are written, through CalendarService — a PostgreSQL exclusion constraint is the final authority on a conflict.",
  },
  {
    n: "7",
    title: "Text-to-speech",
    detail:
      "Synthesised behind a provider interface: offline by default (a 220 Hz tone), ElevenLabs as an optional real provider that has not been called for real from this repository.",
  },
  {
    n: "8",
    title: "Audio response",
    detail:
      "The reply streams back to whichever transport opened the call — telephony or the browser harness.",
  },
];

function Step({ stage }: { stage: Stage }) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand-tint text-meta font-semibold text-brand">
        {stage.n}
      </span>
      <div>
        <p className="text-small font-semibold text-ink">{stage.title}</p>
        <p className="mt-1 text-small text-ink-muted">{stage.detail}</p>
      </div>
    </li>
  );
}

export default function VoiceDeskFlow() {
  return (
    <div className="rounded-card border border-line bg-surface p-6 sm:p-8">
      <ol className="flex flex-col gap-6">
        {STAGES.map((stage) => (
          <Step key={stage.n} stage={stage} />
        ))}
      </ol>
    </div>
  );
}
