import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A product screenshot, and the viewer that shows it properly.
 *
 * TWO DIFFERENT JOBS
 *
 * `card` (homepage) is a promotional thumbnail. It is a deliberate top-anchored
 * crop in a fixed 16:10 window, because every card in that grid has to be the
 * same height whatever the capture's proportions are.
 *
 * `figure` (case studies) is evidence, and evidence must not be cropped. The
 * earlier version framed these the same way as cards — a fixed 22rem window with
 * `object-cover` — which quietly discarded most of every image. A 1920x611
 * capture in a 472px column was scaled to 1106px wide and clipped to 472, so the
 * reader saw the left 43% of the page and had no way to know the rest existed.
 * Tall captures had the mirror problem: 22rem of a 4319px page is its top 8%,
 * usually a header and white space.
 *
 * So a figure now shows the WHOLE capture, scaled proportionally — a thumbnail
 * of the entire screenshot rather than a window into part of it. The frame takes
 * the image's own aspect ratio and is capped at MAX_PREVIEW_REM tall:
 *
 *     width:        min(100%, MAX_PREVIEW_REM * (w / h))
 *     aspect-ratio: w / h
 *
 * Both values are known at render time from the intrinsic dimensions, so the
 * result is arithmetic rather than shrink-to-fit guesswork — no dependence on
 * `fit-content` around a max-height-constrained replaced element, which browsers
 * disagree about. A landscape capture fills the column and is short. A very tall
 * capture is limited by the height cap instead, so it renders as a narrow
 * full-length strip that reads as what it is: a long page. Nothing is cropped,
 * nothing is stretched, and the full-resolution original is one click away.
 *
 * Previously this component was copy-pasted into all three case-study pages.
 * It lives here once now; the pages import it.
 */

/** Tallest a case-study preview may render, before the column width caps it. */
const MAX_PREVIEW_REM = 32;

type Frame = "figure" | "card";

export interface ScreenshotProps {
  src: string;
  /** Describes what is visible in the image. Also the viewer's accessible name. */
  alt: string;
  /** Shown under a figure. Cards have no caption. */
  caption?: string;
  /** Intrinsic pixels, so the browser can budget the decode before it arrives. */
  width: number;
  height: number;
  frame?: Frame;
}

/** Tall enough that fitting it to the viewport would make it unreadable. */
function isTall(width: number, height: number): boolean {
  return height / width > 1.4;
}

// --- the viewer --------------------------------------------------------------

