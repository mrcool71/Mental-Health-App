import type { NotificationResponse } from "../types/models";

interface NotificationActionDetail {
  notification?: {
    id?: string;
    data?: Record<string, string | number | object | undefined>;
  };
  pressAction?: { id?: string };
}

/**
 * Extracts a NotificationResponse from a Notifee action press event.
 * Returns null if the event is not a valid question-option press.
 */
export function parseNotificationAction(
  detail: NotificationActionDetail,
): NotificationResponse | null {
  const { notification, pressAction } = detail;
  if (!notification || !pressAction) return null;

  const actionId = pressAction.id;
  if (!actionId?.startsWith("option_")) return null;

  const optionIndex = parseInt(actionId.replace("option_", ""), 10);
  if (isNaN(optionIndex)) return null;

  const data = (notification.data ?? {}) as {
    questionId?: string;
    questionText?: string;
    options?: string;
  };
  if (!data.questionId || !data.options) return null;

  let options: string[];
  try {
    options = JSON.parse(data.options) as string[];
  } catch {
    return null;
  }

  return {
    id: `${notification.id ?? "n"}_${Date.now()}`,
    questionId: parseInt(data.questionId, 10),
    questionText: data.questionText ?? "",
    optionIndex,
    optionText: options[optionIndex] ?? "",
    timestamp: Date.now(),
  };
}
