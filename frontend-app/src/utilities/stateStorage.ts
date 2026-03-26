import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MoodEntry, Phq9Assessment } from "../types/models";

const KEYS = {
  history: "@mental_app/state/history",
  score: "@mental_app/state/score",
  phq9History: "@mental_app/state/phq9_history",
  hasOnboarded: "@mental_app/state/onboarded",
} as const;

/**
 * Persists the core app state to AsyncStorage.
 * Only saves the fields that are NOT already persisted elsewhere
 * (sensor readings and notification responses have their own storage).
 */
export async function saveState(state: {
  history: MoodEntry[];
  score: number;
  phq9History: Phq9Assessment[];
  hasOnboarded: boolean;
}): Promise<void> {
  try {
    await AsyncStorage.multiSet([
      [KEYS.history, JSON.stringify(state.history)],
      [KEYS.score, JSON.stringify(state.score)],
      [KEYS.phq9History, JSON.stringify(state.phq9History)],
      [KEYS.hasOnboarded, JSON.stringify(state.hasOnboarded)],
    ]);
  } catch (e) {
    console.error("[stateStorage] save failed:", e);
  }
}

/**
 * Loads persisted core state from AsyncStorage.
 * Returns only the fields that were successfully read.
 * Missing/corrupt fields are omitted so callers can merge with defaults.
 */
export async function loadState(): Promise<{
  history?: MoodEntry[];
  score?: number;
  phq9History?: Phq9Assessment[];
  hasOnboarded?: boolean;
}> {
  try {
    const pairs = await AsyncStorage.multiGet([
      KEYS.history,
      KEYS.score,
      KEYS.phq9History,
      KEYS.hasOnboarded,
    ]);

    const result: {
      history?: MoodEntry[];
      score?: number;
      phq9History?: Phq9Assessment[];
      hasOnboarded?: boolean;
    } = {};

    for (const [key, value] of pairs) {
      if (value === null) continue;
      try {
        const parsed = JSON.parse(value);
        switch (key) {
          case KEYS.history:
            if (Array.isArray(parsed)) result.history = parsed;
            break;
          case KEYS.score:
            if (typeof parsed === "number") result.score = parsed;
            break;
          case KEYS.phq9History:
            if (Array.isArray(parsed)) result.phq9History = parsed;
            break;
          case KEYS.hasOnboarded:
            if (typeof parsed === "boolean") result.hasOnboarded = parsed;
            break;
        }
      } catch {
        // Skip corrupt entries
      }
    }

    return result;
  } catch (e) {
    console.error("[stateStorage] load failed:", e);
    return {};
  }
}
