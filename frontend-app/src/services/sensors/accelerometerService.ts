import { Accelerometer } from "expo-sensors";

import type { AccelerometerReading, SensorSubscription } from "../../types/sensors";

export type AccelerometerOptions = {
  updateIntervalMs?: number;
};

export function startAccelerometerListener(
  onReading: (reading: AccelerometerReading) => void,
  options: AccelerometerOptions = {},
): SensorSubscription {
  Accelerometer.setUpdateInterval(options.updateIntervalMs ?? 250);

  const sub = Accelerometer.addListener((data) => {
    onReading({
      timestamp: Date.now(),
      x: data.x,
      y: data.y,
      z: data.z,
    });
  });

  return sub;
}

export function stopAccelerometerListener(sub?: SensorSubscription | null) {
  sub?.remove();
}
