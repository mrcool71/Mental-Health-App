import React from "react";

import { useAccelerometerSensor } from "../hooks/useAccelerometerSensor";
import { useBackgroundLocation } from "../hooks/useBackgroundLocation";
import { useBackgroundSensors } from "../hooks/useBackgroundSensors";
import { useLocationSensor } from "../hooks/useLocationSensor";
import { useMicrophoneSampling } from "../hooks/useMicrophoneSampling";
import { useStore } from "../store";

export default function SensorCollector() {
  const { state } = useStore();

  useBackgroundLocation(state.sensors.backgroundLocationEnabled);
  useBackgroundSensors(state.sensors.backgroundSensorsEnabled);

  // When background services are active they handle their own sampling.
  // Running foreground hooks simultaneously causes resource conflicts
  // (e.g. two AudioRecorder instances fighting over the mic → crash).
  useLocationSensor({
    enabled: state.sensors.enabled.location && !state.sensors.backgroundLocationEnabled,
    accuracy: undefined,
    timeInterval: 5000,
    distanceInterval: 10,
  });

  useAccelerometerSensor({
    enabled: state.sensors.enabled.accelerometer && !state.sensors.backgroundSensorsEnabled,
    updateIntervalMs: 250,
  });

  useMicrophoneSampling({
    enabled: state.sensors.enabled.microphone && !state.sensors.backgroundSensorsEnabled,
    meteringUpdateIntervalMs: 250,
    intervalMs: 120000,
    sampleDurationMs: 5000,
    startImmediately: true,
  });

  return null;
}
