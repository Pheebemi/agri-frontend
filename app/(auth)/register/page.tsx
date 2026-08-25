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

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    farm_name: "",
    region: "",
    password: "",
    password_confirm: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((previous) => ({ ...previous, [field]: event.target.value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (form.password !== form.password_confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await register(form);
      toast.success("Account created — let's scan your first leaf");
      router.push("/scan");
    } catch (caught) {
      const message = errorMessage(caught, "Couldn't create your account");
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-5 py-8 lg:grid-cols-2 lg:py-12">
      <AuthPanel
        illustration="welcome"
        title="Start diagnosing in two minutes"
        body="Free to create, no card required. Photograph a leaf and get a graded diagnosis with a treatment plan."
        points={[
          "A crop and disease field guide, always at hand",
          "Organic and chemical treatment routes",
          "Low-confidence results reviewed by an agronomist",
        ]}
      />

      <div className="flex items-center justify-center">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold tracking-tight text-ink">Create your account</h1>
          <p className="mt-1.5 text-sm text-body">
            Already registered?{" "}
            <Link href="/login" className="font-medium text-accent-link hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <Field label="Full name" htmlFor="full_name">
              <Input
                id="full_name"
                required
                placeholder="Amara Okafor"
                value={form.full_name}
                onChange={update("full_name")}
              />
            </Field>

            <Field label="Email address" htmlFor="email">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@farm.com"
                value={form.email}
                onChange={update("email")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Farm name" htmlFor="farm_name">
                <Input
                  id="farm_name"
                  placeholder="Green Valley"
                  value={form.farm_name}
                  onChange={update("farm_name")}
                />
              </Field>
              <Field label="Region" htmlFor="region">
                <Input
                  id="region"
                  placeholder="Enugu"
                  value={form.region}
                  onChange={update("region")}
                />
              </Field>
            </div>

            <Field label="Password" htmlFor="password" hint="At least 8 characters.">
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="••••••••"
                value={form.password}
                onChange={update("password")}
              />
            </Field>

            <Field
              label="Confirm password"
              htmlFor="password_confirm"
              error={error ?? undefined}
            >
              <Input
                id="password_confirm"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={form.password_confirm}
                onChange={update("password_confirm")}
              />
            </Field>

            <Button type="submit" block size="lg" loading={submitting}>
              {submitting ? "Creating account…" : "Create account"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </Button>

            <p className="text-center text-xs leading-relaxed text-faint">
              New accounts are farmer accounts. Agronomist access is granted by an
              administrator.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
