# AgriScan — Frontend (Next.js)

Crop scanning & diagnostic platform. A farmer photographs a leaf; the app identifies the
crop, diagnoses the disease, and returns a treatment plan.

Backend lives in a **separate repo**: `Pheebemi/agri-backend` (Django + DRF).
Talk to it over REST at `NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api`).

---

## 1. Stack

```
next 16.x            react 19.x           tailwindcss v4
next-themes ^0.4.6   sonner ^2.0.7        lucide-react ^0.552.0
clsx ^2.1.1          tailwind-merge ^3.3.1  class-variance-authority ^0.7
recharts ^3          (dashboard charts only)
```

Install:

```bash
npm i next-themes sonner lucide-react clsx tailwind-merge class-variance-authority recharts
npm i -D tailwindcss @tailwindcss/postcss
```

---

## 2. Font

Geist + Geist Mono via `next/font/google`. Self-hosted automatically — no CDN link, no
layout shift.

```tsx
// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// on <body>:
className={`${geistSans.variable} ${geistMono.variable} antialiased`}
```

Bridged into Tailwind inside `@theme inline`:

```
--font-sans: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
```

Mono is not decoration here — use `font-mono` for confidence percentages, scan IDs,
latitude/longitude, and model version strings so digits align in tables.

---

## 3. The design system (`app/globals.css`)

Two layers. Layer 1 is `@theme inline`, mapping Tailwind utility names onto CSS vars.
Layer 2 is `:root` / `.dark`, setting those vars. So `bg-surface` resolves through
`--color-surface` → `var(--surface)` → a hex that changes under `.dark`. **You write
`bg-surface` once and never touch it again to support both themes.**

This app is dark-first: the page is near-black with a faint green cast, and the brand
green is the only saturated thing on screen. Light mode is a full, supported theme — not
an afterthought — but dark is what it was designed in.

