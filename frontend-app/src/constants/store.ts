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
  notificationResponses: [],
  phq9History: [],
  hasOnboarded: false,
  consentGiven: false,
  consentTimestamp: null,
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
