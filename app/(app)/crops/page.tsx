"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Leaf, Search } from "lucide-react";

import { Topbar } from "@/components/layout/topbar";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { listCrops } from "@/lib/api/catalog";
import { useAsync } from "@/lib/hooks/use-async";

export default function CropsPage() {
  const [search, setSearch] = useState("");
  const { data, loading, error, reload } = useAsync(
    () => listCrops(search || undefined),
    [search],
    "Couldn't load the crop library",
  );

  return (
    <>
      <Topbar
        title="Crop library"
        description="Field guides for every crop and disease we diagnose"
      />

      <div className="p-5 lg:p-8">
        <div className="relative mb-6 max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <Input
            placeholder="Search crops…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : data?.results.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.results.map((crop) => (
              <Link
                key={crop.id}
                href={`/crops/${crop.slug}`}
                className="group rounded-xl border border-line bg-surface p-5 shadow-sm transition-all hover:border-brand-400/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-softer text-accent-link">
                    <Leaf className="h-5 w-5" />
                  </span>
                  <ChevronRight className="h-4 w-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent-link" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-ink">{crop.name}</h3>
                {crop.scientific_name && (
                  <p className="text-xs italic text-subtle">{crop.scientific_name}</p>
                )}
                {crop.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-body">
                    {crop.description}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-3 border-t border-line pt-3">
                  <span className="font-mono text-xs text-subtle tabular-nums">
                    {crop.disease_count} {crop.disease_count === 1 ? "disease" : "diseases"}
                  </span>
                  {crop.growing_season && (
                    <span className="truncate text-xs text-faint">{crop.growing_season}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody>
              <EmptyState
                illustration="empty-state"
                title={search ? "No crop matches that" : "The library is empty"}
                description={
                  search
                    ? "Try a different name."
                    : "An agronomist hasn't added any crops yet."
                }
              />
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
}
