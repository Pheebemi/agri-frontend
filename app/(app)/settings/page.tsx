"use client";

import { useState } from "react";
import { LogOut, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { updateMe } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/errors";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/utils";

export default function SettingsPage() {
  const { user, refresh, logout, isAgronomist } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name ?? "",
    phone: user?.phone ?? "",
    farm_name: user?.farm_name ?? "",
    region: user?.region ?? "",
  });
  const [saving, setSaving] = useState(false);

  function update(field: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((previous) => ({ ...previous, [field]: event.target.value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await updateMe(form);
      await refresh();
      toast.success("Profile saved");
    } catch (caught) {
      toast.error(errorMessage(caught, "Couldn't save your profile"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Topbar title="Settings" description="Your profile and account" />

      <div className="mx-auto max-w-3xl space-y-4 p-5 lg:p-8">
        <Card>
          <CardBody className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-softer text-xl font-bold text-accent-link">
              {user?.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-ink">
                {user?.full_name || user?.email}
              </p>
              <p className="truncate text-sm text-body">{user?.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  className={
                    isAgronomist
                      ? "border-brand-400/25 bg-brand-softer text-accent-link"
                      : "border-line-strong bg-inset text-subtle"
                  }
                >
                  {isAgronomist && <ShieldCheck className="h-3 w-3" />}
                  {isAgronomist ? "Agronomist" : "Farmer"}
                </Badge>
                {user?.date_joined && (
                  <span className="text-xs text-faint">
                    Joined {formatDate(user.date_joined)}
                  </span>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Profile</CardTitle>
              <p className="mt-1 text-sm text-body">
                Your region is attached to each scan, which is what powers the
                outbreak map.
              </p>
            </div>
          </CardHeader>
          <CardBody className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="full_name">
                  <Input id="full_name" value={form.full_name} onChange={update("full_name")} />
                </Field>
                <Field label="Phone" htmlFor="phone">
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="+234 800 000 0000"
                  />
                </Field>
                <Field label="Farm name" htmlFor="farm_name">
                  <Input id="farm_name" value={form.farm_name} onChange={update("farm_name")} />
                </Field>
                <Field label="Region" htmlFor="region">
                  <Input id="region" value={form.region} onChange={update("region")} />
                </Field>
              </div>

              <Field label="Email address" htmlFor="email" hint="Your email can't be changed here.">
                <Input id="email" value={user?.email ?? ""} disabled />
              </Field>

              <Button type="submit" loading={saving}>
                <Save className="h-4 w-4" />
                Save changes
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session</CardTitle>
          </CardHeader>
          <CardBody className="pt-4">
            <Button variant="danger" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
