import notifee, { AndroidImportance } from "@notifee/react-native";
import { Accelerometer } from "expo-sensors";
import { AudioModule, setAudioModeAsync } from "expo-audio";
import * as FileSystem from "expo-file-system";

import {
  ACCEL_FLUSH_SIZE,
  ACCEL_INTERVAL_MS,
  MIC_RECORDING_OPTIONS,
  MIC_SAMPLE_DURATION_MS,
  MIC_SAMPLE_INTERVAL_MS,
  SENSOR_SERVICE_CHANNEL_ID,
  SENSOR_SERVICE_NOTIFICATION_ID,
} from "../../constants/sensors";
import type {
  AccelerometerReading,
  MicrophoneReading,
} from "../../types/sensors";
import {
  appendAccelerometerReadings,
  appendMicrophoneReadings,
} from "../../utilities/sensorStorage";

let serviceRunning = false;
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAccelerometer(signal: { stopped: boolean }) {
  const buffer: AccelerometerReading[] = [];

  Accelerometer.setUpdateInterval(ACCEL_INTERVAL_MS);

  const sub = Accelerometer.addListener((data) => {
    buffer.push({ timestamp: Date.now(), x: data.x, y: data.y, z: data.z });

    if (buffer.length >= ACCEL_FLUSH_SIZE) {
      const batch = buffer.splice(0, buffer.length);
      appendAccelerometerReadings(batch).catch(() => undefined);
    }
  });

  await new Promise<void>((resolve) => {
    const check = setInterval(() => {
      if (signal.stopped) {
        clearInterval(check);
        sub.remove();
        if (buffer.length > 0) {
          appendAccelerometerReadings(buffer.splice(0)).catch(() => undefined);
        }
        resolve();
      }
    }, 500);
  });
}

async function runMicrophoneSampling(signal: { stopped: boolean }) {
  while (!signal.stopped) {
    try {
      await sampleMicOnce();
    } catch {}

    const waitUntil = Date.now() + MIC_SAMPLE_INTERVAL_MS;
    while (Date.now() < waitUntil && !signal.stopped) {
      await sleep(500);
    }
  }
}

async function sampleMicOnce(): Promise<void> {
  await setAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
  });

  const readings: MicrophoneReading[] = [];
  const recorder = new AudioModule.AudioRecorder(MIC_RECORDING_OPTIONS);
  await recorder.prepareToRecordAsync();

  const intervalId = setInterval(() => {
    try {
      const status = recorder.getStatus();
      readings.push({
        timestamp: Date.now(),
        isRecording: status.isRecording,
        meteringDb: status.metering,
      });
    } catch {}
  }, 250);

  recorder.record();

  await sleep(MIC_SAMPLE_DURATION_MS);

  clearInterval(intervalId);

  const uri = recorder.uri;
  try {
    await recorder.stop();
  } catch {}

  if (uri) {
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch {}
  }

  if (readings.length > 0) {
    await appendMicrophoneReadings(readings);
  }
}

notifee.registerForegroundService(() => {
  return new Promise<void>((resolve) => {
    const signal = { stopped: false };

    const checkCancel = setInterval(async () => {
      try {
        const displayed = await notifee.getDisplayedNotifications();
        const still = displayed.some(
          (n) => n.notification.id === SENSOR_SERVICE_NOTIFICATION_ID,
        );
        if (!still) {
          signal.stopped = true;
          clearInterval(checkCancel);
          serviceRunning = false;
          resolve();
        }
      } catch {}
    }, 2000);

    Promise.all([runAccelerometer(signal), runMicrophoneSampling(signal)]).then(
      () => {
        clearInterval(checkCancel);
        serviceRunning = false;
        resolve();
      },
    );
  });
});

export async function ensureSensorServiceChannel(): Promise<void> {
  await notifee.createChannel({
    id: SENSOR_SERVICE_CHANNEL_ID,
    name: "Sensor Collection",
    importance: AndroidImportance.LOW,
  });
}

export async function startSensorForegroundService(): Promise<void> {
  if (serviceRunning) return;
  serviceRunning = true;

  try {
    await ensureSensorServiceChannel();

    await notifee.displayNotification({
      id: SENSOR_SERVICE_NOTIFICATION_ID,
      title: "Wellbeing tracking active",
      body: "Accelerometer & microphone sampling running in background",
      android: {
        channelId: SENSOR_SERVICE_CHANNEL_ID,
        asForegroundService: true,
        ongoing: true,
        smallIcon: "ic_launcher",
        importance: AndroidImportance.LOW,
      },
    });
  } catch (err) {
    serviceRunning = false;
    throw err;
  }
}

export async function stopSensorForegroundService(): Promise<void> {
  serviceRunning = false;

  try {
    await notifee.stopForegroundService();
  } catch {}

  try {
    await notifee.cancelNotification(SENSOR_SERVICE_NOTIFICATION_ID);
  } catch {}
}
