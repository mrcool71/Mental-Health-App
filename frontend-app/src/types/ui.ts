import { Mood } from "./models";

export interface MoodBadgeProps {
  mood: Mood;
  label?: string;
  emoji?: string;
}

export interface ProgressRingProps {
  size?: number;
  value: number;
  max: number;
  label?: string;
  sublabel?: string;
}

export type QuickCheckMoodOption = {
  mood: Mood;
  label: string;
};
