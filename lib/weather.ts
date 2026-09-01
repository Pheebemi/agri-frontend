import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";

/**
 * Open-Meteo returns WMO weather codes (numbers), not names — this is the
 * only place that translates them, since the backend (apps/weather/client.py)
 * deliberately passes the raw code through untouched. Presentation-only, so
 * it belongs on the frontend, not baked into the API response.
 */
export function weatherDisplay(
  code: number,
  isDay: boolean = true,
): { icon: LucideIcon; label: string } {
  if (code === 0) {
    return isDay ? { icon: Sun, label: "Clear" } : { icon: Moon, label: "Clear" };
  }
  if (code === 1 || code === 2) return { icon: CloudSun, label: "Partly cloudy" };
  if (code === 3) return { icon: Cloud, label: "Overcast" };
  if (code === 45 || code === 48) return { icon: CloudFog, label: "Fog" };
  if ([51, 53, 55, 56, 57].includes(code)) return { icon: CloudDrizzle, label: "Drizzle" };
  if ([61, 63, 66, 80, 81].includes(code)) return { icon: CloudRain, label: "Rain likely" };
  if ([65, 67, 82].includes(code)) return { icon: CloudRain, label: "Heavy rain" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: CloudSnow, label: "Snow" };
  if ([95, 96, 99].includes(code)) return { icon: CloudLightning, label: "Thunderstorm" };
  return { icon: Cloud, label: "Cloudy" };
}
