/**
 * A recorded demo of a project actually running, played with the browser's own controls.
 *
 * Plain `<video>` rather than a hosted-embed player: the file is served from this site's own `public/`,
 * so there is no third-party origin, no tracking script and no player chrome to reconcile with the page.
 * `preload="none"` fetches nothing but the poster until someone presses play, so the page does not pay
 * for a 3 to 8 MB file on load. `playsInline` keeps it from forcing full screen on a phone. It starts
 * muted: the narration is one press of the volume control away, and a page that makes sound by itself
 * is a page people close.
 *
 * Captions are a real text track (`kind="captions"`, English) holding the full spoken text, so the narration
 * is available to anyone who cannot hear it. It is deliberately NOT the default track: short captions are
 * already burned into the picture, and showing the full text over them would put two sets of captions on
 * screen. The track stays in the player's captions menu, so a viewer who turns CC on gets the full text (its
 * cues sit above the burned-in ones so the two do not overlap).
 *
 * The frame is a fixed 16:9 box that scales with the column, so nothing jumps when the file arrives.
 */
export interface CaseStudyVideoProps {
  src: string;
  /** A still shown before playback. */
  poster: string;
  /** WebVTT captions for `src`. */
  captions: string;
  /** Names what is in the recording; also the player's accessible name. */
  label: string;
  /** Shown under the player. Describes only what the recording shows. */
  caption: string;
  /** A second line under the caption, for what is specific to this recording. */
  detail?: string;
}

/** The line every demo video carries under it. */
export const DEMO_CAPTION = "Demo: the real app on a real model, fictional data, AI voice narration.";

export default function CaseStudyVideo({ src, poster, captions, label, caption, detail }: CaseStudyVideoProps) {
  return (
    <figure className="w-full max-w-4xl">
      <div className="aspect-video w-full overflow-hidden rounded-card border border-line bg-ink">
        <video
          controls
          muted
          preload="none"
          playsInline
          poster={poster}
          aria-label={label}
          className="h-full w-full"
        >
          <source src={src} type="video/mp4" />
          <track kind="captions" src={captions} srcLang="en" label="English" />
          Your browser cannot play this video. It is a recording of the demo, under 90 seconds long; the case study below
          describes everything it shows.
        </video>
      </div>
      <figcaption className="mt-3 text-meta text-ink-muted">
        {caption}
        {detail ? <span className="mt-2 block">{detail}</span> : null}
      </figcaption>
    </figure>
  );
}
