import { AudioQuality, IOSOutputFormat } from "expo-audio";
import type { RecordingOptions } from "expo-audio";

export const BACKGROUND_LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

export const SENSOR_SERVICE_CHANNEL_ID = "sensor-foreground-service";
export const SENSOR_SERVICE_NOTIFICATION_ID = "sensor-service";

export const ACCEL_INTERVAL_MS = 1000;
export const ACCEL_FLUSH_SIZE = 30;

export const MIC_SAMPLE_DURATION_MS = 5000;
export const MIC_SAMPLE_INTERVAL_MS = 120000;

export const MIC_RECORDING_OPTIONS: RecordingOptions = {
  isMeteringEnabled: true,
  extension: ".m4a",
  sampleRate: 44100,
  numberOfChannels: 1,
  bitRate: 128000,
  android: {
    outputFormat: "mpeg4",
    audioEncoder: "aac",
  },
  ios: {
    audioQuality: AudioQuality.MIN,
    outputFormat: IOSOutputFormat.MPEG4AAC,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: "audio/webm",
    bitsPerSecond: 128000,
  },
};
