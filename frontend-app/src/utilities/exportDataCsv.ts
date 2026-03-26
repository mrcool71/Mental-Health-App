import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import type {
  AccelerometerReading,
  LocationReading,
  MicrophoneReading,
} from "../types/sensors";
import type {
  AppState,
  MoodEntry,
  NotificationResponse,
  Phq9Assessment,
} from "../types/models";
import {
  loadAccelerometerReadings,
  loadLocationReadings,
  loadMicrophoneReadings,
} from "./sensorStorage";

type CsvRow = {
  source: string;
  id?: string;
  timestamp?: string;
  timestampIso?: string;
  mood?: string;
  energy?: string;
  note?: string;
  questionId?: string;
  questionText?: string;
  optionIndex?: string;
  optionText?: string;
  score?: string;
  severity?: string;
  answers?: string;
  latitude?: string;
  longitude?: string;
  accuracy?: string;
  altitude?: string;
  altitudeAccuracy?: string;
  heading?: string;
  speed?: string;
  x?: string;
  y?: string;
  z?: string;
  isRecording?: string;
  meteringDb?: string;
};

type ExportResult = {
  uri: string;
  rowCount: number;
};

const CSV_HEADERS: Array<keyof CsvRow> = [
  "source",
  "id",
  "timestamp",
  "timestampIso",
  "mood",
  "energy",
  "note",
  "questionId",
  "questionText",
  "optionIndex",
  "optionText",
  "score",
  "severity",
  "answers",
  "latitude",
  "longitude",
  "accuracy",
  "altitude",
  "altitudeAccuracy",
  "heading",
  "speed",
  "x",
  "y",
  "z",
  "isRecording",
  "meteringDb",
];

function escapeCsv(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
}

function numberToString(value: number | null | undefined): string | undefined {
  if (typeof value !== "number") return undefined;
  return String(value);
}

function timestampToIso(timestamp: number | undefined): string | undefined {
  if (typeof timestamp !== "number") return undefined;
  return new Date(timestamp).toISOString();
}

function moodRows(history: MoodEntry[]): CsvRow[] {
  return history.map((entry) => ({
    source: "mood_history",
    id: entry.id,
    timestamp: numberToString(entry.timestamp),
    timestampIso: timestampToIso(entry.timestamp),
    mood: entry.mood,
    energy: entry.energy,
    note: entry.note,
  }));
}

function notificationRows(rows: NotificationResponse[]): CsvRow[] {
  return rows.map((response) => ({
    source: "notification_response",
    id: response.id,
    timestamp: numberToString(response.timestamp),
    timestampIso: timestampToIso(response.timestamp),
    questionId: numberToString(response.questionId),
    questionText: response.questionText,
    optionIndex: numberToString(response.optionIndex),
    optionText: response.optionText,
  }));
}

function phq9Rows(rows: Phq9Assessment[]): CsvRow[] {
  return rows.map((assessment) => ({
    source: "phq9_assessment",
    id: assessment.id,
    timestamp: numberToString(assessment.timestamp),
    timestampIso: timestampToIso(assessment.timestamp),
    score: numberToString(assessment.score),
    severity: assessment.severity,
    answers: assessment.answers.join("|"),
  }));
}

function locationRows(rows: LocationReading[]): CsvRow[] {
  return rows.map((reading) => ({
    source: "sensor_location",
    timestamp: numberToString(reading.timestamp),
    timestampIso: timestampToIso(reading.timestamp),
    latitude: numberToString(reading.latitude),
    longitude: numberToString(reading.longitude),
    accuracy: numberToString(reading.accuracy ?? undefined),
    altitude: numberToString(reading.altitude ?? undefined),
    altitudeAccuracy: numberToString(reading.altitudeAccuracy ?? undefined),
    heading: numberToString(reading.heading ?? undefined),
    speed: numberToString(reading.speed ?? undefined),
  }));
}

function accelerometerRows(rows: AccelerometerReading[]): CsvRow[] {
  return rows.map((reading) => ({
    source: "sensor_accelerometer",
    timestamp: numberToString(reading.timestamp),
    timestampIso: timestampToIso(reading.timestamp),
    x: numberToString(reading.x),
    y: numberToString(reading.y),
    z: numberToString(reading.z),
  }));
}

function microphoneRows(rows: MicrophoneReading[]): CsvRow[] {
  return rows.map((reading) => ({
    source: "sensor_microphone",
    timestamp: numberToString(reading.timestamp),
    timestampIso: timestampToIso(reading.timestamp),
    isRecording: String(reading.isRecording),
    meteringDb: numberToString(reading.meteringDb),
  }));
}

function toCsv(rows: CsvRow[]): string {
  const headerLine = CSV_HEADERS.join(",");
  const lines = rows.map((row) =>
    CSV_HEADERS.map((header) => escapeCsv(row[header] ?? "")).join(","),
  );
  return [headerLine, ...lines].join("\n");
}

function createFilename(): string {
  const stamp = new Date().toISOString().replace(/[.:]/g, "-");
  return `mental-app-export-${stamp}.csv`;
}

export async function exportDataToCsv(state: AppState): Promise<ExportResult> {
  const [location, accelerometer, microphone] = await Promise.all([
    loadLocationReadings(),
    loadAccelerometerReadings(),
    loadMicrophoneReadings(),
  ]);

  const rows: CsvRow[] = [
    ...moodRows(state.history),
    ...notificationRows(state.notificationResponses),
    ...phq9Rows(state.phq9History),
    ...locationRows(location),
    ...accelerometerRows(accelerometer),
    ...microphoneRows(microphone),
  ];

  const filename = createFilename();
  const file = new File(Paths.document, filename);
  file.create({ intermediates: true, overwrite: true });
  file.write(toCsv(rows), { encoding: "utf8" });

  return { uri: file.uri, rowCount: rows.length };
}

export async function shareCsvFile(uri: string): Promise<boolean> {
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    return false;
  }

  await Sharing.shareAsync(uri, {
    mimeType: "text/csv",
    dialogTitle: "Exported app data (CSV)",
    UTI: "public.comma-separated-values-text",
  });

  return true;
}
