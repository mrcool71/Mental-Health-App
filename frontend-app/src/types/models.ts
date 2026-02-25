export type Mood = "happy" | "good" | "okay" | "sad";

export interface MoodEntry {
  id: string;
  timestamp: number;
  mood: Mood;
  note?: string;
}

export interface AppState {
  history: MoodEntry[];
  score: number;
}

export type AppAction =
  | { type: "ADD_ENTRY"; payload: MoodEntry }
  | { type: "RESET" };
