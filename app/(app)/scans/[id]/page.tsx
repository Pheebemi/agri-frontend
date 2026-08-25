"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Bug,
  Cpu,
  Leaf,
  RefreshCw,
  ScanLine,
  ShieldQuestion,
  Sparkles,
  Sprout,
} from "lucide-react";
import { toast } from "sonner";

import { Topbar } from "@/components/layout/topbar";
import { TreatmentPlan } from "@/components/scan/treatment-plan";
import { Badge, SeverityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfidenceMeter, SeverityGauge } from "@/components/ui/confidence";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { errorMessage } from "@/lib/api/errors";
import { getScan, reanalyzeScan } from "@/lib/api/scans";
import { useAsync } from "@/lib/hooks/use-async";
import { SEVERITY_CHART_COLOR, severityStyle } from "@/lib/severity";
import { formatDate, mediaUrl } from "@/lib/utils";

export default function ScanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: scan, loading, error, reload } = useAsync(
    () => getScan(id),
    [id],
    "Couldn't load that scan",
  );
  const [reanalyzing, setReanalyzing] = useState(false);

  async function handleReanalyze() {
    setReanalyzing(true);
    try {
      await reanalyzeScan(Number(id));
      toast.success("Re-analysed");
      reload();
    } catch (caught) {
      toast.error(errorMessage(caught, "Couldn't re-analyse this scan"));
    } finally {
      setReanalyzing(false);
    }
  }

  if (loading) {
    return (
      <>
        <Topbar title="Diagnosis" />
        <div className="grid gap-6 p-5 lg:grid-cols-[380px_1fr] lg:p-8">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </>
    );
  }

  if (error || !scan) {
    return (
      <>
        <Topbar title="Diagnosis" />
        <div className="p-5 lg:p-8">
          <ErrorState message={error ?? "Scan not found"} onRetry={reload} />
        </div>
      </>
    );
  }

  const diagnosis = scan.diagnosis;
  const disease = diagnosis?.corrected_disease ?? diagnosis?.disease ?? null;
  const style = severityStyle(diagnosis?.severity);

  return (
    <>
      <Topbar
        title="Diagnosis report"
        description={`Scan #${scan.id} · ${formatDate(scan.created_at)}`}
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReanalyze}
            loading={reanalyzing}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Re-analyse
          </Button>
        }
      />

      <div className="p-5 lg:p-8">
        <Link
          href="/scans"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-body transition-colors hover:text-accent-link"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to history
        </Link>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* ── Left: the photo and the vitals ───────────────────── */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface">
              <img
                src={mediaUrl(scan.image)}
                alt="The leaf that was scanned"
                className="aspect-square w-full object-cover"
              />
            </div>

            {diagnosis && (
              <Card>
                <CardBody className="flex items-center gap-5">
                  <SeverityGauge
                    percent={diagnosis.affected_area_percent}
                    color={SEVERITY_CHART_COLOR[diagnosis.severity]}
                    caption="affected"
                  />
                  <div className="min-w-0 flex-1 space-y-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-faint">
                        Severity
                      </p>
                      <p className={`mt-1 text-xl font-bold ${style.text}`}>
                        {diagnosis.severity_display}
                      </p>
                    </div>
                    <ConfidenceMeter percent={diagnosis.confidence_percent} />
                  </div>
                </CardBody>
              </Card>
            )}

            <Card>
              <CardBody className="space-y-3 text-sm">
                <Detail icon={Sprout} label="Crop">
                  {scan.crop_name || "Not identified"}
                </Detail>
                <Detail icon={ScanLine} label="Status">
                  <StatusBadge status={scan.status} label={scan.status_display} />
                </Detail>
                {diagnosis?.provider && (
                  <Detail icon={Cpu} label="Analysed by">
                    <span className="font-mono text-xs">
                      {diagnosis.provider}
                      {diagnosis.model_version ? ` · ${diagnosis.model_version}` : ""}
                    </span>
                  </Detail>
                )}
                {scan.region && (
                  <Detail icon={Leaf} label="Region">
                    {scan.region}
                  </Detail>
                )}
                {scan.notes && (
                  <div className="border-t border-line pt-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-faint">
                      Your notes
                    </p>
                    <p className="mt-1.5 leading-relaxed text-body">{scan.notes}</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* ── Right: the verdict ───────────────────────────────── */}
          <div className="space-y-4">
            {!diagnosis ? (
              <Card>
                <CardBody>
                  <EmptyState
                    illustration="analysis"
                    title="No diagnosis on this scan"
                    description={
                      scan.error_message ||
                      "The pipeline hasn't produced a result for this image yet."
                    }
                    action={
                      <Button onClick={handleReanalyze} loading={reanalyzing}>
                        <RefreshCw className="h-4 w-4" />
                        Run the analysis
                      </Button>
                    }
                  />
                </CardBody>
              </Card>
            ) : (
              <>
                {/* Verdict header */}
                <Card raised>
                  <CardBody>
                    <div className="flex flex-wrap items-center gap-2">
                      <SeverityBadge severity={diagnosis.severity} />
                      {disease?.kind_display && (
                        <Badge className="border-line-strong bg-inset text-subtle">
                          <Bug className="h-3 w-3" />
                          {disease.kind_display}
                        </Badge>
                      )}
                      {diagnosis.corrected_disease && (
                        <Badge className="border-brand-400/25 bg-brand-softer text-accent-link">
                          Corrected by an agronomist
                        </Badge>
                      )}
                    </div>

                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
                      {disease?.name || diagnosis.raw_label || "Unidentified"}
                    </h2>
                    {disease?.pathogen && (
                      <p className="mt-1 text-sm italic text-subtle">{disease.pathogen}</p>
                    )}
                    {diagnosis.summary && (
                      <p className="mt-3 leading-relaxed text-body">{diagnosis.summary}</p>
                    )}

                    {diagnosis.needs_review && (
                      <div className="mt-4 flex gap-3 rounded-xl border border-warn/25 bg-warn-soft p-3.5">
                        <ShieldQuestion className="h-5 w-5 shrink-0 text-warn" />
                        <div>
                          <p className="text-sm font-semibold text-warn">
                            Flagged for agronomist review
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-body">
                            The model wasn&apos;t confident enough to stand behind this
                            call on its own. Treat it as a strong hint, and an
                            agronomist will confirm or correct it.
                          </p>
                        </div>
                      </div>
                    )}

                    {diagnosis.review_notes && (
                      <div className="mt-4 rounded-xl border border-brand-400/25 bg-brand-soft p-3.5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent-link">
                          Agronomist&apos;s note
                          {diagnosis.reviewed_by_name ? ` — ${diagnosis.reviewed_by_name}` : ""}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-body">
                          {diagnosis.review_notes}
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>

                {/* Symptoms & causes */}
                {disease && (disease.symptoms_list?.length || disease.causes_list?.length) && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {disease.symptoms_list?.length ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>What to look for</CardTitle>
                        </CardHeader>
                        <CardBody className="pt-3">
                          <ul className="space-y-2">
                            {disease.symptoms_list.map((symptom) => (
                              <li key={symptom} className="flex gap-2.5 text-sm text-body">
                                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${style.bar}`} />
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </CardBody>
                      </Card>
                    ) : null}

                    {disease.causes_list?.length ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Why it happened</CardTitle>
                        </CardHeader>
                        <CardBody className="pt-3">
                          <ul className="space-y-2">
                            {disease.causes_list.map((cause) => (
                              <li key={cause} className="flex gap-2.5 text-sm text-body">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong" />
                                {cause}
                              </li>
                            ))}
                          </ul>
                          {disease.spread && (
                            <p className="mt-4 border-t border-line pt-3 text-sm leading-relaxed text-subtle">
                              <span className="font-medium text-ink-soft">How it spreads: </span>
                              {disease.spread}
                            </p>
                          )}
                        </CardBody>
                      </Card>
                    ) : null}
                  </div>
                )}

                {/* Treatment */}
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Your treatment plan</CardTitle>
                      <p className="mt-1 text-sm text-body">
                        Pick the route that fits your farm.
                      </p>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-4">
                    {diagnosis.treatments_are_ai_suggested && (
                      <div className="mb-4 flex gap-2.5 rounded-xl border border-brand-400/25 bg-brand-soft p-3 text-sm text-body">
                        <Sparkles className="h-4 w-4 shrink-0 text-accent-link" />
                        <p>
                          This crop isn&apos;t in our field guide yet, so this plan is the
                          model&apos;s own suggestion rather than a vetted protocol. Treat
                          it as a starting point.
                        </p>
                      </div>
                    )}
                    <TreatmentPlan treatments={diagnosis.treatments} />
                  </CardBody>
                </Card>

                {/* Alternatives */}
                {diagnosis.candidates.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div>
                        <CardTitle>It might also be</CardTitle>
                        <p className="mt-1 text-sm text-body">
                          Runners-up from the model. Worth checking if the call above
                          doesn&apos;t match what you see.
                        </p>
                      </div>
                      <AlertTriangle className="h-4 w-4 text-faint" />
                    </CardHeader>
                    <CardBody className="pt-4">
                      <ul className="space-y-2">
                        {diagnosis.candidates.map((candidate) => (
                          <li
                            key={candidate.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3"
                          >
                            <span className="min-w-0 truncate text-sm font-medium text-ink">
                              {candidate.disease_name || candidate.raw_label}
                            </span>
                            <span className="shrink-0 font-mono text-xs text-subtle tabular-nums">
                              {candidate.confidence_percent}%
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-subtle">
        <Icon className="h-4 w-4 text-faint" />
        {label}
      </span>
      <span className="min-w-0 truncate font-medium text-ink">{children}</span>
    </div>
  );
}
