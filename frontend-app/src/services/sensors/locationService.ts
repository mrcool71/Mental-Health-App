import * as Location from "expo-location";

import type { LocationReading, PermissionStatus } from "../../types/sensors";
import { toLocationReading } from "../../utilities/locationReading";

export type LocationWatcherOptions = {
  accuracy?: Location.LocationAccuracy;
  timeInterval?: number;
  distanceInterval?: number;
};

export async function requestLocationForegroundPermission(): Promise<PermissionStatus> {
  const res = await Location.requestForegroundPermissionsAsync();
  return res.status as PermissionStatus;
}

export async function startLocationWatcher(
  onReading: (reading: LocationReading) => void,
  options: LocationWatcherOptions = {},
): Promise<Location.LocationSubscription> {
  const subscription = await Location.watchPositionAsync(
    {
      accuracy: options.accuracy ?? Location.Accuracy.Balanced,
      timeInterval: options.timeInterval ?? 5000,
      distanceInterval: options.distanceInterval ?? 10,
    },
    (loc) => onReading(toLocationReading(loc)),
  );

  return subscription;
}
