import notifee, {
  AndroidImportance,
  TriggerType,
  type TimestampTrigger,
} from "@notifee/react-native";
import { Platform } from "react-native";
import questionsData from "../../assets/mental-health-questions.json";
import {
  NOTIFICATION_CHANNEL_ID,
  NOTIFICATION_ID_PREFIX,
} from "../constants/notifications";
import {
  buildDailyQuestionBatch,
  buildNotificationPayload,
} from "../utilities/questionHelpers";

export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await notifee.createChannel({
    id: NOTIFICATION_CHANNEL_ID,
    name: "Mental Health Check-in",
    description: "Regular mental health question prompts",
    importance: AndroidImportance.HIGH,
    vibration: true,
    lights: true,
  });
}

export async function setupIOSCategories(): Promise<void> {
  if (Platform.OS !== "ios") return;
  const categories = questionsData.questions.map((q) => ({
    id: `question_${q.id}`,
    actions: q.options.map((opt, idx) => ({
      id: `option_${idx}`,
      title: opt,
      foreground: false,
    })),
    intentIdentifiers: [],
    hiddenPreviewsBodyPlaceholder: q.question,
    allowInCarPlay: false,
  }));
  await notifee.setNotificationCategories(categories);
}

export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1;
}

export async function scheduleNotifications(): Promise<void> {
  const existing = await notifee.getTriggerNotifications();
  await Promise.all(
    existing
      .filter((n) => n.notification.id?.startsWith(NOTIFICATION_ID_PREFIX))
      .map((n) => notifee.cancelTriggerNotification(n.notification.id!)),
  );

  const batch = buildDailyQuestionBatch();

  await Promise.all(
    batch.map((item) => {
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: item.timestamp,
      };
      return notifee.createTriggerNotification(
        buildNotificationPayload(item),
        trigger,
      );
    }),
  );
}
