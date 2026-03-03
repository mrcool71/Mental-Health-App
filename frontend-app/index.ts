import { registerRootComponent } from "expo";
import notifee, { EventType } from "@notifee/react-native";
import type { NotificationResponse } from "./src/types/models";
import { saveNotificationResponse } from "./src/utilities/notificationStorage";
import { NOTIFICATION_ID_PREFIX } from "./src/utilities/scheduledNotifications";
import App from "./App";

/**
 * Background / headless event handler.
 *
 * This MUST be registered before registerRootComponent so that Notifee can
 * wake up a headless JS task and run this when the app is killed or in the
 * background and the user taps one of the inline notification action buttons.
 *
 * Flow:
 *   User swipes down notification → taps option button
 *   → OS fires headless JS task
 *   → handler saves response to AsyncStorage
 *   → notification is dismissed
 *   → next time the app opens, StoreProvider loads the saved responses
 */
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type !== EventType.ACTION_PRESS) return;

  const { notification, pressAction } = detail;
  if (!notification || !pressAction) return;

  const actionId = pressAction.id; // e.g. "option_0", "option_2"
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

  await saveNotificationResponse(response);

  // Dismiss the notification so it doesn't linger in the tray
  if (notification.id) {
    await notifee.cancelNotification(notification.id);
  }

  // If this was the last pre-scheduled notification (prefix matches our batch),
  // we can't reschedule here because the app isn't running.
  // scheduleNotifications() will be called next time the app opens in App.tsx.
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App).
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately.
registerRootComponent(App);
