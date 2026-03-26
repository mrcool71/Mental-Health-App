import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "@react-native-firebase/firestore";
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type { MoodEntry, Phq9Assessment } from "../types/models";

/**
 * Cloud sync service — writes mood + PHQ-9 data to Firestore.
 * Sensor data stays local-only (Option C: lightest cloud footprint).
 *
 * Firestore schema:
 *   users/{userId}/mood_entries/{entryId}    → MoodEntry
 *   users/{userId}/phq9_assessments/{id}     → Phq9Assessment
 *   users/{userId}/profile                   → { hasOnboarded, lastSync }
 */

function userDocRef(userId: string) {
  return doc(getFirestore(), "users", userId);
}

// ─── Mood Entries ────────────────────────────────────────────────────

export async function syncMoodEntry(
  userId: string,
  entry: MoodEntry,
): Promise<void> {
  try {
    const ref = doc(
      collection(getFirestore(), "users", userId, "mood_entries"),
      entry.id,
    );
    await setDoc(ref, {
      ...entry,
      syncedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("[cloudSync] syncMoodEntry failed:", e);
  }
}

export async function loadCloudMoodEntries(
  userId: string,
): Promise<MoodEntry[]> {
  try {
    const col = collection(getFirestore(), "users", userId, "mood_entries");
    const q = query(col, orderBy("timestamp", "desc"), limit(500));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
        docSnap.data() as MoodEntry,
    );
  } catch (e) {
    console.error("[cloudSync] loadCloudMoodEntries failed:", e);
    return [];
  }
}

// ─── PHQ-9 Assessments ──────────────────────────────────────────────

export async function syncPhq9Assessment(
  userId: string,
  assessment: Phq9Assessment,
): Promise<void> {
  try {
    const ref = doc(
      collection(getFirestore(), "users", userId, "phq9_assessments"),
      assessment.id,
    );
    await setDoc(ref, {
      ...assessment,
      syncedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("[cloudSync] syncPhq9Assessment failed:", e);
  }
}

export async function loadCloudPhq9Assessments(
  userId: string,
): Promise<Phq9Assessment[]> {
  try {
    const col = collection(
      getFirestore(),
      "users",
      userId,
      "phq9_assessments",
    );
    const q = query(col, orderBy("timestamp", "desc"), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
        docSnap.data() as Phq9Assessment,
    );
  } catch (e) {
    console.error("[cloudSync] loadCloudPhq9Assessments failed:", e);
    return [];
  }
}

// ─── User Profile ───────────────────────────────────────────────────

export async function syncProfile(
  userId: string,
  profile: { hasOnboarded: boolean },
): Promise<void> {
  try {
    await setDoc(
      userDocRef(userId),
      {
        ...profile,
        lastSync: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (e) {
    console.error("[cloudSync] syncProfile failed:", e);
  }
}

export async function loadCloudProfile(
  userId: string,
): Promise<{ hasOnboarded?: boolean } | null> {
  try {
    const snapshot = await getDoc(userDocRef(userId));
    if (!snapshot.exists()) return null;
    return snapshot.data() as { hasOnboarded?: boolean };
  } catch (e) {
    console.error("[cloudSync] loadCloudProfile failed:", e);
    return null;
  }
}

// ─── Full Sync (download everything from cloud) ─────────────────────

export async function loadAllCloudData(userId: string): Promise<{
  history: MoodEntry[];
  phq9History: Phq9Assessment[];
  hasOnboarded: boolean;
}> {
  const [history, phq9History, profile] = await Promise.all([
    loadCloudMoodEntries(userId),
    loadCloudPhq9Assessments(userId),
    loadCloudProfile(userId),
  ]);

  return {
    history,
    phq9History,
    hasOnboarded: profile?.hasOnboarded ?? false,
  };
}
