import Link from "next/link";
import { ChevronRight, ImageOff } from "lucide-react";

import { SeverityBadge, StatusBadge } from "@/components/ui/badge";
import type { Scan } from "@/lib/api/types";
import { mediaUrl, timeAgo } from "@/lib/utils";

export function ScanRow({ scan, showOwner = false }: { scan: Scan; showOwner?: boolean }) {
  const image = mediaUrl(scan.image);

  return (
    <Link
      href={`/scans/${scan.id}`}
      className="group flex items-center gap-4 rounded-xl border border-line bg-surface p-3 transition-all hover:border-brand-400/40 hover:bg-surface-2"
    >
      {image ? (
        <img
          src={image}
          alt=""
          className="h-14 w-14 shrink-0 rounded-lg border border-line-strong object-cover"
        />
      ) : (
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-line-strong bg-inset text-faint">
          <ImageOff className="h-5 w-5" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">
          {scan.disease_name || "Awaiting diagnosis"}
        </p>
        <p className="mt-0.5 truncate text-xs text-subtle">
          {[scan.crop_name, showOwner ? scan.user_email : null, timeAgo(scan.created_at)]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        {scan.severity ? (
          <SeverityBadge severity={scan.severity} />
        ) : (
          <StatusBadge status={scan.status} label={scan.status_display} />
        )}
        {scan.confidence_percent > 0 && (
          <span className="font-mono text-xs text-faint tabular-nums">
            {scan.confidence_percent}%
          </span>
        )}
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent-link" />
    </Link>
  );
}
