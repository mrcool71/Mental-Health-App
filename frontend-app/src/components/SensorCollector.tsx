import React, { useEffect, useRef } from "react";

import { useAccelerometerSensor } from "../hooks/useAccelerometerSensor";
import { useBackgroundLocation } from "../hooks/useBackgroundLocation";
import { useBackgroundSensors } from "../hooks/useBackgroundSensors";
import { useLocationSensor } from "../hooks/useLocationSensor";
import { useMicrophoneSampling } from "../hooks/useMicrophoneSampling";
import { getCurrentUser } from "../services/auth";
import { useStore } from "../store";
import {
  loadLastAccelerometerReading,
  loadLastLocationReading,
  loadLastMicrophoneReading,
} from "../utilities/sensorStorage";

const BG_POLL_INTERVAL_MS = 5000;

/**
 * Polls the latest readings from AsyncStorage and pushes them into the
 * in-memory store so SensorDataScreen stays up-to-date while background
 * services are the active collectors.
 */
function useBackgroundDataBridge(active: boolean) {
  const {
    setLocationReading,
    setAccelerometerReading,
    setMicrophoneReading,
  } = useStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    async function poll() {
      const [loc, accel, mic] = await Promise.all([
        loadLastLocationReading(),
        loadLastAccelerometerReading(),
        loadLastMicrophoneReading(),
      ]);
      if (loc) setLocationReading(loc);
      if (accel) setAccelerometerReading(accel);
      if (mic) setMicrophoneReading(mic);
    }

    // Initial poll, then repeat.
    poll().catch(() => undefined);
    intervalRef.current = setInterval(() => {
      poll().catch(() => undefined);
    }, BG_POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, setLocationReading, setAccelerometerReading, setMicrophoneReading]);
}

export default function SensorCollector() {
  const { state, isRestored } = useStore();
  const user = getCurrentUser();

  // Don't run sensors until the store is hydrated, the user is
  // authenticated, and they have given data-collection consent.
  const shouldRun = isRestored && !!user && state.consentGiven;

  const bgLocationActive = shouldRun && state.sensors.backgroundLocationEnabled;
  const bgSensorsActive = shouldRun && state.sensors.backgroundSensorsEnabled;

  useBackgroundLocation(bgLocationActive);
  useBackgroundSensors(bgSensorsActive);

  // Poll AsyncStorage for the latest readings while any background
  // service is running so the UI stays current.
  useBackgroundDataBridge(bgLocationActive || bgSensorsActive);

  // When background services are active they handle their own sampling.
  // Running foreground hooks simultaneously causes resource conflicts
  // (e.g. two AudioRecorder instances fighting over the mic → crash).
  useLocationSensor({
    enabled: shouldRun && state.sensors.enabled.location && !state.sensors.backgroundLocationEnabled,
    accuracy: undefined,
    timeInterval: 5000,
    distanceInterval: 10,
  });

  useAccelerometerSensor({
    enabled: shouldRun && state.sensors.enabled.accelerometer && !state.sensors.backgroundSensorsEnabled,
    updateIntervalMs: 250,
  });

  useMicrophoneSampling({
    enabled: shouldRun && state.sensors.enabled.microphone && !state.sensors.backgroundSensorsEnabled,
    meteringUpdateIntervalMs: 250,
    intervalMs: 120000,
    sampleDurationMs: 5000,
    startImmediately: true,
  });

  return null;
}
