/**
 * Persistence layer for checkup notification responses.
 * Uses AsyncStorage to read / write response records keyed by date.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RESPONSES_STORAGE_KEY } from "../constants/notifications";
import type { CheckupResponse } from "../types/notifications";

/** Return all saved responses (across all dates). */
export async function getAllResponses(): Promise<CheckupResponse[]> {
  try {
    const raw = await AsyncStorage.getItem(RESPONSES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CheckupResponse[]) : [];
  } catch (error) {
    console.error("Failed to read checkup responses", error);
    return [];
  }
}

/** Append a single response and persist. */
export async function saveResponse(response: CheckupResponse): Promise<void> {
  try {
    const existing = await getAllResponses();
    existing.push(response);
    await AsyncStorage.setItem(
      RESPONSES_STORAGE_KEY,
      JSON.stringify(existing)
    );
  } catch (error) {
    console.error("Failed to save checkup response", error);
  }
}

/** Get responses filtered by a specific date string (YYYY-MM-DD). */
export async function getResponsesByDate(
  date: string
): Promise<CheckupResponse[]> {
  const all = await getAllResponses();
  return all.filter((r) => r.date === date);
}

/** Clear all saved responses (useful for debug / reset). */
export async function clearResponses(): Promise<void> {
  try {
    await AsyncStorage.removeItem(RESPONSES_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear checkup responses", error);
  }
}
