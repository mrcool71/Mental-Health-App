import * as Location from "expo-location";

import type { PermissionStatus } from "../../types/sensors";
import { BACKGROUND_LOCATION_TASK } from "../../constants/sensors";

export type BackgroundLocationOptions = {
  timeInterval?: number;
  distanceInterval?: number;
  accuracy?: Location.LocationAccuracy;
};

export async function requestBackgroundLocationPermission(): Promise<{
  foreground: PermissionStatus;
  background: PermissionStatus;
}> {
  const fg = await Location.requestForegroundPermissionsAsync();
  const bg = await Location.requestBackgroundPermissionsAsync();
  return {
    foreground: fg.status as PermissionStatus,
    background: bg.status as PermissionStatus,
  };
}

export async function startBackgroundLocation(
  options: BackgroundLocationOptions = {},
): Promise<void> {
  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: options.accuracy ?? Location.Accuracy.Balanced,
    timeInterval: options.timeInterval ?? 10000,
    distanceInterval: options.distanceInterval ?? 25,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "Wellbeing tracking",
      notificationBody: "Location collection is running in the background",
    },
  });
}

export async function stopBackgroundLocation(): Promise<void> {
  const started = await Location.hasStartedLocationUpdatesAsync(
    BACKGROUND_LOCATION_TASK,
  );
  if (!started) return;
  await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
}

export async function isBackgroundLocationRunning(): Promise<boolean> {
  return Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
}
