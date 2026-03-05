import { useEffect } from "react";
import { Platform } from "react-native";

import { useStore } from "../store";
import {
  startSensorForegroundService,
  stopSensorForegroundService,
} from "../services/sensors/sensorForegroundService";

export function useBackgroundSensors(enabled: boolean) {
  const { setSensorError } = useStore();

  useEffect(() => {
    if (Platform.OS !== "android") return;

    if (!enabled) {
      stopSensorForegroundService().catch(() => undefined);
      return;
    }

    startSensorForegroundService().catch((err: any) => {
      setSensorError("accelerometer", err?.message ?? String(err));
      setSensorError("microphone", err?.message ?? String(err));
    });

    return () => {
      stopSensorForegroundService().catch(() => undefined);
    };
  }, [enabled, setSensorError]);
}
