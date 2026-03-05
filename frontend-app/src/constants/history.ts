import { EnergyLevel, Mood } from "../types/models";

export const QUICK_CHECK_TIMEOUT_MS = 800;

/** Canonical energy-level metadata shared across QuickCheck and History. */
export const ENERGY_LEVELS: Record<
  EnergyLevel,
  { emoji: string; label: string }
> = {
  high: { emoji: "⚡", label: "High Energy" },
  medium: { emoji: "✨", label: "Medium" },
  low: { emoji: "🌙", label: "Low Energy" },
};

/** Convenience array for QuickCheck option rendering. */
export const ENERGY_OPTIONS = (
  Object.keys(ENERGY_LEVELS) as EnergyLevel[]
).map((level) => ({
  level,
  ...ENERGY_LEVELS[level],
}));

/** Filter chips shown in the History screen's horizontal scroll. */
export const HISTORY_FILTER_OPTIONS: Array<{
  label: string;
  value: Mood | "all";
}> = [
  { label: "All", value: "all" },
  { label: "Happy", value: "happy" },
  { label: "Good", value: "good" },
  { label: "Okay", value: "okay" },
  { label: "Sad", value: "sad" },
];
