import {
  AudioModule,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";
import { MIC_RECORDING_OPTIONS } from "../../constants/sensors";

import type {
  MicrophoneMeteringHandle,
  MicrophoneReading,
  PermissionStatus,
} from "../../types/sensors";

export type MicrophoneMeteringOptions = {
  updateIntervalMs?: number;
};

export async function requestMicrophonePermission(): Promise<PermissionStatus> {
  const res = await requestRecordingPermissionsAsync();
  return res.status as PermissionStatus;
}

export async function startMicrophoneMetering(
  onReading: (reading: MicrophoneReading) => void,
  options: MicrophoneMeteringOptions = {},
): Promise<MicrophoneMeteringHandle> {
  await setAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
  });

  const recorder = new AudioModule.AudioRecorder(MIC_RECORDING_OPTIONS);
  await recorder.prepareToRecordAsync();

  const intervalMs = options.updateIntervalMs ?? 250;
  const intervalId = setInterval(() => {
    try {
      const status = recorder.getStatus();
      onReading({
        timestamp: Date.now(),
        isRecording: status.isRecording,
        meteringDb: status.metering,
      });
    } catch {}
  }, intervalMs);

  recorder.record();

  return {
    stop: async () => {
      clearInterval(intervalId);
      const uri = recorder.uri;
      try {
        await recorder.stop();
      } catch {}
      return uri;
    },
  };
}

export async function stopMicrophoneMetering(
  handle?: MicrophoneMeteringHandle | null,
): Promise<string | null> {
  if (!handle) return null;
  return handle.stop();
}
