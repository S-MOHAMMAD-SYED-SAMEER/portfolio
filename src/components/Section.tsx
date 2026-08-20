import type { ReactNode } from "react";

type Ground = "canvas" | "surface";
type Size = "default" | "large";

/**
 * The page's compositional unit. Section rhythm lives here rather than in
 * repeated utility strings on every component: previously each section was an
 * identical `max-w-5xl px-6 py-20` block with an identical heading, so nothing
 * signalled that Projects matters more than Skills. Ground and size are props,
 * so pacing is a decision made in App.tsx and visible in one place.
 */
export default function Section({
  id,
  eyebrow,
  title,
  intro,
  ground = "canvas",
  size = "default",
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  ground?: Ground;
  size?: Size;
  children: ReactNode;
}) {
  const hasHeader = Boolean(eyebrow || title || intro);

  return (
    <section
      id={id}
      className={
        ground === "surface"
          ? "border-y border-line bg-surface"
          : "bg-canvas"
      }
    >
      <div
        className={`mx-auto max-w-5xl px-6 ${
          size === "large" ? "py-20 sm:py-28" : "py-16 sm:py-20"
        }`}
      >
        {hasHeader && (
          <header className="max-w-2xl">
            {eyebrow && (
              <p className="text-eyebrow uppercase text-brand">{eyebrow}</p>
            )}
            {title && (
              <h2 className="mt-3 text-section text-balance text-ink">{title}</h2>
            )}
            {intro && (
              <p className="mt-4 text-body text-ink-muted">{intro}</p>
            )}
          </header>
        )}
        <div className={hasHeader ? "mt-10 sm:mt-12" : ""}>{children}</div>
      </div>
    </section>
  );
}
