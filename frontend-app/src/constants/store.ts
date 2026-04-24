import { AppState, Mood } from "../types/models";
import { DEFAULT_CHECK_IN_TIME_MINUTES } from "./notifications";

export const DEFAULT_DISPLAY_NAME = "Wellbeing Friend";

export const moodScores: Record<Mood, number> = {
  happy: 95,
  good: 80,
  okay: 60,
  sad: 40,
};

export const initialState: AppState = {
  history: [],
  score: 70,
  notificationResponses: [],
  phq9History: [],
  hasOnboarded: false,
  consentGiven: false,
  consentTimestamp: null,
  profile: {
    displayName: DEFAULT_DISPLAY_NAME,
    dailyRemindersEnabled: true,
    preferredCheckInTimeMinutes: DEFAULT_CHECK_IN_TIME_MINUTES,
  },
  sensors: {
    enabled: {
      location: false,
      accelerometer: false,
      microphone: false,
    },
    backgroundLocationEnabled: false,
    backgroundSensorsEnabled: false,
    permissions: {
      location: "undetermined",
      microphone: "undetermined",
    },
    errors: {},
  },
};
