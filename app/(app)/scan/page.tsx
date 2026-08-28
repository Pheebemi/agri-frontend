"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Topbar } from "@/components/layout/topbar";
import { AnalyzingOverlay } from "@/components/scan/analyzing-overlay";
import { CaptureFrame } from "@/components/scan/capture-frame";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Field, Select, Textarea } from "@/components/ui/input";
import { listCrops } from "@/lib/api/catalog";
import { errorMessage } from "@/lib/api/errors";
import { createScan } from "@/lib/api/scans";
import type { Language } from "@/lib/api/types";
import { useAuth } from "@/lib/auth-context";
import { useAsync } from "@/lib/hooks/use-async";
import { DIAGNOSIS_LANGUAGES } from "@/lib/languages";

const TIPS = [
  "One leaf, filling most of the frame",
  "Even daylight — no flash, no hard shadow",
  "Hold steady until the image is sharp",
  "Include the affected area, not just healthy tissue",
];

export default function ScanPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: crops } = useAsync(() => listCrops(), [], "Couldn't load the crop list");

  const [file, setFile] = useState<File | null>(null);
  const [declaredCrop, setDeclaredCrop] = useState("");
  const [language, setLanguage] = useState<Language | "">("");
  const [notes, setNotes] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      toast.error("Capture or upload a leaf photo first");
      return;
    }
    if (!language) {
      toast.error("Pick a language for the diagnosis first");
      return;
    }

    setAnalyzing(true);
    try {
      const scan = await createScan({
        image: file,
        declaredCrop: declaredCrop ? Number(declaredCrop) : null,
        language,
        notes,
        region: user?.region,
      });

      if (scan.status === "FAILED") {
        toast.error(scan.error_message || "That image couldn't be analysed");
        setAnalyzing(false);
        return;
      }

      toast.success(
        scan.diagnosis?.disease?.name
          ? `Diagnosis ready — ${scan.diagnosis.disease.name}`
          : "Diagnosis ready",
      );
      router.push(`/scans/${scan.id}`);
    } catch (caught) {
      toast.error(errorMessage(caught, "Couldn't analyse that photo"));
      setAnalyzing(false);
    }
  }

  return (
    <>
      {analyzing && <AnalyzingOverlay />}

      <Topbar
        title="New scan"
        description="Photograph a leaf and get a graded diagnosis"
      />

      <form onSubmit={handleSubmit} className="p-5 lg:p-8">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <CaptureFrame
              disabled={analyzing}
              onCapture={(captured) => setFile(captured)}
            />
          </div>

          <div className="space-y-4">
            <Card>
              <CardBody className="space-y-4">
                <Field
                  label="Which crop is this?"
                  htmlFor="crop"
                  hint="Optional — it narrows the diagnosis, and we'll correct you if the photo says otherwise."
                >
                  <Select
                    id="crop"
                    value={declaredCrop}
                    onChange={(event) => setDeclaredCrop(event.target.value)}
                  >
                    <option value="">I&apos;m not sure</option>
                    {crops?.results.map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field
                  label="Diagnosis language"
                  htmlFor="language"
                  hint="Required — the diagnosis and treatment plan come back in this language."
                >
                  <Select
                    id="language"
                    required
                    value={language}
                    onChange={(event) => setLanguage(event.target.value as Language)}
                  >
                    <option value="" disabled>
                      Choose a language
                    </option>
                    {DIAGNOSIS_LANGUAGES.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field
                  label="Anything else worth knowing?"
                  htmlFor="notes"
                  hint="Recent weather, what you've already sprayed, how long it's been spreading."
                >
                  <Textarea
                    id="notes"
                    placeholder="Started on the lower leaves after three days of rain…"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                  />
                </Field>

                <Button
                  type="submit"
                  block
                  size="lg"
                  loading={analyzing}
                  disabled={!file || !language || analyzing}
                >
                  <Sparkles className="h-4 w-4" />
                  {analyzing ? "Analysing…" : "Diagnose this leaf"}
                </Button>

                {(!file || !language) && (
                  <p className="text-center text-xs text-faint">
                    {!file
                      ? "Capture or upload a photo to enable this."
                      : "Choose a language to enable this."}
                  </p>
                )}
              </CardBody>
            </Card>

            <Card className="border-brand-400/25 bg-brand-soft">
              <CardBody>
                <p className="flex items-center gap-2 text-sm font-semibold text-accent-link">
                  <Info className="h-4 w-4" />
                  For the sharpest diagnosis
                </p>
                <ul className="mt-3 space-y-2">
                  {TIPS.map((tip) => (
                    <li key={tip} className="flex gap-2.5 text-sm text-body">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </form>
    </>
  );
}
