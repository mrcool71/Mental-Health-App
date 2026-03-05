import {
  AppState,
  MoodEntry,
  NotificationResponse,
  Phq9Assessment,
} from "./models";

export interface StoreContextProps {
  state: AppState;
  addEntry: (entry: MoodEntry) => void;
  addNotificationResponse: (response: NotificationResponse) => void;
  addPhq9Assessment: (assessment: Phq9Assessment) => void;
  setOnboarded: () => void;
  reset: () => void;
}
