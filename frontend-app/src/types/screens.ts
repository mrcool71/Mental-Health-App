import { MoodEntry, NotificationResponse } from "./models";

export type HistorySection = {
  title: string;
  data: MoodEntry[];
};

/** Union item used in the unified History timeline. */
export type HistoryItem =
  | { type: "mood"; data: MoodEntry }
  | { type: "notification"; data: NotificationResponse };

export type UnifiedHistorySection = {
  title: string;
  data: HistoryItem[];
};
