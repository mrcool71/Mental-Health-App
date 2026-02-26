import { EnergyLevel, Mood } from "../types/models";

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

/** Energy-level metadata used in the History entry cards. */
export const ENERGY_META: Record<
  EnergyLevel,
  { emoji: string; label: string }
> = {
  high: { emoji: "⚡", label: "High Energy" },
  medium: { emoji: "✨", label: "Medium" },
  low: { emoji: "🌙", label: "Low Energy" },
};
