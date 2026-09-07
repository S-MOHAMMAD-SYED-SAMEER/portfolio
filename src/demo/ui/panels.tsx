import type { ReactNode } from "react";

/**
 * The vocabulary every demo stage is built from.
 *
 * WHY ONE SET OF PANELS RATHER THAN THREE SETS OF SCREENS
 *
 * The three projects do different work, but a client is being shown the same
 * thing each time: what went in, what the system understood, the evidence it
 * had, what it decided, and what changed as a result. Giving each project its
 * own components would produce three visual systems and three places for that
 * shape to drift.
 *
 * So a stage is data — a list of panels — and this file is the only place that
 * knows how a panel looks. Adding a stage to a demo is a data change.
 */

export type Tone = "plain" | "brand" | "signal" | "positive";

export type Panel =
  /** Something a person wrote: a customer message, an inbound email. */
  | {
      kind: "message";
      from: string;
      meta?: string;
      subject?: string;
      body: string;
    }
  /** Named values the system produced, with optional supporting notes. */
  | {
      kind: "fields";
      title: string;
      caption?: string;
      rows: { label: string; value: string; note?: string; tone?: Tone }[];
    }
  /** A passage quoted from the input, with where it came from. */
  | { kind: "quote"; title: string; text: string; source: string }
  /** A short statement: what was detected, decided, or refused. */
  | { kind: "note"; tone?: Tone; title: string; body: string }
  /** Ordered or unordered supporting detail. */
  | { kind: "list"; title: string; caption?: string; items: string[] }
  /** Records that now exist because the workflow ran. */
  | {
      kind: "records";
      title: string;
      caption?: string;
      rows: { type: string; name: string; detail: string }[];
    };

const TONE_TEXT: Record<Tone, string> = {
  plain: "text-ink",
  brand: "text-brand",
  signal: "text-signal",
  positive: "text-emerald-700",
};

const TONE_BOX: Record<Tone, string> = {
  plain: "border-line bg-canvas",
  brand: "border-brand/25 bg-brand-tint",
  signal: "border-signal/25 bg-signal-tint",
  positive: "border-emerald-200 bg-emerald-50",
};

function Frame({ title, caption, children }: { title: string; caption?: string; children: ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-surface p-5 shadow-resting sm:p-6">
      <h3 className="text-eyebrow uppercase text-ink-muted">{title}</h3>
      {caption && <p className="mt-2 text-small text-ink-muted">{caption}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function PanelView({ panel }: { panel: Panel }) {
  switch (panel.kind) {
    case "message":
      return (
        <section className="rounded-card border border-line bg-surface p-5 shadow-resting sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-small font-semibold text-ink">{panel.from}</p>
            {panel.meta && <p className="text-meta text-ink-muted">{panel.meta}</p>}
          </div>
          {panel.subject && (
            <p className="mt-1 text-small font-semibold text-ink-muted">{panel.subject}</p>
          )}
          {/* `whitespace-pre-line` so the fixture's own paragraph breaks survive
              without the data needing to carry markup. */}
          <p className="mt-4 whitespace-pre-line text-body leading-relaxed text-ink">
            {panel.body}
          </p>
        </section>
      );

    case "fields":
      return (
        <Frame title={panel.title} caption={panel.caption}>
          <dl className="grid gap-4 sm:grid-cols-2">
            {panel.rows.map((row) => (
              <div key={row.label}>
                <dt className="text-meta uppercase tracking-wide text-ink-muted">{row.label}</dt>
                <dd className={`mt-1 text-small font-semibold ${TONE_TEXT[row.tone ?? "plain"]}`}>
                  {row.value}
                </dd>
                {row.note && <p className="mt-1 text-meta text-ink-muted">{row.note}</p>}
              </div>
            ))}
          </dl>
        </Frame>
      );

    case "quote":
      return (
        <Frame title={panel.title}>
          <blockquote className="border-l-2 border-brand pl-4">
            <p className="text-body italic leading-relaxed text-ink">“{panel.text}”</p>
          </blockquote>
          <p className="mt-3 text-meta text-ink-muted">{panel.source}</p>
        </Frame>
      );

    case "note":
      return (
        <section
          className={`rounded-card border p-5 sm:p-6 ${TONE_BOX[panel.tone ?? "plain"]}`}
        >
          <h3 className={`text-small font-semibold ${TONE_TEXT[panel.tone ?? "plain"]}`}>
            {panel.title}
          </h3>
          <p className="mt-2 text-small leading-relaxed text-ink-muted">{panel.body}</p>
        </section>
      );

    case "list":
      return (
        <Frame title={panel.title} caption={panel.caption}>
          <ul className="grid gap-3">
            {panel.items.map((item) => (
              <li key={item} className="flex gap-3 text-small leading-relaxed text-ink">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-pill bg-brand" />
                {item}
              </li>
            ))}
          </ul>
        </Frame>
      );

    case "records":
      return (
        <Frame title={panel.title} caption={panel.caption}>
          <ul className="grid gap-3">
            {panel.rows.map((row) => (
              <li
                key={`${row.type}-${row.name}`}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-control border border-emerald-200 bg-emerald-50 px-4 py-3"
              >
                <span className="text-meta uppercase tracking-wide text-emerald-700">
                  {row.type}
                </span>
                <span className="text-small font-semibold text-ink">{row.name}</span>
                <span className="text-meta text-ink-muted">{row.detail}</span>
              </li>
            ))}
          </ul>
        </Frame>
      );
  }
}
