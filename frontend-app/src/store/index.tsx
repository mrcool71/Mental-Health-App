import React, {
  createContext,
  useCallback,
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
  Phq9Assessment,
} from "../types/models";
import { initialState } from "../constants/store";
import type { StoreContextProps } from "../types/store";
import { loadNotificationResponses } from "../utilities/notificationStorage";
import { loadLastLocationReading } from "../utilities/sensorStorage";
import {
  loadLastAccelerometerReading,
  loadLastMicrophoneReading,
} from "../utilities/sensorStorage";
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
    case "ADD_PHQ9_ASSESSMENT":
      return {
        ...state,
        phq9History: [action.payload, ...state.phq9History],
      };
    case "SET_ONBOARDED":
      return { ...state, hasOnboarded: true };
    case "SET_SENSOR_ENABLED": {
      const { sensor, enabled } = action.payload;
      return {
        ...state,
        sensors: {
          ...state.sensors,
          enabled: { ...state.sensors.enabled, [sensor]: enabled },
        },
      };
    }
    case "SET_BACKGROUND_LOCATION_ENABLED": {
      return {
        ...state,
        sensors: {
          ...state.sensors,
          backgroundLocationEnabled: action.payload,
        },
      };
    }
    case "SET_BACKGROUND_SENSORS_ENABLED": {
      return {
        ...state,
        sensors: {
          ...state.sensors,
          backgroundSensorsEnabled: action.payload,
        },
      };
    }
    case "SET_SENSOR_PERMISSION": {
      const { permission, status } = action.payload;
      return {
        ...state,
        sensors: {
          ...state.sensors,
          permissions: { ...state.sensors.permissions, [permission]: status },
        },
      };
    }
    case "SET_SENSOR_ERROR": {
      const { sensor, error } = action.payload;
      return {
        ...state,
        sensors: {
          ...state.sensors,
          errors: { ...state.sensors.errors, [sensor]: error },
        },
      };
    }
    case "SET_LOCATION_READING":
      return {
        ...state,
        sensors: {
          ...state.sensors,
          location: action.payload,
        },
      };
    case "SET_ACCELEROMETER_READING":
      return {
        ...state,
        sensors: {
          ...state.sensors,
          accelerometer: action.payload,
        },
      };
    case "SET_MICROPHONE_READING":
      return {
        ...state,
        sensors: {
          ...state.sensors,
          microphone: action.payload,
        },
      };
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

  useEffect(() => {
    loadLastLocationReading().then((reading) => {
      if (reading) {
        dispatch({ type: "SET_LOCATION_READING", payload: reading });
      }
    });
  }, []);

  useEffect(() => {
    loadLastAccelerometerReading().then((reading) => {
      if (reading) {
        dispatch({ type: "SET_ACCELEROMETER_READING", payload: reading });
      }
    });
  }, []);

  useEffect(() => {
    loadLastMicrophoneReading().then((reading) => {
      if (reading) {
        dispatch({ type: "SET_MICROPHONE_READING", payload: reading });
      }
    });
  }, []);

  const addEntry = useCallback(
    (entry: MoodEntry) => dispatch({ type: "ADD_ENTRY", payload: entry }),
    [],
  );

  const addNotificationResponse = useCallback(
    (response: NotificationResponse) =>
      dispatch({ type: "ADD_NOTIFICATION_RESPONSE", payload: response }),
    [],
  );

  const addPhq9Assessment = (assessment: Phq9Assessment) => {
    dispatch({ type: "ADD_PHQ9_ASSESSMENT", payload: assessment });
  };

  const setOnboarded = useCallback(
    () => dispatch({ type: "SET_ONBOARDED" }),
    [],
  );

  const setSensorEnabled = useCallback<StoreContextProps["setSensorEnabled"]>(
    (sensor, enabled) =>
      dispatch({ type: "SET_SENSOR_ENABLED", payload: { sensor, enabled } }),
    [],
  );

  const setBackgroundLocationEnabled = useCallback<
    StoreContextProps["setBackgroundLocationEnabled"]
  >(
    (enabled) =>
      dispatch({ type: "SET_BACKGROUND_LOCATION_ENABLED", payload: enabled }),
    [],
  );

  const setBackgroundSensorsEnabled = useCallback<
    StoreContextProps["setBackgroundSensorsEnabled"]
  >(
    (enabled) =>
      dispatch({ type: "SET_BACKGROUND_SENSORS_ENABLED", payload: enabled }),
    [],
  );

  const setSensorPermission = useCallback<
    StoreContextProps["setSensorPermission"]
  >(
    (permission, status) =>
      dispatch({
        type: "SET_SENSOR_PERMISSION",
        payload: { permission, status },
      }),
    [],
  );

  const setSensorError = useCallback<StoreContextProps["setSensorError"]>(
    (sensor, error) =>
      dispatch({ type: "SET_SENSOR_ERROR", payload: { sensor, error } }),
    [],
  );

  const setLocationReading = useCallback<
    StoreContextProps["setLocationReading"]
  >(
    (reading) =>
      dispatch({ type: "SET_LOCATION_READING", payload: reading }),
    [],
  );

  const setAccelerometerReading = useCallback<
    StoreContextProps["setAccelerometerReading"]
  >(
    (reading) =>
      dispatch({ type: "SET_ACCELEROMETER_READING", payload: reading }),
    [],
  );

  const setMicrophoneReading = useCallback<
    StoreContextProps["setMicrophoneReading"]
  >(
    (reading) =>
      dispatch({ type: "SET_MICROPHONE_READING", payload: reading }),
    [],
  );

  const reset = useCallback(
    () => dispatch({ type: "RESET" }),
    [],
  );

  const value = useMemo(
    () => ({
     
      state,
     
      addEntry,
     
      addNotificationResponse,
     
      addPhq9Assessment,
      setOnboarded,
      setSensorEnabled,
      setBackgroundLocationEnabled,
      setBackgroundSensorsEnabled,
      setSensorPermission,
      setSensorError,
      setLocationReading,
      setAccelerometerReading,
      setMicrophoneReading,
     
      reset,
   ,
    }),
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