```css
@import "tailwindcss";

/* Dark is a class on <html> (next-themes), not the OS media query,
   so the in-app toggle can override the system preference. */
@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  /* --- shadcn bridge (keep even if you hand-roll components; cva variants read these) --- */
  --color-background:             var(--background);
  --color-foreground:             var(--foreground);
  --color-card:                   var(--card);
  --color-card-foreground:        var(--card-foreground);
  --color-popover:                var(--popover);
  --color-popover-foreground:     var(--popover-foreground);
  --color-primary:                var(--primary);
  --color-primary-foreground:     var(--primary-foreground);
  --color-secondary:              var(--secondary);
  --color-secondary-foreground:   var(--secondary-foreground);
  --color-muted:                  var(--muted);
  --color-muted-foreground:       var(--muted-foreground);
  --color-accent:                 var(--accent);
  --color-accent-foreground:      var(--accent-foreground);
  --color-destructive:            var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border:                 var(--border);
  --color-input:                  var(--input);
  --color-ring:                   var(--ring);
  --radius:                       var(--radius);
  --font-sans:                    var(--font-geist-sans);
  --font-mono:                    var(--font-geist-mono);

  /* --- brand ramp: LITERAL in both themes, on purpose ---
     These do double duty. The light end (200/300) is accent *text* on
     permanently-dark sections (sidebar, footer, hero bands); the dark end
     (600/700) is accent text on light surfaces. Flipping the ramp per theme
     fixes one role and breaks the other — so tinted *surfaces* get their own
     theme-aware tokens further down instead. Never wrap this block in .dark. */
  --color-brand-50:   #ECFDF4;
  --color-brand-100:  #D2F9E2;
  --color-brand-200:  #A7F3C9;
  --color-brand-300:  #6EE7A9;
  --color-brand-400:  #34D88B;
  --color-brand-500:  #16C172;   /* the primary — "sweet green" */
  --color-brand-600:  #0EA05D;
  --color-brand-700:  #0B7F4B;
  --color-brand-800:  #0C643E;
  --color-brand-900:  #0B5234;
  --color-brand-950:  #032D1D;

  /* --- semantic tokens: these are what you actually write --- */
  --color-ink:          var(--ink);          /* headings */
  --color-ink-soft:     var(--ink-soft);     /* secondary heading */
  --color-body:         var(--text-body);    /* body / secondary text */
  --color-strong:       var(--text-strong);  /* high-contrast body heading */
  --color-subtle:       var(--text-subtle);  /* tertiary text */
  --color-faint:        var(--text-faint);   /* captions, placeholders */
  --color-page:         var(--page);         /* page background */
  --color-surface:      var(--surface);      /* cards, panels (replaces bg-white) */
  --color-surface-2:    var(--surface-2);    /* raised / inset surfaces */
  --color-inset:        var(--inset);        /* filled wells (replaces bg-gray-100) */
  --color-line:         var(--line);         /* borders, dividers */
  --color-line-strong:  var(--line-strong);  /* stronger dividers, inputs */
  --color-brand-soft:   var(--brand-soft);   /* subtle brand tint bg */
  --color-brand-softer: var(--brand-softer); /* stronger brand tint bg */
  --color-accent-link:  var(--accent-link);  /* brand-coloured text/icons */

  /* Status chips. Pale pastel fills glow on a near-black page, so both
     the fill and its label are theme-aware. */
  --color-ok:        var(--ok);
  --color-ok-soft:   var(--ok-soft);
  --color-warn:      var(--warn);
  --color-warn-soft: var(--warn-soft);
  --color-err:       var(--err);
  --color-err-soft:  var(--err-soft);

  /* Severity ramp — the diagnostic vocabulary. Healthy → Critical.
     Deliberately NOT the same tokens as ok/warn/err: a scan result is a
     measurement, a toast is feedback, and they should not share a colour
     by accident when only one of them changes. */
  --color-sev-healthy:  var(--sev-healthy);
  --color-sev-mild:     var(--sev-mild);
  --color-sev-moderate: var(--sev-moderate);
  --color-sev-severe:   var(--sev-severe);
  --color-sev-critical: var(--sev-critical);
  --color-sev-healthy-soft:  var(--sev-healthy-soft);
  --color-sev-mild-soft:     var(--sev-mild-soft);
  --color-sev-moderate-soft: var(--sev-moderate-soft);
  --color-sev-severe-soft:   var(--sev-severe-soft);
  --color-sev-critical-soft: var(--sev-critical-soft);

  /* Permanently dark sections — identical in both themes, so light text
     inside them keeps working with no per-theme overrides. The sidebar and
     footer use these, which is why the app reads as dark even in light mode. */
  --color-ink-dark:   #06110C;
  --color-ink-dark-2: #0C1A13;
  --color-page-soft:  var(--surface-2);
}

/* ── LIGHT ────────────────────────────────────────────────── */
:root {
  --radius: 0.75rem;

  --ink:          #04291C;   /* deep forest, for headings */
  --ink-soft:     #1F5240;
  --text-strong:  #0F1A15;
  --text-body:    #4A5A52;
  --text-subtle:  #6B7C74;
  --text-faint:   #9AAAA2;
  --page:         #F2FBF6;   /* soft mint, not pure white */
  --surface:      #FFFFFF;
  --surface-2:    #FAFEFB;
  --inset:        #EFF5F1;
  --line:         #E6F0EA;
  --line-strong:  #D3E3DA;
  --brand-soft:   #ECFDF4;
  --brand-softer: #D2F9E2;
  --accent-link:  #0B7F4B;   /* brand-700 — brand-500 only hits 2.4:1 on white */

  --ok:        #0E9F5A;   --ok-soft:   #E8FAF0;
  --warn:      #A8730A;   --warn-soft: #FFF7E6;
  --err:       #C0362C;   --err-soft:  #FEF2F2;

  --sev-healthy:  #0B7F4B;  --sev-healthy-soft:  #E8FAF0;
  --sev-mild:     #7A8B15;  --sev-mild-soft:     #F7FAE6;
  --sev-moderate: #A8730A;  --sev-moderate-soft: #FFF7E6;
  --sev-severe:   #C05621;  --sev-severe-soft:   #FFF1E8;
  --sev-critical: #B3261E;  --sev-critical-soft: #FEF2F2;

  --background:             #FFFFFF;
  --foreground:             #0F1A15;
  --card:                   #FFFFFF;
  --card-foreground:        #0F1A15;
  --popover:                #FFFFFF;
  --popover-foreground:     #0F1A15;
  --primary:                #0EA05D;
  --primary-foreground:     #03150D;  /* near-black on green, see §3.1 */
  --secondary:              #EFF5F1;
  --secondary-foreground:   #0F1A15;
  --muted:                  #EFF5F1;
  --muted-foreground:       #6B7C74;
  --accent:                 #ECFDF4;
  --accent-foreground:      #04291C;
  --destructive:            #C0362C;
  --destructive-foreground: #FFFFFF;
  --border:                 #E6F0EA;
  --input:                  #D3E3DA;
  --ring:                   #34D88B;
}

/* ── DARK (the default) ───────────────────────────────────── */
.dark {
  /* Near-black with a faint green cast. Surfaces are separated by
     lightness, not heavy borders — that is what keeps it feeling deep
     rather than boxy. */
  --ink:          #EAF5EF;
  --ink-soft:     #B8CFC4;
  --text-strong:  #EAF5EF;
  --text-body:    #93A79D;
  --text-subtle:  #83968D;
  --text-faint:   #63756C;
  --page:         #050807;
  --surface:      #0C110F;
  --surface-2:    #121A16;
  --inset:        #18211D;
  --line:         #1E2A24;
  --line-strong:  #2C3D34;
  /* Brand tints become deep washes of the brand hue instead of pale mints,
     so hover reads as a lift out of the page rather than a flash. */
  --brand-soft:   #0A1A13;
  --brand-softer: #10281C;
  /* brand-500 only hits ~4.0:1 on this page, so links step up the ramp. */
  --accent-link:  #5FE3A1;

  /* Chips: deep tint + lifted label, so they sit *into* the page. */
  --ok:        #4ADE96;   --ok-soft:   #0B2418;
  --warn:      #F0C64E;   --warn-soft: #2A2210;
  --err:       #FF8E86;   --err-soft:  #2C1517;

  --sev-healthy:  #4ADE96;  --sev-healthy-soft:  #0B2418;
  --sev-mild:     #C9E265;  --sev-mild-soft:     #1E2410;
  --sev-moderate: #F0C64E;  --sev-moderate-soft: #2A2210;
  --sev-severe:   #FF9F5A;  --sev-severe-soft:   #2C1D10;
  --sev-critical: #FF8E86;  --sev-critical-soft: #2C1517;

  --background:             #050807;
  --foreground:             #EAF5EF;
  --card:                   #0C110F;
  --card-foreground:        #EAF5EF;
  --popover:                #0C110F;
  --popover-foreground:     #EAF5EF;
  --primary:                #34D88B;
  --primary-foreground:     #04150D;
  --secondary:              #18211D;
  --secondary-foreground:   #EAF5EF;
  --muted:                  #18211D;
  --muted-foreground:       #93A79D;
  --accent:                 #10281C;
  --accent-foreground:      #EAF5EF;
  --destructive:            #7F1D1D;
  --destructive-foreground: #FFE4E2;
  --border:                 #1E2A24;
  --input:                  #2C3D34;
  --ring:                   #34D88B;
}

/* ── BASE ─────────────────────────────────────────────────── */
* { border-color: var(--border); }

body {
  background-color: var(--page);
  color: var(--foreground);
  font-feature-settings: "rlig" 1, "calt" 1;
}

/* Native form controls, scrollbars etc. follow the theme */
:root { color-scheme: light; }
.dark { color-scheme: dark; }

/* unDraw art is drawn for light backgrounds — its big white fills glare on a
   near-black page. Knocking back brightness settles them in without washing
   out the brand-coloured accents. */
.dark img[src*="/illustrations/"] {
  filter: brightness(0.82) contrast(1.06);
}
```

