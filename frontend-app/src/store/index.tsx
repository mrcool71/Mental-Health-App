import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  ReactNode,
} from "react";
import { AppAction, AppState, MoodEntry } from "../types/models";
import { initialState, moodScores } from "../constants/store";
import type { StoreContextProps } from "../types/store";

function calculateScore(entries: MoodEntry[]): number {
  if (!entries.length) return initialState.score;
  const total = entries.reduce((sum, entry) => sum + moodScores[entry.mood], 0);
  return Math.round(total / entries.length);
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_ENTRY": {
      const history = [action.payload, ...state.history];
      const score = calculateScore(history);
      return { ...state, history, score };
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addEntry = (entry: MoodEntry) => {
    dispatch({ type: "ADD_ENTRY", payload: entry });
  };

  const value = useMemo(() => ({ state, addEntry }), [state]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export function useStore(): StoreContextProps {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return ctx;
}
