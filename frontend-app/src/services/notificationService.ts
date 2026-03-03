import notifee, { AndroidImportance } from "@notifee/react-native";
import { Platform } from "react-native";
import {
	NOTIFICATION_CHANNEL_ID,
	requestNotificationPermission,
	setupNotificationChannel,
} from "../utilities/scheduledNotifications";

export async function sendTestNotification(): Promise<boolean> {
	const granted = await requestNotificationPermission();
	if (!granted) return false;

	await setupNotificationChannel();

	await notifee.displayNotification({
		title: "Test notification",
		body: "If you see this, notifications are working.",
		android:
			Platform.OS === "android"
				? {
						channelId: NOTIFICATION_CHANNEL_ID,
						importance: AndroidImportance.HIGH,
						pressAction: { id: "default", launchActivity: "default" },
					}
				: undefined,
	});

	return true;
}

