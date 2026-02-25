/**
 * Notification service — schedules daily wellbeing checkup notifications
 * using Notifee trigger notifications with inline action buttons.
 *
 * Each of the 5 questions is scheduled at a fixed daily time slot.
 * The user can answer directly from the notification (Android action buttons).
 */
import notifee, {
  AndroidImportance,
  AndroidAction,
  TriggerType,
  RepeatFrequency,
  TimestampTrigger,
  AuthorizationStatus,
} from "@notifee/react-native";
import {
  CHECKUP_CHANNEL_ID,
  CHECKUP_QUESTIONS,
  NOTIFICATION_SLOTS,
} from "../constants/notifications";
import type { CheckupQuestion } from "../types/notifications";

// ─── Channel ────────────────────────────────────────────────────────────────

/** Create (or update) the Android notification channel. */
export async function createCheckupChannel(): Promise<void> {
  await notifee.createChannel({
    id: CHECKUP_CHANNEL_ID,
    name: "Wellbeing Checkups",
    description: "Regular mental wellbeing check-in notifications",
    importance: AndroidImportance.HIGH,
  });
}

// ─── Permission ─────────────────────────────────────────────────────────────

/** Request notification permission (Android 13+). Returns true if granted. */
export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Build Android inline actions from a question's three options. */
function buildActions(question: CheckupQuestion): AndroidAction[] {
  return question.options.map((label, idx) => ({
    title: label,
    pressAction: { id: `${question.id}_opt${idx}` },
  }));
}

/**
 * Compute the next occurrence of a given hour:minute today or tomorrow.
 * If the slot has already passed today, it schedules for tomorrow.
 */
function getNextTriggerTimestamp(hour: number, minute: number): number {
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);

  if (target.getTime() <= now.getTime()) {
    // Slot already passed today — schedule for tomorrow
    target.setDate(target.getDate() + 1);
  }
  return target.getTime();
}

// ─── Scheduling ─────────────────────────────────────────────────────────────

/** Schedule (or re-schedule) all 5 daily checkup notifications. */
export async function scheduleAllCheckups(): Promise<void> {
  // Cancel any previously scheduled checkup notifications first
  await cancelAllCheckups();

  await createCheckupChannel();

  for (let i = 0; i < CHECKUP_QUESTIONS.length; i++) {
    const question = CHECKUP_QUESTIONS[i];
    const slot = NOTIFICATION_SLOTS[i];

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: getNextTriggerTimestamp(slot.hour, slot.minute),
      repeatFrequency: RepeatFrequency.DAILY,
    };

    await notifee.createTriggerNotification(
      {
        id: question.id,
        title: "🧠 Wellbeing Check-in",
        body: question.text,
        android: {
          channelId: CHECKUP_CHANNEL_ID,
          smallIcon: "ic_launcher",
          pressAction: { id: "default" },
          actions: buildActions(question),
          importance: AndroidImportance.HIGH,
          autoCancel: true,
        },
      },
      trigger
    );
  }

  console.log("✅ All 5 checkup notifications scheduled");
}

/** Cancel all scheduled checkup notifications. */
export async function cancelAllCheckups(): Promise<void> {
  const ids = CHECKUP_QUESTIONS.map((q) => q.id);
  for (const id of ids) {
    await notifee.cancelNotification(id);
  }
}

/** Display an immediate test notification (useful for development). */
export async function showTestCheckup(index: number = 0): Promise<void> {
  await createCheckupChannel();
  const question = CHECKUP_QUESTIONS[index % CHECKUP_QUESTIONS.length];

  await notifee.displayNotification({
    id: `test_${question.id}`,
    title: "🧠 Wellbeing Check-in",
    body: question.text,
    android: {
      channelId: CHECKUP_CHANNEL_ID,
      smallIcon: "ic_launcher",
      pressAction: { id: "default" },
      actions: buildActions(question),
      importance: AndroidImportance.HIGH,
      autoCancel: true,
    },
  });
}
