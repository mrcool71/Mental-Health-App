import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import notifee, { EventType } from "@notifee/react-native";
import { StoreProvider } from "./src/store";
import { useStore } from "./src/store";
import AppNavigator from "./src/navigation";
import type { NotificationResponse } from "./src/types/models";
import {
  setupNotificationChannel,
  setupIOSCategories,
  requestNotificationPermission,
  scheduleNotifications,
} from "./src/utilities/scheduledNotifications";
import { saveNotificationResponse } from "./src/utilities/notificationStorage";

/**
 * Handles Notifee events while the app is in the FOREGROUND.
 * Must live inside <StoreProvider> so it can call useStore().
 * The equivalent background handler (for when the app is killed) lives in
 * index.ts, registered before registerRootComponent.
 */
function NotificationHandler() {
  const { addNotificationResponse } = useStore();

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type !== EventType.ACTION_PRESS) return;

      const { notification, pressAction } = detail;
      if (!notification || !pressAction) return;

      const actionId = pressAction.id;
      if (!actionId?.startsWith("option_")) return;

      const optionIndex = parseInt(actionId.replace("option_", ""), 10);
      if (isNaN(optionIndex)) return;

      const data = (notification.data ?? {}) as {
        questionId?: string;
        questionText?: string;
        options?: string;
      };
      if (!data.questionId || !data.options) return;

      let options: string[];
      try {
        options = JSON.parse(data.options) as string[];
      } catch {
        return;
      }

      const response: NotificationResponse = {
        id: `${notification.id ?? "n"}_${Date.now()}`,
        questionId: parseInt(data.questionId, 10),
        questionText: data.questionText ?? "",
        optionIndex,
        optionText: options[optionIndex] ?? "",
        timestamp: Date.now(),
      };

      // Save to AsyncStorage (persists across restarts) AND update in-memory state
      saveNotificationResponse(response);
      addNotificationResponse(response);

      // Dismiss the answered notification
      if (notification.id) notifee.cancelNotification(notification.id);
    });

    return () => unsubscribe();
  }, [addNotificationResponse]);

  return null;
}

/**
 * Top-level setup: channel, categories, permissions, and scheduling.
 * Runs once when the app becomes active.
 */
async function initNotifications() {
  await setupNotificationChannel();
  await setupIOSCategories();
  const granted = await requestNotificationPermission();
  if (granted) {
    await scheduleNotifications();
  }
}

export default function App() {
  useEffect(() => {
    initNotifications().catch(console.error);
  }, []);

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NotificationHandler />
        <AppNavigator />
        <StatusBar style="dark" />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
