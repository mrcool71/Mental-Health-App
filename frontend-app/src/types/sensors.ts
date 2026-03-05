export type SensorKey = "location" | "accelerometer" | "microphone";

export type PermissionStatus = "undetermined" | "granted" | "denied";

export type LocationPermissionKey = "location";
export type MicrophonePermissionKey = "microphone";
export type PermissionKey = LocationPermissionKey | MicrophonePermissionKey;

export type SensorSubscription = {
  remove: () => void;
};

export interface LocationReading {
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface AccelerometerReading {
  timestamp: number;
  x: number;
  y: number;
  z: number;
}

export interface MicrophoneReading {
  timestamp: number;
  isRecording: boolean;
  meteringDb?: number;
}

export type MicrophoneMeteringHandle = {
  stop: () => Promise<string | null>;
};

export interface SensorsState {
  enabled: Record<SensorKey, boolean>;
  backgroundLocationEnabled: boolean;
  backgroundSensorsEnabled: boolean;
  permissions: Record<PermissionKey, PermissionStatus>;
  errors: Partial<Record<SensorKey, string>>;

  location?: LocationReading;
  accelerometer?: AccelerometerReading;
  microphone?: MicrophoneReading;
}
