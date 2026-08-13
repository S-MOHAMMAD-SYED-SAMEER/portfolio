/**
 * Decorative card illustration — a stylised impression of the support agent's
 * chat, drawn in the portfolio's own palette. It is deliberately abstract and
 * carries no readable claims: the real interface is shown by the screenshots
 * on the case-study page, and nothing here should be mistaken for one.
 */
export default function ProjectThumbnail() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-md border border-slate-200 bg-slate-50"
    >
      <svg viewBox="0 0 320 150" className="h-auto w-full" role="presentation">
        {/* window chrome */}
        <rect x="0" y="0" width="320" height="26" className="fill-white" />
        <line x1="0" y1="26" x2="320" y2="26" className="stroke-slate-200" strokeWidth="1" />
        <circle cx="16" cy="13" r="3" className="fill-slate-300" />
        <circle cx="27" cy="13" r="3" className="fill-slate-200" />
        <circle cx="38" cy="13" r="3" className="fill-slate-200" />
        <rect x="56" y="9" width="70" height="8" rx="4" className="fill-slate-200" />

        {/* customer message, right-aligned */}
        <rect x="150" y="42" width="150" height="24" rx="10" className="fill-indigo-600" />
        <rect x="162" y="50" width="112" height="4" rx="2" className="fill-white/70" />
        <rect x="162" y="58" width="74" height="4" rx="2" className="fill-white/40" />

        {/* agent reply, left-aligned */}
        <rect x="20" y="76" width="176" height="34" rx="10" className="fill-white" />
        <rect
          x="20"
          y="76"
          width="176"
          height="34"
          rx="10"
          className="fill-none stroke-slate-200"
          strokeWidth="1"
        />
        <rect x="32" y="85" width="140" height="4" rx="2" className="fill-slate-300" />
        <rect x="32" y="94" width="120" height="4" rx="2" className="fill-slate-200" />

        {/* the badge that shows what the agent checked before answering */}
        <rect x="20" y="118" width="92" height="14" rx="7" className="fill-indigo-50" />
        <rect x="29" y="123" width="74" height="4" rx="2" className="fill-indigo-300" />
        <rect x="118" y="118" width="66" height="14" rx="7" className="fill-amber-50" />
        <rect x="127" y="123" width="48" height="4" rx="2" className="fill-amber-300" />
      </svg>
    </div>
  );
}
