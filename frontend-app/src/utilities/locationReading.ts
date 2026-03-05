import type { LocationObject } from "expo-location";

import type { LocationReading } from "../types/sensors";

export function toLocationReading(loc: LocationObject): LocationReading {
  const { coords, timestamp } = loc;
  return {
    timestamp,
    latitude: coords.latitude,
    longitude: coords.longitude,
    accuracy: coords.accuracy,
    altitude: coords.altitude,
    altitudeAccuracy: coords.altitudeAccuracy,
    heading: coords.heading,
    speed: coords.speed,
  };
}
