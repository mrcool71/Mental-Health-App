import notifee, { AndroidImportance } from "@notifee/react-native";
import { Platform } from "react-native";
import { NOTIFICATION_CHANNEL_ID } from "../constants/notifications";
import {
  requestNotificationPermission,
  setupNotificationChannel,
} from "../services/notificationScheduler";

export async function sendTestNotification(): Promise<boolean> {
  const granted = await requestNotificationPermission();
  if (!granted) return false;

  await setupNotificationChannel();

  const questionText = "Test question: How are you feeling right now?";
  const options = ["Great", "Okay", "Stressed", "Not good"];

  await notifee.displayNotification({
    title: "🧪 Test notification",
    body: questionText,
    data: {
      questionId: "0",
      questionText,
      options: JSON.stringify(options),
    },
    android:
      Platform.OS === "android"
        ? {
            channelId: NOTIFICATION_CHANNEL_ID,
            importance: AndroidImportance.HIGH,
            pressAction: { id: "default", launchActivity: "default" },
            actions: options.map((opt, idx) => ({
              title: opt,
              pressAction: { id: `option_${idx}` },
            })),
          }
        : undefined,
  });

  return true;
}
