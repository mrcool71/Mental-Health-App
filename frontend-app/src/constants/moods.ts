import { Mood } from "../types/models";
import type { QuickCheckMoodOption } from "../types/ui";
import { colors } from "../theme/theme";

export const MOOD_COLORS: Record<Mood, string> = {
  happy: colors.primary,
  good: colors.accent,
  okay: colors.lilac,
  sad: colors.danger,
};

export const quickCheckMoods: QuickCheckMoodOption[] = [
  { mood: "happy", label: "Happy" },
  { mood: "good", label: "Good" },
  { mood: "okay", label: "Okay" },
  { mood: "sad", label: "Sad" },
];

export const moodEmoji: Record<Mood, string> = {
  happy: "\uD83D\uDE38",
  good: "\uD83D\uDE3A",
  okay: "\uD83D\uDE3C",
  sad: "\uD83D\uDE40",
};
