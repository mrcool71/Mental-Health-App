import type { CheckupQuestion, NotificationSlot } from "../types/notifications";

/** Channel ID used for all wellbeing checkup notifications. */
export const CHECKUP_CHANNEL_ID = "wellbeing-checkup";

/** AsyncStorage key for persisted responses. */
export const RESPONSES_STORAGE_KEY = "@checkup_responses";

/**
 * Five daily checkup questions — each fires once per day at the scheduled slot.
 * Every question offers 3 inline options the user can answer without opening the app.
 */
export const CHECKUP_QUESTIONS: CheckupQuestion[] = [
  {
    id: "q1",
    text: "Good morning! How are you feeling right now?",
    options: ["Great 😊", "Okay 😐", "Not good 😔"],
  },
  {
    id: "q2",
    text: "How's your energy level at the moment?",
    options: ["High ⚡", "Moderate 🔋", "Low 🪫"],
  },
  {
    id: "q3",
    text: "How are you managing stress today?",
    options: ["Well 💪", "Somewhat 🤷", "Struggling 😣"],
  },
  {
    id: "q4",
    text: "Have you taken a break or relaxed today?",
    options: ["Yes ✅", "A little 🕐", "Not yet ❌"],
  },
  {
    id: "q5",
    text: "How would you rate your overall mood right now?",
    options: ["Happy 😄", "Neutral 😶", "Down 😞"],
  },
];

/**
 * Five time slots spread across the day for each question.
 * q1 → 09:00, q2 → 11:30, q3 → 14:00, q4 → 17:00, q5 → 20:30
 */
export const NOTIFICATION_SLOTS: NotificationSlot[] = [
  { hour: 9, minute: 0, label: "Morning" },
  { hour: 11, minute: 30, label: "Late Morning" },
  { hour: 14, minute: 0, label: "Afternoon" },
  { hour: 17, minute: 0, label: "Evening" },
  { hour: 20, minute: 30, label: "Night" },
];