function Lightbox({
  src,
  alt,
  width,
  height,
  onClose,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  onClose: () => void;
}) {
  // A tall capture fitted to the viewport would be a few hundred pixels wide and
  // no more readable than the preview, so it opens at full width and scrolls
  // instead. Anything landscape or square opens fitted.
  const [actualSize, setActualSize] = useState(() => isTall(width, height));
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusTo = useRef<Element | null>(null);

  useEffect(() => {
    returnFocusTo.current = document.activeElement;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // Lock the page behind the viewer. The previous value is restored rather
    // than assumed to be "visible", so this cannot leave the page unscrollable
    // if something else was already managing overflow.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      (returnFocusTo.current as HTMLElement | null)?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 flex flex-col bg-[#0f172ae6]"
      // Only a click that lands on the backdrop itself closes. A click on the
      // image, the toolbar, or a scrollbar inside the scroll area does not.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex flex-none items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="min-w-0 truncate text-xs text-[#cbd5e1]">{alt}</p>
        <div className="flex flex-none items-center gap-2">
          <button
            type="button"
            onClick={() => setActualSize((v) => !v)}
            className="rounded-md border border-[#64748b] px-3 py-1.5 text-xs font-semibold text-[#e2e8f0] hover:border-[#94a3b8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {actualSize ? "Fit to screen" : "Full width"}
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-md bg-[#ffffff] px-3 py-1.5 text-xs font-semibold text-[#0f172a] hover:bg-[#e2e8f0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Close
          </button>
        </div>
      </div>

      {/* The scroll container. A tall capture is scrolled through here rather
          than being squeezed into the viewport. */}
      <div
        className="min-h-0 flex-1 overflow-auto px-4 pb-6 sm:px-6"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={
            actualSize
              ? "mx-auto h-auto w-full max-w-5xl rounded-sm bg-white"
              : "mx-auto max-h-full w-auto max-w-full rounded-sm bg-white object-contain"
          }
        />
      </div>

      <p className="flex-none px-4 pb-4 text-center text-xs text-[#cbd5e1] sm:px-6">
        Press Escape to close
      </p>
    </div>
  );
}

// --- the preview -------------------------------------------------------------

export default function Screenshot({
  src,
  alt,
  caption,
  width,
  height,
  frame = "figure",
}: ScreenshotProps) {
  // Every hook above every return.
  const [open, setOpen] = useState(false);
  const [missing, setMissing] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const isCard = frame === "card";

  const preview = missing ? (
    <div
      className={`flex items-center justify-center ${
        isCard ? "aspect-video" : "h-full w-full"
      }`}
    >
      <p className="px-6 text-center text-xs text-slate-600">
        Product screenshot to be added
      </p>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      // Homepage cards load eagerly: there are three of them, the heaviest is
      // 5.7 megapixels, and deferring that one is what left the third card
      // blank. Case-study galleries keep lazy loading — they have four or five
      // images each, well down the page.
      //
      // `decoding` is separate from `loading` and applies to every frame. The
      // cards had neither, so the browser was free to decode 7.76 megapixels
      // on the critical path — measured at 52 ms for the largest one warm on a
      // desktop, and several times that on a phone. Asking for an async decode
      // does not defer the fetch and does not change when a card appears; it
      // only stops the decode from having to finish before the next paint.
      decoding="async"
      {...(isCard ? {} : { loading: "lazy" as const })}
      onError={() => setMissing(true)}
      className={
        isCard
          ? // Promotional crop: uniform card heights, anchored to the top so a
            // long page shows its header rather than its middle.
            "aspect-[16/10] w-full object-cover object-top"
          : // The frame already carries the image's own ratio, so this fills it
            // exactly. `object-contain` is belt-and-braces: if a rounded ratio
            // ever disagrees with the pixels by a fraction, the image letterboxes
            // rather than losing an edge.
            "h-full w-full object-contain"
      }
    />
  );

  const frameClasses = isCard
    ? "block w-full overflow-hidden rounded-control border border-line bg-canvas"
    : // No `w-full`: the width comes from `frameStyle` so the frame hugs the
      // image instead of letterboxing it. Left-aligned, so the caption lines up
      // with the image's left edge and the two read as one unit.
      "block overflow-hidden rounded-lg border border-slate-200 bg-slate-50";

  const frameStyle = isCard
    ? undefined
    : {
        width: `min(100%, ${((MAX_PREVIEW_REM * width) / height).toFixed(2)}rem)`,
        aspectRatio: `${width} / ${height}`,
      };

  const body = (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={frameStyle}
        /* The name OPENS with the button's own visible words, which is what
           WCAG 2.5.3 (Label in Name) requires: a speech-input user says "click
           to view full size" and the accessible name still matches. It read
           "View full size: …" before, which described the action correctly but
           did not contain the label printed on the control.
           When the image is missing there is no such label on screen — the
           frame reads "Product screenshot to be added" — so the attribute is
           dropped and that text becomes the name on its own. */
        aria-label={missing ? undefined : `Click to view full size: ${alt}`}
        className={`group relative ${frameClasses} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
      >
        {preview}
        {!missing && (
          // Always visible rather than hover-only: on a touch screen there is
          // no hover, and a visitor who cannot tell the image is clickable will
          // never find the full-resolution version.
          <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-[#0f172acc] px-2 py-1 text-[11px] font-medium text-white">
            Click to view full size
          </span>
        )}
      </button>
      {open && (
        <Lightbox src={src} alt={alt} width={width} height={height} onClose={close} />
      )}
    </>
  );

  if (isCard) return <div>{body}</div>;

  return (
    // `break-inside-avoid` keeps a figure and its caption in one piece; the
    // bottom margin is the vertical rhythm, because a column container's `gap`
    // only sets the space *between columns*.
    <figure className="mb-8 break-inside-avoid">
      {body}
      {caption && (
        <figcaption className="mt-2 text-xs text-slate-600">
          {caption}{" "}
          <span className="text-slate-500">
            Shown in full — click to read it at full resolution.
          </span>
        </figcaption>
      )}
    </figure>
  );
}
