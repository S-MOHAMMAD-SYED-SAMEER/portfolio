import type { ReactNode } from "react";

/**
 * The recurring "gate" callout: a numbered circular badge beside a short
 * block of text, inside a box heavier than the surrounding cards — used at
 * the one step in a flow diagram where the reader's attention should stop
 * (the verification gate, the approval gate).
 *
 * Only the badge-and-box shell is standardised here. The existing callouts
 * differ in how many paragraphs follow the heading and how the last one is
 * styled, so that content stays the caller's own markup rather than being
 * forced through a shared prop shape built for cases that don't exist yet.
 */
export default function Callout({
  badge,
  heading,
  children,
}: {
  badge: ReactNode;
  heading: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="my-6 rounded-control border-2 border-line-strong bg-brand-tint p-5">
      <div className="flex gap-4">
        <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand text-meta font-semibold text-white">
          {badge}
        </span>
        <div>
          <p className="text-small font-semibold text-ink">{heading}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
