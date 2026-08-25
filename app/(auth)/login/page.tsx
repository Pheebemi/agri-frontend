"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { AuthPanel } from "@/components/layout/auth-panel";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { errorMessage } from "@/lib/api/errors";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.full_name || user.email}`);
      router.push(user.role === "AGRONOMIST" ? "/admin" : "/dashboard");
    } catch (caught) {
      const message = errorMessage(caught, "Couldn't sign you in");
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-5 py-8 lg:grid-cols-2 lg:py-12">
      <AuthPanel
        illustration="secure-login"
        title="Welcome back to AgriScan"
        body="Pick up where you left off — your scan history, your crops, and every diagnosis you've run."
        points={[
          "Your scans stay private to your account",
          "Full treatment plans on every diagnosis",
          "Diagnosis in seconds, every time",
        ]}
      />

      <div className="flex items-center justify-center">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold tracking-tight text-ink">Sign in</h1>
          <p className="mt-1.5 text-sm text-body">
            New here?{" "}
            <Link href="/register" className="font-medium text-accent-link hover:underline">
              Create an account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <Field label="Email address" htmlFor="email">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@farm.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>

            <Field label="Password" htmlFor="password" error={error ?? undefined}>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Field>

            <Button type="submit" block size="lg" loading={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
