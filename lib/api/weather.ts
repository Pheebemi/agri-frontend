import { api } from "./client";
import type { WeatherForecast, WeatherSearchResult } from "./types";

export function searchWeatherLocations(query: string) {
  return api.get<WeatherSearchResult[]>(`/weather/search/?q=${encodeURIComponent(query)}`);
}

export function getWeatherForecast(latitude: number, longitude: number) {
  return api.get<WeatherForecast>(`/weather/forecast/?lat=${latitude}&lon=${longitude}`);
}
