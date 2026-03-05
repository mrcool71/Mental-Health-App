import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import type { AppStateStatus } from "react-native";
import * as FileSystem from "expo-file-system";

import { useStore } from "../store";
import {
  requestMicrophonePermission,
  startMicrophoneMetering,
  stopMicrophoneMetering,
} from "../services/sensors/microphoneService";
import type { MicrophoneMeteringHandle } from "../types/sensors";

export type UseMicrophoneSamplingParams = {
  enabled: boolean;
  intervalMs?: number;
  sampleDurationMs?: number;
  meteringUpdateIntervalMs?: number;
  startImmediately?: boolean;
};

export function useMicrophoneSampling(params: UseMicrophoneSamplingParams) {
  const {
    enabled,
    intervalMs = 120000,
    sampleDurationMs = 5000,
    meteringUpdateIntervalMs = 250,
    startImmediately = true,
  } = params;

  const { setSensorPermission, setSensorError, setMicrophoneReading } =
    useStore();

  const handleRef = useRef<MicrophoneMeteringHandle | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const runningRef = useRef(false);

  async function cleanupRecording() {
    const handle = handleRef.current;
    if (!handle) return;

    const uri = await stopMicrophoneMetering(handle);
    handleRef.current = null;

    if (uri) {
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch {
        return;
      }
    }
  }

  async function stopAll() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    await cleanupRecording();
    setMicrophoneReading({ timestamp: Date.now(), isRecording: false });
  }

  async function sampleOnce() {
    await cleanupRecording();

    handleRef.current = await startMicrophoneMetering(
      (reading) => setMicrophoneReading(reading),
      { updateIntervalMs: meteringUpdateIntervalMs },
    );

    await new Promise<void>((resolve) => {
      timeoutRef.current = setTimeout(() => resolve(), sampleDurationMs);
    });

    timeoutRef.current = null;
    await cleanupRecording();
    setMicrophoneReading({ timestamp: Date.now(), isRecording: false });
  }

  async function scheduleLoop(startNow: boolean) {
    if (runningRef.current) return;
    runningRef.current = true;

    const status = await requestMicrophonePermission();
    setSensorPermission("microphone", status);

    if (status !== "granted") {
      setSensorError("microphone", "Microphone permission not granted");
      setMicrophoneReading({ timestamp: Date.now(), isRecording: false });
      runningRef.current = false;
      return;
    }

    setSensorError("microphone", undefined);

    const run = async () => {
      if (!runningRef.current) return;
      if (appStateRef.current !== "active") return;

      try {
        await sampleOnce();
      } catch (err: any) {
        setSensorError("microphone", err?.message ?? String(err));
      }

      if (!runningRef.current) return;

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        run().catch(() => undefined);
      }, intervalMs);
    };

    if (startNow) {
      run().catch(() => undefined);
    } else {
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        run().catch(() => undefined);
      }, intervalMs);
    }
  }

  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      appStateRef.current = nextState;
      if (nextState !== "active") {
        cleanupRecording().catch(() => undefined);
      }
    });

    return () => {
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      runningRef.current = false;
      stopAll().catch(() => undefined);
      return;
    }

    scheduleLoop(startImmediately).catch((err) => {
      setSensorError("microphone", err?.message ?? String(err));
    });

    return () => {
      runningRef.current = false;
      stopAll().catch(() => undefined);
    };
  }, [enabled, intervalMs, sampleDurationMs, meteringUpdateIntervalMs, startImmediately]);
}
