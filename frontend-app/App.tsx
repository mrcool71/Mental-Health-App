import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import notifee, { EventType } from "@notifee/react-native";
import { StoreProvider, useStore } from "./src/store";
import AppNavigator from "./src/navigation";
import {
  setupNotificationChannel,
  setupIOSCategories,
  requestNotificationPermission,
  scheduleNotifications,
} from "./src/services/notificationScheduler";
import { saveNotificationResponse } from "./src/utilities/notificationStorage";
import { parseNotificationAction } from "./src/utilities/parseNotificationAction";

/** Handles Notifee foreground action presses (background equivalent in index.ts). */
function NotificationHandler() {
  const { addNotificationResponse } = useStore();

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type !== EventType.ACTION_PRESS) return;

      const response = parseNotificationAction(detail);
      if (!response) return;

      saveNotificationResponse(response);
      addNotificationResponse(response);

      if (detail.notification?.id) {
        notifee.cancelNotification(detail.notification.id);
      }
    });

    return () => unsubscribe();
  }, [addNotificationResponse]);

  return null;
}

async function initNotifications() {
  await setupNotificationChannel();
  await setupIOSCategories();
  const granted = await requestNotificationPermission();
  if (granted) await scheduleNotifications();
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
