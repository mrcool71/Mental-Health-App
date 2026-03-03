export const NOTIFICATION_CHANNEL_ID = "mental_health_checkin";
export const NOTIFICATION_ID_PREFIX = "mhq_";

/** How many days ahead to schedule (2 notifications/day). */
export const SCHEDULE_DAYS = 30;

/** Daily notification times (local device time). */
export const DAILY_SLOTS: ReadonlyArray<{
  hour: number;
  minute: number;
  slotIndex: 0 | 1;
}> = [
  { hour: 10, minute: 0, slotIndex: 0 },
  { hour: 18, minute: 0, slotIndex: 1 },
];
