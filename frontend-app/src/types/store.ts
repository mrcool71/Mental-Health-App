import { AppState, MoodEntry, NotificationResponse } from "./models";

export interface StoreContextProps {
  state: AppState;
  addEntry: (entry: MoodEntry) => void;
  addNotificationResponse: (response: NotificationResponse) => void;
}
