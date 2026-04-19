import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MoodEntry, Phq9Assessment } from "../types/models";

const KEYS = {
  history: "@mental_app/state/history",
  score: "@mental_app/state/score",
  phq9History: "@mental_app/state/phq9_history",
  hasOnboarded: "@mental_app/state/onboarded",
  consentGiven: "@mental_app/state/consent_given",
  consentTimestamp: "@mental_app/state/consent_timestamp",
  sensorsEnabled: "@mental_app/state/sensors_enabled",
  backgroundLocationEnabled: "@mental_app/state/bg_location_enabled",
  backgroundSensorsEnabled: "@mental_app/state/bg_sensors_enabled",
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
  consentGiven: boolean;
  consentTimestamp: number | null;
  sensorsEnabled: Record<string, boolean>;
  backgroundLocationEnabled: boolean;
  backgroundSensorsEnabled: boolean;
}): Promise<void> {
  try {
    await AsyncStorage.multiSet([
      [KEYS.history, JSON.stringify(state.history)],
      [KEYS.score, JSON.stringify(state.score)],
      [KEYS.phq9History, JSON.stringify(state.phq9History)],
      [KEYS.hasOnboarded, JSON.stringify(state.hasOnboarded)],
      [KEYS.consentGiven, JSON.stringify(state.consentGiven)],
      [KEYS.consentTimestamp, JSON.stringify(state.consentTimestamp)],
      [KEYS.sensorsEnabled, JSON.stringify(state.sensorsEnabled)],
      [KEYS.backgroundLocationEnabled, JSON.stringify(state.backgroundLocationEnabled)],
      [KEYS.backgroundSensorsEnabled, JSON.stringify(state.backgroundSensorsEnabled)],
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
  consentGiven?: boolean;
  consentTimestamp?: number | null;
  sensors?: {
    enabled?: Record<string, boolean>;
    backgroundLocationEnabled?: boolean;
    backgroundSensorsEnabled?: boolean;
  };
}> {
  try {
    const pairs = await AsyncStorage.multiGet([
      KEYS.history,
      KEYS.score,
      KEYS.phq9History,
      KEYS.hasOnboarded,
      KEYS.consentGiven,
      KEYS.consentTimestamp,
      KEYS.sensorsEnabled,
      KEYS.backgroundLocationEnabled,
      KEYS.backgroundSensorsEnabled,
    ]);

    const result: {
      history?: MoodEntry[];
      score?: number;
      phq9History?: Phq9Assessment[];
      hasOnboarded?: boolean;
      consentGiven?: boolean;
      consentTimestamp?: number | null;
      sensors?: {
        enabled?: Record<string, boolean>;
        backgroundLocationEnabled?: boolean;
        backgroundSensorsEnabled?: boolean;
      };
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
          case KEYS.consentGiven:
            if (typeof parsed === "boolean") result.consentGiven = parsed;
            break;
          case KEYS.consentTimestamp:
            if (typeof parsed === "number" || parsed === null) result.consentTimestamp = parsed;
            break;
          case KEYS.sensorsEnabled:
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
              result.sensors = result.sensors ?? {};
              result.sensors.enabled = parsed;
            }
            break;
          case KEYS.backgroundLocationEnabled:
            if (typeof parsed === "boolean") {
              result.sensors = result.sensors ?? {};
              result.sensors.backgroundLocationEnabled = parsed;
            }
            break;
          case KEYS.backgroundSensorsEnabled:
            if (typeof parsed === "boolean") {
              result.sensors = result.sensors ?? {};
              result.sensors.backgroundSensorsEnabled = parsed;
            }
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
