import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationResponse } from "../types/models";

const STORAGE_KEY = "@mental_app/notification_responses";

/**
 * Persists a single notification response to AsyncStorage.
 * Prepends to existing entries so most-recent comes first.
 * Safe to call from both foreground and background (headless) contexts.
 */
export async function saveNotificationResponse(
  response: NotificationResponse,
): Promise<void> {
  const existing = await loadNotificationResponses();
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([response, ...existing]),
  );
}

/**
 * Loads all persisted notification responses from AsyncStorage.
 * Returns an empty array on error or if no data exists.
 */
export async function loadNotificationResponses(): Promise<
  NotificationResponse[]
> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as NotificationResponse[];
  } catch {
    return [];
  }
}
