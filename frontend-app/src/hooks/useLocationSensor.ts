import { useEffect, useRef } from "react";
import type { LocationSubscription } from "expo-location";
import * as Location from "expo-location";

import { useStore } from "../store";
import { requestLocationForegroundPermission, startLocationWatcher } from "../services/sensors/locationService";

export type UseLocationSensorParams = {
  enabled: boolean;
  timeInterval?: number;
  distanceInterval?: number;
  accuracy?: Location.LocationAccuracy;
};

export function useLocationSensor(params: UseLocationSensorParams) {
  const { enabled, timeInterval, distanceInterval, accuracy } = params;
  const { setSensorPermission, setSensorError, setLocationReading } = useStore();

  const subscriptionRef = useRef<LocationSubscription | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      const status = await requestLocationForegroundPermission();
      if (cancelled) return;

      setSensorPermission("location", status);

      if (status !== "granted") {
        setSensorError("location", "Location permission not granted");
        return;
      }

      setSensorError("location", undefined);

      subscriptionRef.current = await startLocationWatcher(
        (reading) => setLocationReading(reading),
        {
          accuracy,
          timeInterval,
          distanceInterval,
        },
      );
    }

    async function stop() {
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
    }

    if (enabled) {
      start().catch((err) => {
        setSensorError("location", err?.message ?? String(err));
      });
    } else {
      stop().catch(() => undefined);
    }

    return () => {
      cancelled = true;
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
    };
  }, [
    enabled,
    accuracy,
    timeInterval,
    distanceInterval,
    setLocationReading,
    setSensorError,
    setSensorPermission,
  ]);
}
