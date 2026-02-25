export type Mood = "happy" | "good" | "okay" | "sad";

export type EnergyLevel = "high" | "medium" | "low";

export interface MoodEntry {
  id: string;
  timestamp: number;
  mood: Mood;
  energy?: EnergyLevel;
  note?: string;
}

export interface AppState {
  history: MoodEntry[];
  score: number;
  hasOnboarded: boolean;
}

export type AppAction =
  | { type: "ADD_ENTRY"; payload: MoodEntry }
  | { type: "SET_ONBOARDED" }
  | { type: "RESET" };
