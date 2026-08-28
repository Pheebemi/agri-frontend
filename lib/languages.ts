import type { Language } from "./api/types";

// Keep in sync with Scan.Language in agri-backend/apps/scans/models.py.
// Add Igbo here (code "ig") when it ships — nothing else about the
// translation mechanism is language-specific.
export const DIAGNOSIS_LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "pcm", label: "Pidgin" },
  { code: "ha", label: "Hausa" },
];
