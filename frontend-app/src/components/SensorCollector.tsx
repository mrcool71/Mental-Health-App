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

  useLocationSensor({
    enabled: state.sensors.enabled.location,
    accuracy: undefined,
    timeInterval: 5000,
    distanceInterval: 10,
  });

  useAccelerometerSensor({
    // Background sensors already runs the accelerometer via foreground service;
    // avoid double-subscribing.
    enabled: state.sensors.enabled.accelerometer && !state.sensors.backgroundSensorsEnabled,
    updateIntervalMs: 250,
  });

  useMicrophoneSampling({
    // Background sensors already runs the mic loop inside the foreground service.
    // Running both at once causes two concurrent MediaRecorders → native crash.
    enabled: state.sensors.enabled.microphone && !state.sensors.backgroundSensorsEnabled,
    meteringUpdateIntervalMs: 250,
    intervalMs: 120000,
    sampleDurationMs: 5000,
    startImmediately: true,
  });

  return null;
}
