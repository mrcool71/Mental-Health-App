import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
} from "react";
import {
  AppAction,
  AppState,
  MoodEntry,
  NotificationResponse,
} from "../types/models";
import { initialState } from "../constants/store";
import type { StoreContextProps } from "../types/store";
import { loadNotificationResponses } from "../utilities/notificationStorage";
import { calculateScore } from "../utilities";

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_ENTRY": {
      const history = [action.payload, ...state.history];
      const score = calculateScore(history);
      return { ...state, history, score };
    }
    case "ADD_NOTIFICATION_RESPONSE":
      return {
        ...state,
        notificationResponses: [action.payload, ...state.notificationResponses],
      };
    case "LOAD_NOTIFICATION_RESPONSES":
      return { ...state, notificationResponses: action.payload };
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

  // Sync notification responses from AsyncStorage into memory on mount.
  // This restores responses that were saved by the background headless handler
  // while the app was closed.
  useEffect(() => {
    loadNotificationResponses().then((responses) => {
      if (responses.length > 0) {
        dispatch({ type: "LOAD_NOTIFICATION_RESPONSES", payload: responses });
      }
    });
  }, []);

  const addEntry = (entry: MoodEntry) => {
    dispatch({ type: "ADD_ENTRY", payload: entry });
  };

  const addNotificationResponse = (response: NotificationResponse) => {
    dispatch({ type: "ADD_NOTIFICATION_RESPONSE", payload: response });
  };

  const setOnboarded = () => {
    dispatch({ type: "SET_ONBOARDED" });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  const value = useMemo(
    () => ({ state, addEntry, addNotificationResponse, setOnboarded, reset }),
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
