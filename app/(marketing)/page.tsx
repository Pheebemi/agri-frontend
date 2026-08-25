import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Leaf,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  WifiOff,
} from "lucide-react";

const STEPS = [
  {
    icon: Camera,
    title: "Photograph the leaf",
    body:
      "Fill the frame with a single affected leaf in daylight. Your phone camera is enough — no attachment, no lab kit.",
  },
  {
    icon: ScanLine,
    title: "The scan runs",
    body:
      "We identify the crop, measure how much of the leaf is affected, and name the disease — usually in under ten seconds.",
  },
  {
    icon: Stethoscope,
    title: "Act on the plan",
    body:
      "You get what to do today, an organic route and a chemical one, what to buy, and how to stop it coming back.",
  },
];

const CROPS = [
  "Tomato", "Maize", "Cassava", "Rice", "Pepper",
  "Cocoa", "Plantain", "Cowpea", "Yam", "Potato",
];

const SEVERITIES = [
  { label: "Healthy", chip: "bg-sev-healthy-soft text-sev-healthy", dot: "bg-sev-healthy" },
  { label: "Mild", chip: "bg-sev-mild-soft text-sev-mild", dot: "bg-sev-mild" },
  { label: "Moderate", chip: "bg-sev-moderate-soft text-sev-moderate", dot: "bg-sev-moderate" },
  { label: "Severe", chip: "bg-sev-severe-soft text-sev-severe", dot: "bg-sev-severe" },
  { label: "Critical", chip: "bg-sev-critical-soft text-sev-critical", dot: "bg-sev-critical" },
];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-soft px-3.5 py-1.5 text-xs font-semibold text-accent-link">
              <Sparkles className="h-3.5 w-3.5" />
              Free to start, results in seconds
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              Know what&apos;s wrong with your crop{" "}
              <span className="text-brand-500">before you lose it</span>.
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-body">
              Photograph a leaf. AgriScan identifies the crop, diagnoses the
              disease, grades how far it has gone, and hands you a treatment plan
              you can act on the same day.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-semibold text-[#03150D] shadow-[0_10px_30px_-14px_rgba(22,193,114,0.95)] transition-colors hover:bg-brand-400"
              >
                Scan your first leaf
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center rounded-xl border border-line-strong px-6 text-sm font-semibold text-strong transition-colors hover:border-brand-400 hover:text-accent-link"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="brand-glow relative">
            <img
              src="/illustrations/hero-farm.svg"
              alt="A farmer photographing a crop leaf with a phone to have it diagnosed"
              className="relative mx-auto w-full max-w-lg"
            />
          </div>
        </div>
      </section>

      {/* ── Severity vocabulary ────────────────────────────────────── */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-5 py-6">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-faint">
            Every scan is graded
          </span>
          {SEVERITIES.map((severity) => (
            <span
              key={severity.label}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${severity.chip}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${severity.dot}`} />
              {severity.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-link">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Three steps, one photograph
          </h2>
          <p className="mt-3 text-body">
            No soil sample, no waiting for an extension officer to visit. The
            whole loop runs on the phone already in your pocket.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="group relative rounded-xl border border-line bg-surface p-6 shadow-sm transition-all hover:border-brand-400/40 hover:shadow-md"
            >
              <span className="absolute right-5 top-5 font-mono text-4xl font-bold text-inset">
                0{index + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-softer text-accent-link">
                <step.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The AI ─────────────────────────────────────────────────── */}
      <section id="ai" className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 lg:grid-cols-2">
          <div className="brand-glow relative order-2 lg:order-1">
            <img
              src="/illustrations/analysis.svg"
              alt=""
              className="mx-auto w-full max-w-md"
            />
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-link">
              The AI
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Honest about what it knows
            </h2>
            <p className="mt-4 leading-relaxed text-body">
              AgriScan chains several diagnostic engines. If a hosted model is
              configured it names the disease; if none is, a local colour-analysis
              pass still measures severity and affected leaf area and tells you
              plainly that an agronomist should confirm it.
            </p>

            <ul className="mt-7 space-y-4">
              {[
                {
                  icon: WifiOff,
                  title: "Always available, even offline",
                  body: "A built-in analyser measures severity and affected leaf area with no setup required, so a scan never comes back empty.",
                },
                {
                  icon: ShieldCheck,
                  title: "Low confidence is flagged, not hidden",
                  body: "Anything the model isn't sure about is routed to an agronomist for review instead of being dressed up as certainty.",
                },
                {
                  icon: Leaf,
                  title: "Treatments come from a real knowledge base",
                  body: "Organic, chemical, immediate and preventive routes per disease — written for a farmer, not a lab.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-softer text-accent-link">
                    <item.icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-body">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Crops ──────────────────────────────────────────────────── */}
      <section id="crops" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-link">
              Crop library
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Built around what you actually grow
            </h2>
            <p className="mt-3 max-w-lg text-body">
              Staples first — cassava, yam, plantain, cocoa and cowpea alongside
              the globally-grown crops. Each one carries a full field guide:
              symptoms, causes, how it spreads, and what to do.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {CROPS.map((crop) => (
                <span
                  key={crop}
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-strong transition-colors hover:border-brand-400 hover:text-accent-link"
                >
                  <Leaf className="h-3.5 w-3.5 text-brand-500" />
                  {crop}
                </span>
              ))}
            </div>
          </div>

          <img
            src="/illustrations/eco-farming.svg"
            alt=""
            className="mx-auto w-full max-w-sm lg:max-w-md"
          />
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-2xl bg-ink-dark px-8 py-14 sm:px-14">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl"
          />
          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="max-w-lg text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your first diagnosis is one photograph away
              </h2>
              <p className="mt-4 max-w-md text-brand-200/80">
                Create a free account and scan a leaf in the next two minutes.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "No credit card required",
                  "Full treatment plans included",
                  "Your scan history stays private to you",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-brand-200/80">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="inline-flex h-13 shrink-0 items-center gap-2 self-start rounded-xl bg-brand-500 px-7 text-sm font-semibold text-[#03150D] transition-colors hover:bg-brand-400 md:self-center"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
