import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { MaterialIcons } from "@expo/vector-icons";
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
import SensorCollector from "./src/components/SensorCollector";

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
  const [fontsLoaded, fontsError] = useFonts({
    // Spread the exact font object that @expo/vector-icons uses internally.
    // This guarantees Font.isLoaded("material") is true when icons render.
    ...MaterialIcons.font,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    PoppinsRegular: require("./assets/Poppins/Poppins-Regular.ttf"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    PoppinsSemiBold: require("./assets/Poppins/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    initNotifications().catch(console.error);
  }, []);

  // Wait for fonts, but never block if loading errored — avoids permanent white screen.
  if (!fontsLoaded && !fontsError) return null;

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NotificationHandler />
        <SensorCollector />
        <AppNavigator />
        <StatusBar style="dark" />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