### 3.1 Green buttons carry near-black labels

`--primary-foreground` is `#03150D`, not white. White on sweet green is ~2.8:1 and fails
AA; near-black on the same green is ~8:1 and looks better besides. Do not "fix" this by
darkening the green to make white work — the whole palette hangs off that green staying
bright.

### 3.2 Two gotchas that will cost you time

1. **Don't name a token `--color-muted`.** shadcn already owns it — redefining it silently
   repoints `bg-muted` at a text colour. Ours is `--color-body` for that reason.
2. **Never sed-replace `bg-white` globally.** Alpha variants (`bg-white/10`) on
   permanently-dark surfaces must stay literal white, and so must logo tiles.

### 3.3 The vocabulary you actually type

```
bg-page  bg-surface  bg-surface-2  bg-inset  bg-brand-soft  bg-brand-softer
text-ink  text-ink-soft  text-strong  text-body  text-subtle  text-faint  text-accent-link
border-line  border-line-strong
bg-ok-soft text-ok   bg-warn-soft text-warn   bg-err-soft text-err
bg-sev-severe-soft text-sev-severe   (and healthy / mild / moderate / critical)
bg-brand-500  text-brand-200  ring-brand-400
```

Shape: `rounded-xl` cards / inputs / buttons, `rounded-2xl` modals and the scan frame,
`rounded-full` pills / avatars / severity chips.
Elevation: `shadow-sm` card, `shadow-md` raised, `shadow-xl` modal. In dark mode shadows
barely read — separate surfaces with `bg-surface-2` and `border-line` instead of leaning
on shadow.

