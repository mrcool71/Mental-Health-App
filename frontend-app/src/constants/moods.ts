import { Mood } from "../types/models";
import type { QuickCheckMoodOption } from "../types/ui";

export const quickCheckMoods: QuickCheckMoodOption[] = [
  { mood: "happy", label: "Happy", variant: "primary" },
  { mood: "good", label: "Good", variant: "secondary" },
  { mood: "okay", label: "Okay", variant: "ghost" },
  { mood: "sad", label: "Sad", variant: "ghost" },
];

export const moodEmoji: Record<Mood, string> = {
  happy: "\uD83D\uDE38",
  good: "\uD83D\uDE3A",
  okay: "\uD83D\uDE3C",
  sad: "\uD83D\uDE40",
};
