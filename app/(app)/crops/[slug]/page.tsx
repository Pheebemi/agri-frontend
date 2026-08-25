"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Bug, ChevronRight } from "lucide-react";

import { Topbar } from "@/components/layout/topbar";
import { SeverityBadge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getCrop } from "@/lib/api/catalog";
import { useAsync } from "@/lib/hooks/use-async";

export default function CropDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: crop, loading, error, reload } = useAsync(
    () => getCrop(slug),
    [slug],
    "Couldn't load that crop",
  );

  if (loading) {
    return (
      <>
        <Topbar title="Crop" />
        <div className="space-y-4 p-5 lg:p-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </>
    );
  }

  if (error || !crop) {
    return (
      <>
        <Topbar title="Crop" />
        <div className="p-5 lg:p-8">
          <ErrorState message={error ?? "Crop not found"} onRetry={reload} />
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title={crop.name} description={crop.scientific_name || undefined} />

      <div className="p-5 lg:p-8">
        <Link
          href="/crops"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-body transition-colors hover:text-accent-link"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to library
        </Link>

        <Card className="mb-6">
          <CardBody>
            {crop.description && (
              <p className="leading-relaxed text-body">{crop.description}</p>
            )}
            <dl className="mt-5 grid gap-4 border-t border-line pt-4 sm:grid-cols-3">
              {[
                ["Family", crop.family],
                ["Growing season", crop.growing_season],
                ["Diseases covered", String(crop.disease_count)],
              ].map(([label, value]) =>
                value ? (
                  <div key={label}>
                    <dt className="text-xs font-medium uppercase tracking-wider text-faint">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
                  </div>
                ) : null,
              )}
            </dl>
          </CardBody>
        </Card>

        <h2 className="mb-4 text-lg font-semibold text-ink">
          Diseases affecting {crop.name.toLowerCase()}
        </h2>

        {crop.diseases.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {crop.diseases.map((disease) => (
              <div
                key={disease.id}
                className="group rounded-xl border border-line bg-surface p-5 transition-all hover:border-brand-400/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-ink">{disease.name}</h3>
                    {disease.pathogen && (
                      <p className="mt-0.5 text-xs italic text-subtle">{disease.pathogen}</p>
                    )}
                  </div>
                  <SeverityBadge severity={disease.default_severity} />
                </div>

                {disease.summary && (
                  <p className="mt-3 text-sm leading-relaxed text-body">{disease.summary}</p>
                )}

                <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
                  <Bug className="h-3.5 w-3.5 text-faint" />
                  <span className="text-xs text-subtle">{disease.kind_display}</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody>
              <EmptyState
                compact
                illustration="empty-state"
                title="No diseases recorded yet"
                description={`An agronomist hasn't added any diseases for ${crop.name.toLowerCase()}.`}
              />
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
}
