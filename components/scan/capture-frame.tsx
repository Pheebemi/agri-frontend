"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, ImageUp, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Mode = "idle" | "camera" | "preview";

/**
 * Capture surface for a leaf photo — live camera on a phone, file picker
 * everywhere else.
 *
 * The camera is opt-in rather than auto-started: asking for permission the
 * moment the page loads gets denied far more often than asking after the user
 * has tapped a button that says "Use camera".
 */
export function CaptureFrame({
  onCapture,
  disabled,
}: {
  onCapture: (file: File, previewUrl: string) => void;
  disabled?: boolean;
}) {
  const [mode, setMode] = useState<Mode>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  // Releasing the camera on unmount matters — a live track keeps the phone's
  // capture LED on and drains the battery long after the user has navigated on.
  useEffect(() => stopCamera, [stopCamera]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setMode("camera");
      // The element only exists after the state flip, so attach on the next frame.
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      toast.error("Couldn't open the camera — pick a photo instead");
      fileInputRef.current?.click();
    }
  }

  function shoot() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error("Couldn't capture that frame");
          return;
        }
        const file = new File([blob], `scan-${Date.now()}.jpg`, { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        stopCamera();
        setPreview(url);
        setMode("preview");
        onCapture(file, url);
      },
      "image/jpeg",
      0.92,
    );
  }

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("That's not an image file");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setMode("preview");
    onCapture(file, url);
  }

  function reset() {
    stopCamera();
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setMode("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <div
        className={cn(
          "brand-glow relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-2 border-dashed",
          "border-line-strong bg-surface-2 sm:aspect-square",
          mode !== "idle" && "border-solid border-brand-400/40",
        )}
      >
        {mode === "idle" && (
          <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
            <img src="/illustrations/scan-leaf.svg" alt="" className="h-40 w-auto" />
            <div>
              <p className="font-semibold text-ink">Frame a single leaf</p>
              <p className="mt-1 max-w-xs text-sm text-body">
                Fill the frame with one affected leaf in even daylight. Avoid
                shadows and flash.
              </p>
            </div>
          </div>
        )}

        {mode === "camera" && (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            {/* Corner brackets + sweep, so it reads as a scanner rather than a video call. */}
            <div className="pointer-events-none absolute inset-6">
              {[
                "left-0 top-0 border-l-3 border-t-3 rounded-tl-xl",
                "right-0 top-0 border-r-3 border-t-3 rounded-tr-xl",
                "left-0 bottom-0 border-l-3 border-b-3 rounded-bl-xl",
                "right-0 bottom-0 border-r-3 border-b-3 rounded-br-xl",
              ].map((position) => (
                <span
                  key={position}
                  className={cn("absolute h-10 w-10 border-brand-400", position)}
                  style={{ borderWidth: 0, borderColor: "var(--color-brand-400)" }}
                />
              ))}
              <span className="absolute inset-x-0 top-0 h-0.5 bg-brand-400 animate-sweep" />
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="Close camera"
              className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white backdrop-blur transition-colors hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}

        {mode === "preview" && preview && (
          <>
            <img src={preview} alt="The leaf you captured" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={reset}
              disabled={disabled}
              aria-label="Choose a different photo"
              className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-2 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-black/75 disabled:opacity-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retake
            </button>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />

      {mode === "idle" && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button type="button" onClick={startCamera} size="lg">
            <Camera className="h-4 w-4" />
            Use camera
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageUp className="h-4 w-4" />
            Upload a photo
          </Button>
        </div>
      )}

      {mode === "camera" && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={shoot}
            aria-label="Take the photo"
            className="relative grid h-16 w-16 place-items-center rounded-full bg-brand-500 text-[#03150D] transition-transform active:scale-95"
          >
            <span className="absolute inset-0 rounded-full bg-brand-400 animate-pulse-ring" />
            <Camera className="relative h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
