import { MoodEntry } from "../types/models";
import { initialState, moodScores } from "../constants/store";

/**
 * Computes the average wellbeing score from an array of mood entries.
 * Falls back to the initial default score when the array is empty.
 */
export function calculateScore(entries: MoodEntry[]): number {
  if (!entries.length) return initialState.score;
  const total = entries.reduce((sum, entry) => sum + moodScores[entry.mood], 0);
  return Math.round(total / entries.length);
}

/**
 * Returns a human-friendly label describing the wellbeing score range.
 */
export const getScoreLabel = (score: number): string => {
  if (score >= 90) return "Excellent — thriving!";
  if (score >= 70) return "Good — keep it up!";
  if (score >= 50) return "Okay — you're doing fine.";
  return "Low — be gentle with yourself.";
};
