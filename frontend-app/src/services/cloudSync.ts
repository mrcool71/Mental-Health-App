import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
} from "@react-native-firebase/firestore";
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type { MoodEntry, Phq9Assessment } from "../types/models";
import type {
  AccelerometerReading,
  LocationReading,
  MicrophoneReading,
} from "../types/sensors";

function userDocRef(userId: string) {
  return doc(getFirestore(), "users", userId);
}

// Mood entries
export async function syncMoodEntry(
  userId: string,
  entry: MoodEntry,
): Promise<void> {
  try {
    const ref = doc(
      collection(getFirestore(), "users", userId, "mood_entries"),
      entry.id,
    );
    await setDoc(ref, {
      ...entry,
      syncedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("[cloudSync] syncMoodEntry failed:", e);
  }
}

export async function loadCloudMoodEntries(
  userId: string,
): Promise<MoodEntry[]> {
  try {
    const col = collection(getFirestore(), "users", userId, "mood_entries");
    const q = query(col, orderBy("timestamp", "desc"), limit(500));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
        docSnap.data() as MoodEntry,
    );
  } catch (e) {
    console.error("[cloudSync] loadCloudMoodEntries failed:", e);
    return [];
  }
}

// PHQ assessments
export async function syncPhq9Assessment(
  userId: string,
  assessment: Phq9Assessment,
): Promise<void> {
  try {
    const ref = doc(
      collection(getFirestore(), "users", userId, "phq9_assessments"),
      assessment.id,
    );
    await setDoc(ref, {
      ...assessment,
      syncedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("[cloudSync] syncPhq9Assessment failed:", e);
  }
}

export async function loadCloudPhq9Assessments(
  userId: string,
): Promise<Phq9Assessment[]> {
  try {
    const col = collection(getFirestore(), "users", userId, "phq9_assessments");
    const q = query(col, orderBy("timestamp", "desc"), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
        docSnap.data() as Phq9Assessment,
    );
  } catch (e) {
    console.error("[cloudSync] loadCloudPhq9Assessments failed:", e);
    return [];
  }
}

// Profile
export async function syncProfile(
  userId: string,
  profile: {
    hasOnboarded: boolean;
    consentGiven: boolean;
    consentTimestamp: number | null;
  },
): Promise<void> {
  try {
    await setDoc(
      userDocRef(userId),
      {
        ...profile,
        lastSync: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (e) {
    console.error("[cloudSync] syncProfile failed:", e);
  }
}

export async function loadCloudProfile(
  userId: string,
): Promise<{ hasOnboarded?: boolean } | null> {
  try {
    const snapshot = await getDoc(userDocRef(userId));
    if (!snapshot.exists()) return null;
    return snapshot.data() as { hasOnboarded?: boolean };
  } catch (e) {
    console.error("[cloudSync] loadCloudProfile failed:", e);
    return null;
  }
}

export async function loadAllCloudData(userId: string): Promise<{
  history: MoodEntry[];
  phq9History: Phq9Assessment[];
  hasOnboarded: boolean;
}> {
  const [history, phq9History, profile] = await Promise.all([
    loadCloudMoodEntries(userId),
    loadCloudPhq9Assessments(userId),
    loadCloudProfile(userId),
  ]);

  return {
    history,
    phq9History,
    hasOnboarded: profile?.hasOnboarded ?? false,
  };
}

// Sensor buckets
type SensorType = "location" | "accelerometer" | "microphone";

type SensorReadingMap = {
  location: LocationReading;
  accelerometer: AccelerometerReading;
  microphone: MicrophoneReading;
};

type SensorBucketAggregate = {
  userId: string;
  sensorType: SensorType;
  bucketStartMs: number;
  bucketEndMs: number;
  count: number;
  sumLat?: number;
  sumLng?: number;
  sumSpeed?: number;
  minSpeed?: number;
  maxSpeed?: number;
  speedCount?: number;
  sumX?: number;
  sumY?: number;
  sumZ?: number;
  sumMagnitude?: number;
  peakMagnitude?: number;
  sumDb?: number;
  maxDb?: number;
  dbCount?: number;
  sampleReadings: Array<Record<string, number | string | boolean | null>>;
};

const SENSOR_BUCKET_MINUTES = 5;
const SENSOR_BUCKET_FLUSH_MS = 15000;
const SENSOR_SAMPLE_LIMIT = 30;

const bucketAggregates = new Map<string, SensorBucketAggregate>();
const bucketFlushTimers = new Map<string, ReturnType<typeof setTimeout>>();

function getBucketStartMs(timestamp: number): number {
  const bucketMs = SENSOR_BUCKET_MINUTES * 60 * 1000;
  return Math.floor(timestamp / bucketMs) * bucketMs;
}

function makeBucketDocId(bucketStartMs: number, sensorType: SensorType): string {
  const iso = new Date(bucketStartMs).toISOString().replace(/[:.]/g, "-");
  return `${iso}_${sensorType}`;
}

function bucketKey(userId: string, sensorType: SensorType, bucketStartMs: number): string {
  return `${userId}:${sensorType}:${bucketStartMs}`;
}

function pushSample(
  agg: SensorBucketAggregate,
  sample: Record<string, number | string | boolean | null>,
) {
  agg.sampleReadings.push(sample);
  if (agg.sampleReadings.length > SENSOR_SAMPLE_LIMIT) {
    agg.sampleReadings.shift();
  }
}

function updateLocationAggregate(agg: SensorBucketAggregate, reading: LocationReading) {
  agg.sumLat = (agg.sumLat ?? 0) + reading.latitude;
  agg.sumLng = (agg.sumLng ?? 0) + reading.longitude;

  if (typeof reading.speed === "number") {
    agg.sumSpeed = (agg.sumSpeed ?? 0) + reading.speed;
    agg.speedCount = (agg.speedCount ?? 0) + 1;
    agg.minSpeed =
      agg.minSpeed === undefined ? reading.speed : Math.min(agg.minSpeed, reading.speed);
    agg.maxSpeed =
      agg.maxSpeed === undefined ? reading.speed : Math.max(agg.maxSpeed, reading.speed);
  }

  pushSample(agg, {
    t: reading.timestamp,
    lat: Number(reading.latitude.toFixed(6)),
    lng: Number(reading.longitude.toFixed(6)),
    speed: reading.speed ?? null,
  });
}

function updateAccelerometerAggregate(
  agg: SensorBucketAggregate,
  reading: AccelerometerReading,
) {
  const magnitude = Math.sqrt(
    reading.x * reading.x + reading.y * reading.y + reading.z * reading.z,
  );

  agg.sumX = (agg.sumX ?? 0) + reading.x;
  agg.sumY = (agg.sumY ?? 0) + reading.y;
  agg.sumZ = (agg.sumZ ?? 0) + reading.z;
  agg.sumMagnitude = (agg.sumMagnitude ?? 0) + magnitude;
  agg.peakMagnitude =
    agg.peakMagnitude === undefined ? magnitude : Math.max(agg.peakMagnitude, magnitude);

  pushSample(agg, {
    t: reading.timestamp,
    x: Number(reading.x.toFixed(4)),
    y: Number(reading.y.toFixed(4)),
    z: Number(reading.z.toFixed(4)),
  });
}

function updateMicrophoneAggregate(agg: SensorBucketAggregate, reading: MicrophoneReading) {
  if (typeof reading.meteringDb === "number") {
    agg.sumDb = (agg.sumDb ?? 0) + reading.meteringDb;
    agg.dbCount = (agg.dbCount ?? 0) + 1;
    agg.maxDb =
      agg.maxDb === undefined
        ? reading.meteringDb
        : Math.max(agg.maxDb, reading.meteringDb);
  }

  pushSample(agg, {
    t: reading.timestamp,
    db: reading.meteringDb ?? null,
    recording: reading.isRecording,
  });
}

function buildBucketWritePayload(agg: SensorBucketAggregate) {
  const base: Record<string, unknown> = {
    sensorType: agg.sensorType,
    bucketStart: new Date(agg.bucketStartMs),
    bucketEnd: new Date(agg.bucketEndMs),
    count: increment(agg.count),
    sampleReadings: agg.sampleReadings,
    updatedAt: serverTimestamp(),
  };

  if (agg.sensorType === "location") {
    base.avgLat = agg.count > 0 && agg.sumLat !== undefined ? agg.sumLat / agg.count : null;
    base.avgLng = agg.count > 0 && agg.sumLng !== undefined ? agg.sumLng / agg.count : null;
    base.minSpeed = agg.minSpeed ?? null;
    base.maxSpeed = agg.maxSpeed ?? null;
    base.avgSpeed =
      (agg.speedCount ?? 0) > 0 && agg.sumSpeed !== undefined
        ? agg.sumSpeed / (agg.speedCount ?? 1)
        : null;
  }

  if (agg.sensorType === "accelerometer") {
    base.avgX = agg.count > 0 && agg.sumX !== undefined ? agg.sumX / agg.count : null;
    base.avgY = agg.count > 0 && agg.sumY !== undefined ? agg.sumY / agg.count : null;
    base.avgZ = agg.count > 0 && agg.sumZ !== undefined ? agg.sumZ / agg.count : null;
    base.avgMagnitude =
      agg.count > 0 && agg.sumMagnitude !== undefined ? agg.sumMagnitude / agg.count : null;
    base.peakMagnitude = agg.peakMagnitude ?? null;
  }

  if (agg.sensorType === "microphone") {
    base.avgDb =
      (agg.dbCount ?? 0) > 0 && agg.sumDb !== undefined
        ? agg.sumDb / (agg.dbCount ?? 1)
        : null;
    base.maxDb = agg.maxDb ?? null;
  }

  return base;
}

async function flushBucket(key: string): Promise<void> {
  const agg = bucketAggregates.get(key);
  if (!agg || agg.count === 0) return;

  const ref = doc(
    collection(getFirestore(), "users", agg.userId, "sensor_buckets"),
    makeBucketDocId(agg.bucketStartMs, agg.sensorType),
  );

  try {
    await setDoc(ref, buildBucketWritePayload(agg), { merge: true });
    bucketAggregates.delete(key);
  } catch (e) {
    console.error("[cloudSync] flushBucket failed:", e);
  }
}

function scheduleFlush(key: string) {
  const existing = bucketFlushTimers.get(key);
  if (existing) return;

  const timer = setTimeout(() => {
    bucketFlushTimers.delete(key);
    flushBucket(key).catch(() => undefined);
  }, SENSOR_BUCKET_FLUSH_MS);

  bucketFlushTimers.set(key, timer);
}

export function syncSensorReading<T extends SensorType>(
  userId: string,
  sensorType: T,
  reading: SensorReadingMap[T],
): void {
  const timestamp = reading.timestamp;
  const bucketStartMs = getBucketStartMs(timestamp);
  const key = bucketKey(userId, sensorType, bucketStartMs);

  let agg = bucketAggregates.get(key);
  if (!agg) {
    agg = {
      userId,
      sensorType,
      bucketStartMs,
      bucketEndMs: timestamp,
      count: 0,
      sampleReadings: [],
    };
    bucketAggregates.set(key, agg);
  }

  agg.count += 1;
  agg.bucketEndMs = Math.max(agg.bucketEndMs, timestamp);

  if (sensorType === "location") {
    updateLocationAggregate(agg, reading as LocationReading);
  }
  if (sensorType === "accelerometer") {
    updateAccelerometerAggregate(agg, reading as AccelerometerReading);
  }
  if (sensorType === "microphone") {
    updateMicrophoneAggregate(agg, reading as MicrophoneReading);
  }

  scheduleFlush(key);

  if (agg.count >= SENSOR_SAMPLE_LIMIT) {
    flushBucket(key).catch(() => undefined);
  }
}
