/** Notification-related type definitions for the checkup system. */

/** A single checkup question shown as a notification with inline actions. */
export interface CheckupQuestion {
  /** Unique identifier for the question (e.g. "q1", "q2"). */
  id: string;
  /** The question text displayed in the notification body. */
  text: string;
  /** Three inline answer options for the notification action buttons. */
  options: [string, string, string];
}

/** A recorded response from a notification interaction. */
export interface CheckupResponse {
  /** The question ID that was answered. */
  questionId: string;
  /** The option label the user selected. */
  answer: string;
  /** Unix timestamp (ms) when the response was recorded. */
  timestamp: number;
  /** ISO date string (YYYY-MM-DD) for easy grouping by day. */
  date: string;
}

/** Schedule slot defining when a notification fires during the day. */
export interface NotificationSlot {
  /** Hour in 24-hour format. */
  hour: number;
  /** Minute of the hour. */
  minute: number;
  /** Label for debugging / logging. */
  label: string;
}
