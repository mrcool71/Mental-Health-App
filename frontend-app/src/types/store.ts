import {
  AppState,
  MoodEntry,
  NotificationResponse,
  Phq9Assessment,
} from "./models";
import type {
  AccelerometerReading,
  LocationReading,
  MicrophoneReading,
  PermissionKey,
  PermissionStatus,
  SensorKey,
} from "./sensors";

export interface StoreContextProps {
  state: AppState;
  isRestored: boolean;
  addEntry: (entry: MoodEntry) => void;
  addNotificationResponse: (response: NotificationResponse) => void;
  addPhq9Assessment: (assessment: Phq9Assessment) => void;
  setOnboarded: () => void;
  giveConsent: (timestamp?: number) => void;
  setProfileName: (name: string) => void;
  setDailyRemindersEnabled: (enabled: boolean) => void;
  setPreferredCheckInTime: (minutes: number) => void;
  setSensorEnabled: (sensor: SensorKey, enabled: boolean) => void;
  setBackgroundLocationEnabled: (enabled: boolean) => void;
  setBackgroundSensorsEnabled: (enabled: boolean) => void;
  setSensorPermission: (permission: PermissionKey, status: PermissionStatus) => void;
  setSensorError: (sensor: SensorKey, error?: string) => void;
  setLocationReading: (reading?: LocationReading) => void;
  setAccelerometerReading: (reading?: AccelerometerReading) => void;
  setMicrophoneReading: (reading?: MicrophoneReading) => void;
  clearMoodHistory: () => void;
  reset: () => void;
}
