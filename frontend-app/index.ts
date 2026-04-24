import { registerRootComponent } from "expo";
import notifee, { EventType } from "@notifee/react-native";
import { saveNotificationResponse } from "./src/utilities/notificationStorage";
import { parseNotificationAction } from "./src/utilities/parseNotificationAction";
import { syncNotificationResponse } from "./src/services/cloudSync";
import { getCurrentUser } from "./src/services/auth";
import "./src/services/sensors/backgroundLocationTask";
import "./src/services/sensors/sensorForegroundService";
import App from "./App";

// Background handler — must be registered before registerRootComponent.
// Fires when the app is killed/background and the user taps an option button.
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type !== EventType.ACTION_PRESS) return;

  const response = parseNotificationAction(detail);
  if (!response) return;

  await saveNotificationResponse(response);
  const user = getCurrentUser();
  if (user) {
    await syncNotificationResponse(user.uid, response);
  }

  if (detail.notification?.id) {
    await notifee.cancelNotification(detail.notification.id);
  }
});

registerRootComponent(App);
