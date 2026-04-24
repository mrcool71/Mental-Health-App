import questionsData from "../../assets/mental-health-questions.json";
import { AndroidImportance } from "@notifee/react-native";
import {
  DEFAULT_CHECK_IN_TIME_MINUTES,
  NOTIFICATION_CHANNEL_ID,
  NOTIFICATION_ID_PREFIX,
  SCHEDULE_DAYS,
} from "../constants/notifications";

export type Question = (typeof questionsData.questions)[number];

export interface ScheduledQuestion {
  id: string;
  question: Question;
  timestamp: number;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function makeDate(base: Date, dayOffset: number): Date {
  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + dayOffset,
  );
}

function toTimestamp(day: Date, hour: number, minute: number): number {
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    hour,
    minute,
  ).getTime();
}

function splitTime(totalMinutes: number): { hour: number; minute: number } {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return { hour, minute };
}

export function buildDailyQuestionBatch(
  preferredTimeMinutes: number = DEFAULT_CHECK_IN_TIME_MINUTES,
): ScheduledQuestion[] {
  const now = Date.now();
  const today = new Date();
  const batch: ScheduledQuestion[] = [];
  const { hour, minute } = splitTime(preferredTimeMinutes);

  let pool = shuffle(questionsData.questions);
  let idx = 0;

  for (let day = 0; day < SCHEDULE_DAYS; day++) {
    if (idx >= pool.length) {
      pool = shuffle(questionsData.questions);
      idx = 0;
    }

    const question = pool[idx];
    idx += 1;

    const date = makeDate(today, day);
    const key = localDateKey(date);
    const ts = toTimestamp(date, hour, minute);
    if (ts <= now + 60_000) continue;

    batch.push({
      id: `${NOTIFICATION_ID_PREFIX}${key}_0`,
      question,
      timestamp: ts,
    });
  }

  return batch;
}

/** Builds the Notifee notification config for a scheduled question. */
export function buildNotificationPayload(item: ScheduledQuestion) {
  const { id, question: q } = item;
  return {
    id,
    title: "🧠 Mental Health Check-in",
    body: q.question,
    data: {
      questionId: String(q.id),
      questionText: q.question,
      options: JSON.stringify(q.options),
    },
    android: {
      channelId: NOTIFICATION_CHANNEL_ID,
      importance: AndroidImportance.HIGH,
      pressAction: { id: "default", launchActivity: "default" } as const,
      actions: q.options.map((opt, i) => ({
        title: opt,
        pressAction: { id: `option_${i}` },
      })),
    },
    ios: { categoryId: `question_${q.id}` },
  };
}
