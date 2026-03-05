export type Mood = "happy" | "good" | "okay" | "sad";

export type EnergyLevel = "high" | "medium" | "low";

export interface MoodEntry {
  id: string;
  timestamp: number;
  mood: Mood;
  energy?: EnergyLevel;
  note?: string;
}

/** Saved response when a user answers a scheduled notification question. */
export interface NotificationResponse {
  /** Unique id (notification id + timestamp). */
  id: string;
  questionId: number;
  questionText: string;
  /** Zero-based index of the chosen option. */
  optionIndex: number;
  optionText: string;
  timestamp: number;
}

export interface AppState {
  history: MoodEntry[];
  score: number;
  notificationResponses: NotificationResponse[];
  hasOnboarded: boolean;
}

export type AppAction =
  | { type: "ADD_ENTRY"; payload: MoodEntry }
  | { type: "ADD_NOTIFICATION_RESPONSE"; payload: NotificationResponse }
  | { type: "LOAD_NOTIFICATION_RESPONSES"; payload: NotificationResponse[] }
  | { type: "SET_ONBOARDED" }
  | { type: "RESET" };