`cn` helper (`lib/utils.ts`):

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

---

## 4. Theme provider + toggle

Dark is the default here — the app was designed in it. Light is opt-in via the toggle,
and the choice is remembered.

```tsx
// components/theme-provider.tsx
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      // Transitions on every colour token would animate the whole page on a
      // switch, which reads as a slow smear rather than a flip.
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

`<html lang="en" suppressHydrationWarning>` is **required** — next-themes writes the class
before paint and the server render can't know about it.

```tsx
// components/theme-toggle.tsx
"use client";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

/** False during SSR and the hydration pass, true once on the client. */
function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function ThemeToggle({
  className,
  tone = "default",
}: { className?: string; tone?: "default" | "onDark" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const isDark = resolvedTheme === "dark";
  const label = !hydrated
    ? "Toggle theme"
    : isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={hydrated ? label : undefined}
      className={cn(
        "rounded-full p-2 transition-colors",
        tone === "onDark"
          ? "text-brand-200 hover:bg-white/10 hover:text-white"
          : "text-body hover:bg-brand-soft hover:text-accent-link",
        className,
      )}
    >
      {hydrated && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
```

`useSyncExternalStore` instead of the usual `useState(false)` + `useEffect(() =>
setMounted(true))` — the effect version trips React 19's `react-hooks/set-state-in-effect`
lint rule. `tone="onDark"` is for surfaces that stay near-black in both themes (sidebar,
footer), where the default colours wash out.

---

## 5. Sonner

```tsx
// components/themed-toaster.tsx
"use client";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

/**
 * Toaster tied to the app's own theme rather than sonner's "system" default.
 * Since the app theme is a stored choice, "system" would pop light toasts on
 * top of our dark UI for anyone whose OS is set to light.
 */
export function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      richColors
      position="top-right"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
```

That `theme={...}` line is the whole point — sonner defaults to `"system"`, which reads
the OS, not your app.

```tsx
import { toast } from "sonner";

toast.success("Scan complete — Tomato Late Blight detected");
toast.error("Pick or capture an image first");
toast.error(errorMessage(err, "Couldn't analyse that photo"));
toast.promise(uploadScan(file), {
  loading: "Analysing leaf…", success: "Diagnosis ready", error: "Analysis failed",
});
```

Typed error helper so you never write `catch (e: any)`:

```ts
// lib/api/errors.ts
export function apiError(error: unknown, fallback: string): Error {
  if (error instanceof Error && error.message) return error;
  return new Error(fallback);
}
export function errorMessage(error: unknown, fallback: string): string {
  return apiError(error, fallback).message;
}
```

---

## 6. Layout wiring

```tsx
// app/layout.tsx
<html lang="en" suppressHydrationWarning>
  <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
      <ThemedToaster />
    </ThemeProvider>
  </body>
</html>
```

---

## 7. unDraw

Source: <https://undraw.co/illustrations>. **Before downloading each one, set the colour
picker to `#16C172`** (brand-500) — that bakes the accent in so the art matches the
palette. Download SVG, drop into `public/illustrations/`.

Filenames must live under `/illustrations/` or the dark-mode brightness rule in §3 won't
catch them.

| File | unDraw search term | Used on |
|---|---|---|
| `hero-farm.svg` | "farm girl" / "gardening" | landing hero |
| `secure-login.svg` | "secure login" | login left panel |
| `welcome.svg` | "welcome" | register left panel |
| `forgot-password.svg` | "forgot password" | reset / forgot password |
| `scan-leaf.svg` | "camera" / "photograph" | scan page idle state |
| `analysis.svg` | "data processing" / "science" | analysing state |
| `diagnosis.svg` | "medicine" / "doctors" | diagnosis result header |
| `growth.svg` | "growth analytics" | dashboard stats band |
| `eco-farming.svg` | "eco conscious" / "environment" | landing "how it works" |
| `no-data.svg` | "no data" | empty tables / empty scan history |
| `empty-state.svg` | "empty" | crop library with no entries |
| `not-found.svg` | "void" / "page not found" | 404 |

Markup — plain `<img>`, **not** `next/image`. They're static SVGs; the optimiser adds
nothing and `next/image` needs width/height you don't want to hardcode. eslint will warn
`@next/next/no-img-element`; ignore it here.

```tsx
<img
  src="/illustrations/hero-farm.svg"
  alt="A farmer inspecting crops in a field"
  className="mx-auto w-full max-w-lg"
/>
```

Empty state — the pattern reused everywhere:

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <img src="/illustrations/no-data.svg" alt="" className="mb-6 h-40 w-auto" />
  <p className="text-xl font-semibold text-ink">No scans yet</p>
  <p className="mt-1 text-body">Photograph a leaf to get your first diagnosis</p>
</div>
```

`alt=""` on decorative ones so screen readers skip them; real `alt` text only where the
image carries meaning (hero, marketing sections).

Sizes in use: hero `w-full max-w-lg`, empty state `h-40 w-auto` (`h-32` in tables),
success page `w-64 sm:w-80`, side-by-side on legal pages `w-40 shrink-0`.

**If an illustration file is missing, do not invent a URL and do not fall back to a remote
CDN.** Render the empty state without art and leave a `TODO` naming the search term.

---

## 8. App structure

```
app/
  (marketing)/            page.tsx (landing), about, how-it-works
  (auth)/                 login, register, forgot-password
  (app)/                  farmer shell — sidebar + topbar
    dashboard/            stats, health trend, recent scans
    scan/                 capture → upload → analysing → result
    scans/                history list
    scans/[id]/           full diagnosis report
    crops/                crop & disease library
    settings/
  (admin)/                agronomist/admin shell
    admin/                overview: users, scan volume, outbreak trends
    admin/users/
    admin/scans/
    admin/knowledge/      crops, diseases, treatments CRUD
components/
  ui/                     button, card, input, badge, dialog, table, skeleton…
  scan/                   camera-capture, dropzone, severity-gauge, diagnosis-card
  charts/                 recharts wrappers (themed via CSS vars, see below)
  layout/                 sidebar, topbar, footer
lib/
  api/                    client.ts, auth.ts, scans.ts, errors.ts
  hooks/
  utils.ts
```

### Charts

Recharts gets colours from CSS vars, never hardcoded hex, so charts follow the theme:

```tsx
const css = getComputedStyle(document.documentElement);
const brand = css.getPropertyValue("--brand-500") || "#16C172";
```

Prefer passing `stroke="var(--accent-link)"` / `fill="var(--brand-500)"` directly where
recharts accepts a CSS value — it re-resolves on theme change with no re-render.

---

## 9. Roles

Two roles, mirrored from the backend `User.role`:

- **`FARMER`** — scans, own history, crop library, own dashboard.
- **`AGRONOMIST`** — everything a farmer has, plus `/admin`: all users, all scans,
  outbreak analytics, and knowledge-base CRUD. This is also the Django `is_staff` role.

Route protection is by layout: `(app)` requires any authenticated user, `(admin)` requires
`role === "AGRONOMIST"` and redirects farmers to `/dashboard`. Never rely on hiding the
nav link alone — the backend enforces it too, and so should the layout.

---

## 10. Conventions

- Server Components by default. `"use client"` only where you need state, effects, or
  browser APIs (camera, theme, toasts).
- Every list view needs three states: loading skeleton, empty (with unDraw art), error.
  A view without all three is not done.
- All API calls go through `lib/api/*`. No bare `fetch` in a component.
- No `any`. Use the typed error helpers in §5.
- Commit as **pheebemi** only. Do not add co-author trailers or AI attribution to commits,
  PR bodies, or code comments.
