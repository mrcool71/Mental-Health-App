import { MoodEntry } from "./models";

export type OnboardingSlide = {
  id: string;
  icon: string;
  title: string;
  body: string;
};

export type QuickAction = {
  title: string;
  emoji: string;
  subtitle: string;
};

export type LearnMoreItem = {
  title: string;
  subtitle: string;
};

export type HistorySection = {
  title: string;
  data: MoodEntry[];
};
