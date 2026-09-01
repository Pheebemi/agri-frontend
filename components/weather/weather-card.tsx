"use client";

import { useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { updateMe } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/errors";
import type { WeatherSearchResult } from "@/lib/api/types";
import { getWeatherForecast, searchWeatherLocations } from "@/lib/api/weather";
import { useAuth } from "@/lib/auth-context";
import { useAsync } from "@/lib/hooks/use-async";
import { weatherDisplay } from "@/lib/weather";

// Open-Meteo's own models update every 1-3 hours; re-fetching this often
// keeps "how likely is rain" current without hammering their free tier.
const REFRESH_INTERVAL_MS = 20 * 60 * 1000;

export function WeatherCard() {
  const { user } = useAuth();
  const hasLocation = user?.weather_latitude != null && user?.weather_longitude != null;
  const [editing, setEditing] = useState(!hasLocation);

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Weather</CardTitle>
          {hasLocation && !editing && (
            <p className="mt-1 flex items-center gap-1 text-sm text-body">
              <MapPin className="h-3.5 w-3.5" />
              {user.weather_location_label}
            </p>
          )}
        </div>
        {hasLocation && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-accent-link hover:underline"
          >
            Change
          </button>
        )}
      </CardHeader>
      <CardBody className="pt-4">
        {editing || !hasLocation ? (
          <LocationPicker onSaved={() => setEditing(false)} />
        ) : (
          <ForecastView latitude={user.weather_latitude!} longitude={user.weather_longitude!} />
        )}
      </CardBody>
    </Card>
  );
}

function LocationPicker({ onSaved }: { onSaved: () => void }) {
  const { refresh } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WeatherSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    // Nothing to clear synchronously for a too-short query — `visibleResults`
    // below derives the empty state instead, the same trick useAsync uses to
    // stay clear of React 19's set-state-in-effect rule.
    if (trimmed.length < 2) return;

    let active = true;
    const timer = setTimeout(() => {
      setSearching(true);
      searchWeatherLocations(trimmed)
        .then((data) => {
          if (active) setResults(data);
        })
        .catch(() => {
          if (active) setResults([]);
        })
        .finally(() => {
          if (active) setSearching(false);
        });
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const visibleResults = query.trim().length >= 2 ? results : [];

  async function saveLocation(latitude: number, longitude: number, label: string) {
    setSaving(true);
    try {
      await updateMe({
        weather_latitude: latitude,
        weather_longitude: longitude,
        weather_location_label: label,
      });
      await refresh();
      onSaved();
    } catch (caught) {
      toast.error(errorMessage(caught, "Couldn't save that location"));
    } finally {
      setSaving(false);
    }
  }

  function useMyLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("This browser can't share your location.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        void saveLocation(position.coords.latitude, position.coords.longitude, "Your location");
      },
      () => {
        setLocating(false);
        toast.error("Couldn't get your location — check your browser's location permission.");
      },
      { timeout: 10000 },
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for your town or state…"
          disabled={saving}
        />
        {visibleResults.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-line-strong bg-surface shadow-md">
            {visibleResults.map((result) => (
              <li key={`${result.latitude}-${result.longitude}`}>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void saveLocation(result.latitude, result.longitude, result.label)}
                  className="block w-full px-3.5 py-2.5 text-left text-sm text-strong hover:bg-brand-soft disabled:opacity-60"
                >
                  {result.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button type="button" variant="secondary" size="sm" loading={locating} onClick={useMyLocation}>
        <Navigation className="h-3.5 w-3.5" />
        Use my location
      </Button>
      {searching && <p className="text-xs text-faint">Searching…</p>}
    </div>
  );
}

function ForecastView({ latitude, longitude }: { latitude: number; longitude: number }) {
  const { data, loading, error, reload } = useAsync(
    () => getWeatherForecast(latitude, longitude),
    [latitude, longitude],
    "Couldn't load weather",
  );

  useEffect(() => {
    const interval = setInterval(reload, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [reload]);

  if (loading) return <Skeleton className="h-[180px] w-full" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return null;

  const today = data.daily[0]?.date;
  const todayHours = data.hourly.filter((hour) => hour.time.startsWith(today));
  // Roughly every 3 hours across the day — a compact but real time-of-day read.
  const ticks = todayHours.filter((_, index) => index % 3 === 0).slice(0, 8);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-faint">Today</p>
        <div className="mt-2 flex items-end justify-between gap-1">
          {ticks.map((hour) => {
            const { icon: Icon } = weatherDisplay(hour.weathercode, hour.is_day === 1);
            const pct = hour.precipitation_probability;
            return (
              <div key={hour.time} className="flex flex-1 flex-col items-center gap-1">
                <span className="font-mono text-[10px] text-subtle tabular-nums">{pct}%</span>
                <div className="flex h-10 w-full items-end overflow-hidden rounded bg-inset">
                  <div
                    className="w-full rounded bg-accent-link"
                    style={{ height: `${Math.max(pct, 4)}%` }}
                  />
                </div>
                <Icon className="h-3.5 w-3.5 text-subtle" />
                <span className="text-[10px] text-faint">{formatHour(hour.time)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 border-t border-line pt-4">
        {data.daily.map((day, index) => {
          const { icon: Icon, label } = weatherDisplay(day.weathercode);
          return (
            <div key={day.date} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-body">
                <Icon className="h-4 w-4 text-subtle" />
                <span className="font-medium text-ink">{dayLabel(day.date, index)}</span>
                <span className="text-xs text-faint">{label}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                <span className="text-accent-link">{day.precipitation_probability_max}%</span>
                <span className="text-subtle">
                  {Math.round(day.temperature_min)}°–{Math.round(day.temperature_max)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatHour(iso: string): string {
  // Locale forced to "en-US" rather than the device default — that's what
  // guarantees "9 AM" instead of a bare 24-hour "09" on locales that don't
  // print an AM/PM marker at all.
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
}

function dayLabel(dateStr: string, index: number): string {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return new Date(dateStr).toLocaleDateString([], { weekday: "short" });
}
