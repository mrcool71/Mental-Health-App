import {
  PHQ9_SEVERITY_BANDS,
  PHQ9_SEVERITY_LABELS,
} from "../constants/phq9";
import type { EnergyLevel, Mood, Phq9Severity } from "../types/models";

export function getPhq9Severity(score: number): Phq9Severity {
  const clamped = Math.max(0, score);
  const match = PHQ9_SEVERITY_BANDS.find(
    (band) => clamped >= band.min && clamped <= band.max,
  );
  return match?.severity ?? "minimal";
}

export function getPhq9SeverityLabel(severity: Phq9Severity): string {
  return PHQ9_SEVERITY_LABELS[severity];
}

export function mapPhq9ScoreToMood(score: number): Mood {
  if (score <= 4) return "happy";
  if (score <= 9) return "good";
  if (score <= 14) return "okay";
  return "sad";
}

export function mapPhq9ScoreToEnergy(score: number): EnergyLevel {
  if (score <= 4) return "high";
  if (score <= 9) return "medium";
  return "low";
}
