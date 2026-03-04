import type {
  AccelerometerReading,
  LocationReading,
  MicrophoneReading,
  PermissionKey,
  PermissionStatus,
  SensorKey,
  SensorsState,
} from "./sensors";

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
  sensors: SensorsState;
}

export type AppAction =
  | { type: "ADD_ENTRY"; payload: MoodEntry }
  | { type: "ADD_NOTIFICATION_RESPONSE"; payload: NotificationResponse }
  | { type: "LOAD_NOTIFICATION_RESPONSES"; payload: NotificationResponse[] }
  | { type: "SET_ONBOARDED" }
  | { type: "SET_SENSOR_ENABLED"; payload: { sensor: SensorKey; enabled: boolean } }
  | { type: "SET_BACKGROUND_LOCATION_ENABLED"; payload: boolean }
  | { type: "SET_BACKGROUND_SENSORS_ENABLED"; payload: boolean }
  | { type: "SET_SENSOR_PERMISSION"; payload: { permission: PermissionKey; status: PermissionStatus } }
  | { type: "SET_SENSOR_ERROR"; payload: { sensor: SensorKey; error?: string } }
  | { type: "SET_LOCATION_READING"; payload?: LocationReading }
  | { type: "SET_ACCELEROMETER_READING"; payload?: AccelerometerReading }
  | { type: "SET_MICROPHONE_READING"; payload?: MicrophoneReading }
  | { type: "RESET" };
