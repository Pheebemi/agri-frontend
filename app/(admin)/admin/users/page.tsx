"use client";

import { useState } from "react";
import { Search, ShieldCheck, Sprout } from "lucide-react";

import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { RowSkeleton } from "@/components/ui/skeleton";
import { listUsers } from "@/lib/api/dashboard";
import { useAsync } from "@/lib/hooks/use-async";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

const ROLES = [
  { value: "", label: "Everyone" },
  { value: "FARMER", label: "Farmers" },
  { value: "AGRONOMIST", label: "Agronomists" },
];

export default function AdminUsersPage() {
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");

  const { data, loading, error, reload } = useAsync(
    () => listUsers({ role: role || undefined, search: search || undefined }),
    [role, search],
    "Couldn't load users",
  );

  return (
    <>
      <Topbar
        title="Users"
        description={data ? `${data.count} accounts` : undefined}
      />

      <div className="p-5 lg:p-8">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <Input
              placeholder="Search by email…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {ROLES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  role === option.value
                    ? "border-brand-400/30 bg-brand-softer text-accent-link"
                    : "border-line-strong text-subtle hover:border-brand-400/40 hover:text-accent-link",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <RowSkeleton count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : data?.results.length ? (
          <div className="space-y-2">
            {data.results.map((user) => {
              const isAgronomist = user.role === "AGRONOMIST";
              return (
                <div
                  key={user.id}
                  className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4"
                >
                  <span
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold",
                      isAgronomist
                        ? "bg-brand-softer text-accent-link"
                        : "bg-inset text-subtle",
                    )}
                  >
                    {user.initials}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">
                      {user.full_name || user.email}
                    </p>
                    <p className="truncate text-xs text-subtle">
                      {[user.email, user.farm_name, user.region].filter(Boolean).join(" · ")}
                    </p>
                  </div>

                  <div className="hidden shrink-0 text-right sm:block">
                    <span className="text-xs text-faint">
                      Joined {formatDate(user.date_joined)}
                    </span>
                  </div>

                  <Badge
                    className={
                      isAgronomist
                        ? "border-brand-400/25 bg-brand-softer text-accent-link"
                        : "border-line-strong bg-inset text-subtle"
                    }
                  >
                    {isAgronomist ? (
                      <ShieldCheck className="h-3 w-3" />
                    ) : (
                      <Sprout className="h-3 w-3" />
                    )}
                    {isAgronomist ? "Agronomist" : "Farmer"}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardBody>
              <EmptyState
                illustration="no-data"
                title="No accounts match that"
                description="Try a different search or role filter."
              />
            </CardBody>
          </Card>
        )}
      </div>

      <p className="px-5 pb-8 text-xs text-faint lg:px-8">
        Promoting a farmer to agronomist is done from the Django admin — staff
        access follows the role automatically.
      </p>
    </>
  );
}
