import questionsData from "../../assets/mental-health-questions.json";
import { AndroidImportance } from "@notifee/react-native";
import {
  NOTIFICATION_CHANNEL_ID,
  NOTIFICATION_ID_PREFIX,
  SCHEDULE_DAYS,
  DAILY_SLOTS,
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

function pickTwoDistinct(pool: Question[], start: number): [Question, Question] {
  const slice = pool.slice(start);
  if (slice.length === 0) throw new Error("No questions available");
  if (slice.length === 1) return [slice[0], slice[0]];
  return [slice[0], slice[1].id !== slice[0].id || slice.length < 3 ? slice[1] : slice[2]];
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function makeDate(base: Date, dayOffset: number): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + dayOffset);
}

function toTimestamp(day: Date, hour: number, minute: number): number {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute).getTime();
}

/** Builds a flat list of {id, question, timestamp} for the next SCHEDULE_DAYS. */
export function buildDailyQuestionBatch(): ScheduledQuestion[] {
  const now = Date.now();
  const today = new Date();
  const batch: ScheduledQuestion[] = [];

  let pool = shuffle(questionsData.questions);
  let idx = 0;

  for (let day = 0; day < SCHEDULE_DAYS; day++) {
    if (idx + 2 > pool.length) { pool = shuffle(questionsData.questions); idx = 0; }

    const [q1, q2] = pickTwoDistinct(pool, idx);
    idx += 2;

    const date = makeDate(today, day);
    const key = localDateKey(date);

    for (const slot of DAILY_SLOTS) {
      const ts = toTimestamp(date, slot.hour, slot.minute);
      if (ts <= now + 60_000) continue;

      batch.push({
        id: `${NOTIFICATION_ID_PREFIX}${key}_${slot.slotIndex}`,
        question: slot.slotIndex === 0 ? q1 : q2,
        timestamp: ts,
      });
    }
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
