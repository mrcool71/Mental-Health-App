import { registerRootComponent } from "expo";
import notifee, { EventType } from "@notifee/react-native";
import { saveNotificationResponse } from "./src/utilities/notificationStorage";
import { parseNotificationAction } from "./src/utilities/parseNotificationAction";
import App from "./App";

// Background handler — must be registered before registerRootComponent.
// Fires when the app is killed/background and the user taps an option button.
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type !== EventType.ACTION_PRESS) return;

  const response = parseNotificationAction(detail);
  if (!response) return;

  await saveNotificationResponse(response);

  if (detail.notification?.id) {
    await notifee.cancelNotification(detail.notification.id);
  }
});

registerRootComponent(App);
