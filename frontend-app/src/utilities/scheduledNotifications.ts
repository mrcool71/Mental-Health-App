/**
 * scheduledNotifications.ts
 *
 * Handles:
 *  - Android notification channel creation
 *  - iOS notification category registration (one per question, so action
 *    button titles match the actual question options)
 *  - Scheduling SCHEDULE_COUNT timestamp-trigger notifications spaced 2 hours
 *    apart, each carrying a random question from mental-health-questions.json
 *
 * Works even when the app is closed because the OS fires the notifications
 * at the scheduled timestamps without the app being alive.
 */

import notifee, {
  AndroidImportance,
  TriggerType,
  type TimestampTrigger,
} from "@notifee/react-native";
import { Platform } from "react-native";
import questionsData from "../../assets/mental-health-questions.json";

// ─── Constants ────────────────────────────────────────────────────────────────
export const NOTIFICATION_CHANNEL_ID = "mental_health_checkin";
export const NOTIFICATION_ID_PREFIX = "mhq_";
/** How many future notifications to pre-schedule (2 h × 14 = 28 h of coverage). */
const SCHEDULE_COUNT = 14;
/** Interval between notifications in milliseconds (2 hours). */
const INTERVAL_MS = 2 * 60 * 60 * 1000;

// ─── Channel (Android) ────────────────────────────────────────────────────────
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

// ─── iOS Categories ───────────────────────────────────────────────────────────
/**
 * Registers one notification category per question so that iOS action buttons
 * show the actual option text for each question.
 * Must be called on app launch (before the first foreground event listener).
 */
export async function setupIOSCategories(): Promise<void> {
  if (Platform.OS !== "ios") return;
  const categories = questionsData.questions.map((q) => ({
    id: `question_${q.id}`,
    actions: q.options.map((opt, idx) => ({
      id: `option_${idx}`,
      title: opt,
      // foreground: false keeps the app from opening when a button is tapped
      foreground: false,
    })),
    intentIdentifiers: [],
    hiddenPreviewsBodyPlaceholder: q.question,
    allowInCarPlay: false,
  }));
  await notifee.setNotificationCategories(categories);
}

// ─── Permission ───────────────────────────────────────────────────────────────
/** Requests notification permission and returns whether it was granted. */
export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1;
}

// ─── Scheduling ───────────────────────────────────────────────────────────────
function pickUniqueRandomQuestions(
  count: number,
): (typeof questionsData.questions)[number][] {
  const pool = [...questionsData.questions].sort(() => Math.random() - 0.5);
  const result: (typeof questionsData.questions)[number][] = [];
  for (let i = 0; i < count; i++) {
    // wrap-around if count > total questions
    result.push(pool[i % pool.length]);
  }
  return result;
}

/**
 * Cancels any previously scheduled check-in notifications and schedules a
 * fresh batch of SCHEDULE_COUNT notifications, each 2 hours apart, each
 * carrying a randomly selected question with inline action buttons.
 *
 * Call this:
 *  - On app foreground / launch (so the pipeline stays full)
 *  - Does NOT cancel unrelated notifications from other channels
 */
export async function scheduleNotifications(): Promise<void> {
  // Cancel previous batch
  const existing = await notifee.getTriggerNotifications();
  await Promise.all(
    existing
      .filter((n) => n.notification.id?.startsWith(NOTIFICATION_ID_PREFIX))
      .map((n) => notifee.cancelTriggerNotification(n.notification.id!)),
  );

  const selected = pickUniqueRandomQuestions(SCHEDULE_COUNT);
  const now = Date.now();

  await Promise.all(
    selected.map((q, i) => {
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: now + (i + 1) * INTERVAL_MS,
      };

      return notifee.createTriggerNotification(
        {
          id: `${NOTIFICATION_ID_PREFIX}${i}`,
          title: "🧠 Mental Health Check-in",
          body: q.question,
          // Embed question data so the background handler can decode it
          // without needing the app to be open.
          data: {
            questionId: String(q.id),
            questionText: q.question,
            options: JSON.stringify(q.options),
          },
          android: {
            channelId: NOTIFICATION_CHANNEL_ID,
            importance: AndroidImportance.HIGH,
            // Tapping the notification body (not an action) opens the app
            pressAction: { id: "default", launchActivity: "default" },
            // Inline action buttons — user selects an option without opening app
            actions: q.options.map((opt, idx) => ({
              title: opt,
              // No launchActivity → background handler fires, app stays closed
              pressAction: { id: `option_${idx}` },
            })),
          },
          ios: {
            // Matches the category registered in setupIOSCategories()
            categoryId: `question_${q.id}`,
          },
        },
        trigger,
      );
    }),
  );
}
