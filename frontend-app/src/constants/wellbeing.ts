import theme from "../theme/theme";

/** Default breakdown stats used when specific measurements aren't available. */
export const WELLBEING_DEFAULT_STATS = {
  energy: 75,
  sleep: 85,
  social: 70,
};

/** Stat colour mapping keyed by label. */
export const WELLBEING_STAT_COLORS: Record<string, string> = {
  Mood: theme.colors.primary,
  Energy: theme.colors.accent,
  Sleep: theme.colors.lilac,
  Social: theme.colors.danger,
};

/** Tips returned for each score bracket. */
export const WELLBEING_TIPS: Record<string, string[]> = {
  low: ["Try a 5-minute breathing exercise", "Reach out to someone you trust"],
  moderate: [
    "A short walk can lift your mood",
    "Try logging your feelings daily",
  ],
  high: [
    "Connect with friends or family this week",
    "You're doing great! Keep up your healthy habits",
  ],
  excellent: [],
};
