import { AppState, Mood } from "../types/models";

export const moodScores: Record<Mood, number> = {
  happy: 95,
  good: 80,
  okay: 60,
  sad: 40,
};

export const initialState: AppState = {
  history: [],
  score: 70,
};
