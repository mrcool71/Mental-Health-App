import { useEffect, useRef } from "react";

import { useStore } from "../store";
import {
  startAccelerometerListener,
  stopAccelerometerListener,
} from "../services/sensors/accelerometerService";
import type { SensorSubscription } from "../types/sensors";

export type UseAccelerometerSensorParams = {
  enabled: boolean;
  updateIntervalMs?: number;
};

export function useAccelerometerSensor(params: UseAccelerometerSensorParams) {
  const { enabled, updateIntervalMs } = params;
  const { setAccelerometerReading, setSensorError } = useStore();

  const subRef = useRef<SensorSubscription | null>(null);

  useEffect(() => {
    if (!enabled) {
      stopAccelerometerListener(subRef.current);
      subRef.current = null;
      return;
    }

    try {
      setSensorError("accelerometer", undefined);
      subRef.current = startAccelerometerListener(
        (reading) => setAccelerometerReading(reading),
        { updateIntervalMs },
      );
    } catch (err: any) {
      setSensorError("accelerometer", err?.message ?? String(err));
    }

    return () => {
      stopAccelerometerListener(subRef.current);
      subRef.current = null;
    };
  }, [enabled, updateIntervalMs, setAccelerometerReading, setSensorError]);
}
