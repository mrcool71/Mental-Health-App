import type { Phq9Severity } from "../types/models";

export interface Phq9Question {
  id: number;
  prompt: string;
}

export const PHQ9_OPTIONS = [
  { score: 0, label: "Not at all" },
  { score: 1, label: "Several days" },
  { score: 2, label: "More than half the days" },
  { score: 3, label: "Nearly every day" },
] as const;

export const PHQ9_QUESTIONS: Phq9Question[] = [
  { id: 1, prompt: "Little interest or pleasure in doing things" },
  { id: 2, prompt: "Feeling down, depressed, or hopeless" },
  {
    id: 3,
    prompt: "Trouble falling or staying asleep, or sleeping too much",
  },
  { id: 4, prompt: "Feeling tired or having little energy" },
  { id: 5, prompt: "Poor appetite or overeating" },
  {
    id: 6,
    prompt:
      "Feeling bad about yourself, or that you are a failure or have let yourself or your family down",
  },
  {
    id: 7,
    prompt:
      "Trouble concentrating on things, such as reading or watching television",
  },
  {
    id: 8,
    prompt:
      "Moving or speaking slowly, or being so fidgety/restless that others could notice",
  },
  {
    id: 9,
    prompt:
      "Thoughts that you would be better off dead, or of hurting yourself in some way",
  },
];

export const PHQ9_MAX_SCORE = 27;

export const PHQ9_SEVERITY_BANDS: Array<{
  min: number;
  max: number;
  severity: Phq9Severity;
}> = [
  { min: 0, max: 4, severity: "minimal" },
  { min: 5, max: 9, severity: "minor" },
  { min: 10, max: 14, severity: "moderate" },
  { min: 15, max: 19, severity: "moderatelySevere" },
  { min: 20, max: PHQ9_MAX_SCORE, severity: "severe" },
];

export const PHQ9_SEVERITY_LABELS: Record<Phq9Severity, string> = {
  minimal: "Minimal",
  minor: "Minor",
  moderate: "Moderate",
  moderatelySevere: "Moderately Severe",
  severe: "Severe",
};
