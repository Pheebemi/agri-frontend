import { Check } from "lucide-react";

/**
 * The left-hand illustration panel on the auth pages.
 *
 * Permanently dark in both themes, which is why it uses bg-ink-dark and the
 * literal brand ramp for text rather than the theme-aware tokens.
 */
export function AuthPanel({
  illustration,
  title,
  body,
  points,
}: {
  illustration: string;
  title: string;
  body: string;
  points: string[];
}) {
  return (
    <div className="relative hidden overflow-hidden rounded-2xl bg-ink-dark p-10 lg:flex lg:flex-col lg:justify-between">
      <div
        aria-hidden="true"
        className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl"
      />
      <div className="relative">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-200/75">{body}</p>
      </div>

      <img
        src={`/illustrations/${illustration}.svg`}
        alt=""
        className="relative mx-auto my-8 w-full max-w-[280px]"
      />

      <ul className="relative space-y-2.5">
        {points.map((point) => (
          <li key={point} className="flex items-center gap-2.5 text-sm text-brand-200/80">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/20">
              <Check className="h-3 w-3 text-brand-400" />
            </span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
