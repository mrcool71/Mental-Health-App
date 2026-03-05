import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  AccelerometerReading,
  LocationReading,
  MicrophoneReading,
} from "../types/sensors";

const LOCATION_KEY = "@mental_app/sensor/location_readings";
const ACCEL_KEY = "@mental_app/sensor/accelerometer_readings";
const MIC_KEY = "@mental_app/sensor/microphone_readings";
const DEFAULT_MAX = 1000;

// --------------- helpers ---------------

async function loadArray<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function appendArray<T>(
  key: string,
  items: T[],
  maxEntries: number,
): Promise<void> {
  if (items.length === 0) return;
  const existing = await loadArray<T>(key);
  const next = [...items, ...existing].slice(0, maxEntries);
  await AsyncStorage.setItem(key, JSON.stringify(next));
}

// --------------- location ---------------

export async function loadLocationReadings(): Promise<LocationReading[]> {
  return loadArray<LocationReading>(LOCATION_KEY);
}

export async function loadLastLocationReading(): Promise<
  LocationReading | undefined
> {
  const all = await loadLocationReadings();
  return all[0];
}

export async function appendLocationReadings(
  readings: LocationReading[],
  maxEntries: number = DEFAULT_MAX,
): Promise<void> {
  return appendArray(LOCATION_KEY, readings, maxEntries);
}

export async function clearLocationReadings(): Promise<void> {
  await AsyncStorage.removeItem(LOCATION_KEY);
}

// --------------- accelerometer ---------------

export async function loadAccelerometerReadings(): Promise<
  AccelerometerReading[]
> {
  return loadArray<AccelerometerReading>(ACCEL_KEY);
}

export async function loadLastAccelerometerReading(): Promise<
  AccelerometerReading | undefined
> {
  const all = await loadAccelerometerReadings();
  return all[0];
}

export async function appendAccelerometerReadings(
  readings: AccelerometerReading[],
  maxEntries: number = DEFAULT_MAX,
): Promise<void> {
  return appendArray(ACCEL_KEY, readings, maxEntries);
}

export async function clearAccelerometerReadings(): Promise<void> {
  await AsyncStorage.removeItem(ACCEL_KEY);
}

// --------------- microphone ---------------

export async function loadMicrophoneReadings(): Promise<MicrophoneReading[]> {
  return loadArray<MicrophoneReading>(MIC_KEY);
}

export async function loadLastMicrophoneReading(): Promise<
  MicrophoneReading | undefined
> {
  const all = await loadMicrophoneReadings();
  return all[0];
}

export async function appendMicrophoneReadings(
  readings: MicrophoneReading[],
  maxEntries: number = DEFAULT_MAX,
): Promise<void> {
  return appendArray(MIC_KEY, readings, maxEntries);
}

export async function clearMicrophoneReadings(): Promise<void> {
  await AsyncStorage.removeItem(MIC_KEY);
}
