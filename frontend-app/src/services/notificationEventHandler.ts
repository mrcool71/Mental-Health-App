/**
 * Handles Notifee notification events — specifically inline action presses.
 *
 * When the user taps one of the 3 answer options on a checkup notification,
 * we parse the action ID to identify the question + chosen option,
 * then persist the response via checkupStorage.
 */
import notifee, { EventType, Event } from "@notifee/react-native";
import { CHECKUP_QUESTIONS } from "../constants/notifications";
import { saveResponse } from "./checkupStorage";
import type { CheckupResponse } from "../types/notifications";

/**
 * Parse an action press ID like "q2_opt1" into { questionId, optionIndex }.
 * Returns null if the ID doesn't match the expected pattern.
 */
function parseActionId(
  actionId: string
): { questionId: string; optionIndex: number } | null {
  const match = actionId.match(/^(q\d+)_opt(\d+)$/);
  if (!match) return null;
  return { questionId: match[1], optionIndex: parseInt(match[2], 10) };
}

/** Core handler invoked for every Notifee event. */
export async function onNotificationEvent({ type, detail }: Event) {
  // We only care about action presses (inline button taps)
  if (type !== EventType.ACTION_PRESS) return;

  const actionId = detail.pressAction?.id;
  if (!actionId) return;

  const parsed = parseActionId(actionId);
  if (!parsed) return;

  const question = CHECKUP_QUESTIONS.find((q) => q.id === parsed.questionId);
  if (!question) return;

  const answer = question.options[parsed.optionIndex];
  if (!answer) return;

  const now = new Date();
  const response: CheckupResponse = {
    questionId: parsed.questionId,
    answer,
    timestamp: now.getTime(),
    date: now.toISOString().split("T")[0], // YYYY-MM-DD
  };

  await saveResponse(response);
  console.log(
    `📝 Checkup response saved: ${parsed.questionId} → "${answer}"`
  );

  // Dismiss the notification after the user has answered
  if (detail.notification?.id) {
    await notifee.cancelNotification(detail.notification.id);
  }
}

/**
 * Register the foreground event listener.
 * Call this once in your App component (useEffect).
 */
export function registerForegroundHandler(): () => void {
  return notifee.onForegroundEvent(onNotificationEvent);
}

/**
 * Register the background / quit-state event handler.
 * Call this at the TOP-LEVEL of index.ts (outside any component).
 */
export function registerBackgroundHandler(): void {
  notifee.onBackgroundEvent(onNotificationEvent);
}
