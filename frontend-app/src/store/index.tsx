import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  ReactNode,
} from "react";
import { AppAction, AppState, MoodEntry } from "../types/models";
import { initialState } from "../constants/store";
import type { StoreContextProps } from "../types/store";
import { calculateScore } from "../utilities";

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_ENTRY": {
      const history = [action.payload, ...state.history];
      const score = calculateScore(history);
      return { ...state, history, score };
    }
    case "SET_ONBOARDED":
      return { ...state, hasOnboarded: true };
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

  const setOnboarded = () => {
    dispatch({ type: "SET_ONBOARDED" });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  const value = useMemo(
    () => ({ state, addEntry, setOnboarded, reset }),
    [state],
  );

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
