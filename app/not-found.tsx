import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-page px-6">
      <div className="flex flex-col items-center text-center">
        <img src="/illustrations/not-found.svg" alt="" className="mb-8 w-full max-w-sm" />
        <h1 className="text-2xl font-bold text-ink">This page isn&apos;t here</h1>
        <p className="mt-2 max-w-sm text-body">
          The link may be out of date, or the scan you were looking for has been removed.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-[#03150D] transition-colors hover:bg-brand-400"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
