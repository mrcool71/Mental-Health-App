import { AppState, MoodEntry } from "./models";

export interface StoreContextProps {
  state: AppState;
  addEntry: (entry: MoodEntry) => void;
  setOnboarded: () => void;
  reset: () => void;
}
