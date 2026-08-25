"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, ShieldQuestion } from "lucide-react";
import { toast } from "sonner";

import { Topbar } from "@/components/layout/topbar";
import { SeverityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { ConfidenceMeter } from "@/components/ui/confidence";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { Field, Select, Textarea } from "@/components/ui/input";
import { RowSkeleton } from "@/components/ui/skeleton";
import { listDiseases } from "@/lib/api/catalog";
import { errorMessage } from "@/lib/api/errors";
import { listScans, reviewScan } from "@/lib/api/scans";
import { useAsync } from "@/lib/hooks/use-async";
import { SEVERITY_ORDER, SEVERITY_STYLES } from "@/lib/severity";
import { mediaUrl, timeAgo } from "@/lib/utils";

export default function ReviewQueuePage() {
  const { data, loading, error, reload } = useAsync(
    () => listScans({ status: "NEEDS_REVIEW" }),
    [],
    "Couldn't load the review queue",
  );
  const { data: diseases } = useAsync(() => listDiseases(), [], "Couldn't load diseases");
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <>
      <Topbar
        title="Review queue"
        description="Confirm or correct the diagnoses the model wasn't sure about"
      />

      <div className="p-5 lg:p-8">
        {loading ? (
          <RowSkeleton count={5} />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : data?.results.length ? (
          <div className="space-y-3">
            {data.results.map((scan) => (
              <Card key={scan.id}>
                <CardBody className="space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={mediaUrl(scan.image)}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-xl border border-line-strong object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-warn/25 bg-warn-soft px-2.5 py-1 text-[11px] font-semibold text-warn">
                          <ShieldQuestion className="h-3 w-3" />
                          Needs review
                        </span>
                        {scan.severity && <SeverityBadge severity={scan.severity} />}
                      </div>
                      <p className="mt-2 truncate font-semibold text-ink">
                        {scan.disease_name || "Unmatched label"}
                      </p>
                      <p className="text-xs text-subtle">
                        {[scan.crop_name, scan.user_email, timeAgo(scan.created_at)]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <ConfidenceMeter
                        percent={scan.confidence_percent}
                        className="mt-3 max-w-xs"
                      />
                    </div>
                    <Link
                      href={`/scans/${scan.id}`}
                      className="hidden shrink-0 items-center gap-1 text-sm font-medium text-accent-link hover:underline sm:inline-flex"
                    >
                      Open
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {openId === scan.id ? (
                    <ReviewForm
                      scanId={scan.id}
                      diseases={diseases?.results ?? []}
                      onDone={() => {
                        setOpenId(null);
                        reload();
                      }}
                      onCancel={() => setOpenId(null)}
                    />
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => setOpenId(scan.id)}>
                      <Check className="h-3.5 w-3.5" />
                      Review this scan
                    </Button>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody>
              <EmptyState
                illustration="diagnosis"
                title="Queue is clear"
                description="Every diagnosis is either confident enough to stand on its own or has already been reviewed."
              />
            </CardBody>
          </Card>
        )}
      </div>
    </>
  );
}

function ReviewForm({
  scanId,
  diseases,
  onDone,
  onCancel,
}: {
  scanId: number;
  diseases: { id: number; name: string; crop_name: string }[];
  onDone: () => void;
  onCancel: () => void;
}) {
  const [disease, setDisease] = useState("");
  const [severity, setSeverity] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await reviewScan(scanId, {
        corrected_disease: disease ? Number(disease) : null,
        severity: severity || undefined,
        review_notes: notes,
      });
      toast.success("Diagnosis reviewed");
      onDone();
    } catch (caught) {
      toast.error(errorMessage(caught, "Couldn't save that review"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-xl border border-line bg-surface-2 p-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Correct diagnosis"
          htmlFor={`disease-${scanId}`}
          hint="Leave blank to confirm the model's call as-is."
        >
          <Select
            id={`disease-${scanId}`}
            value={disease}
            onChange={(event) => setDisease(event.target.value)}
          >
            <option value="">Confirm as diagnosed</option>
            {diseases.map((option) => (
              <option key={option.id} value={option.id}>
                {option.crop_name} — {option.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Severity" htmlFor={`severity-${scanId}`}>
          <Select
            id={`severity-${scanId}`}
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
          >
            <option value="">Leave unchanged</option>
            {SEVERITY_ORDER.map((level) => (
              <option key={level} value={level}>
                {SEVERITY_STYLES[level].label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label="Note for the farmer"
        htmlFor={`notes-${scanId}`}
        hint="Shown on their diagnosis report, so write it for them."
      >
        <Textarea
          id={`notes-${scanId}`}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Confirmed late blight — the white bloom on the underside is diagnostic. Start copper within 24 hours."
        />
      </Field>

      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={saving}>
          <Check className="h-3.5 w-3.5" />
          Save review
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
