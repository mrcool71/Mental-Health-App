import { useEffect } from "react";

import { useStore } from "../store";
import {
  requestBackgroundLocationPermission,
  startBackgroundLocation,
  stopBackgroundLocation,
} from "../services/sensors/backgroundLocationService";

export function useBackgroundLocation(enabled: boolean) {
  const { setSensorError, setSensorPermission } = useStore();

  useEffect(() => {
    let cancelled = false;

    async function start() {
      const perms = await requestBackgroundLocationPermission();
      if (cancelled) return;

      setSensorPermission("location", perms.foreground);

      if (perms.foreground !== "granted" || perms.background !== "granted") {
        setSensorError(
          "location",
          "Background location permission not granted",
        );
        return;
      }

      setSensorError("location", undefined);
      await startBackgroundLocation();
    }

    if (enabled) {
      start().catch((err) => {
        setSensorError("location", err?.message ?? String(err));
      });
    } else {
      stopBackgroundLocation().catch(() => undefined);
    }

    return () => {
      cancelled = true;
      stopBackgroundLocation().catch(() => undefined);
    };
  }, [enabled, setSensorError, setSensorPermission]);
}
