import { MoodEntry } from "../types/models";
import { initialState, moodScores } from "../constants/store";
import { loadAccelerometerReadings, loadMicrophoneReadings } from './sensorStorage'
import type { AccelerometerReading, MicrophoneReading } from '../types/sensors'
import type { WellbeingBreakdown } from '../types/wellbeing'

/**
 * Computes the average wellbeing score from an array of mood entries.
 * Falls back to the initial default score when the array is empty.
 */
export function calculateScore(entries: MoodEntry[]): number {
  if (!entries.length) return initialState.score;
  const total = entries.reduce((sum, entry) => sum + moodScores[entry.mood], 0);
  return Math.round(total / entries.length);
}

/**
 * Returns a human-friendly label describing the wellbeing score range.
 */
export const getScoreLabel = (score: number): string => {
  if (score >= 90) return "Excellent — thriving!";
  if (score >= 70) return "Good — keep it up!";
  if (score >= 50) return "Okay — you're doing fine.";
  return "Low — be gentle with yourself.";
};

// Returns mood score 0-100 from MoodEntry history
export function calcMoodScore(entries: MoodEntry[]): number {
  if (!entries.length) return initialState.score
  const total = entries.reduce((sum, e) => sum + moodScores[e.mood], 0)
  return Math.round(total / entries.length)
}

// Returns energy score 0-100 from the most recent MoodEntry
// High=100, Medium=60, Low=25, no entries=50
export function calcEnergyScore(entries: MoodEntry[]): number {
  if (!entries.length) return 50
  const latest = entries[0]
  if (latest.energy === 'high') return 100
  if (latest.energy === 'medium') return 60
  if (latest.energy === 'low') return 25
  return 50
}

// Returns activity score 0-100 from accelerometer readings
// Still phone (gravity only) = magnitude ~1.0 = score 0
// Active movement = magnitude >2.5 = score 100
export function calcActivityScore(readings: AccelerometerReading[]): number {
  if (!readings.length) return 50
  const avgMagnitude =
    readings.reduce(
      (sum, r) => sum + Math.sqrt(r.x * r.x + r.y * r.y + r.z * r.z),
      0,
    ) / readings.length
  const score = ((avgMagnitude - 1.0) / 1.5) * 100
  return Math.min(100, Math.max(0, Math.round(score)))
}

// Returns noise score 0-100 from microphone readings
// meteringDb range: -160 (silent) to 0 (loudest)
export function calcNoiseScore(readings: MicrophoneReading[]): number {
  const valid = readings.filter(
    (r) => r.meteringDb !== undefined && r.meteringDb !== null,
  )
  if (!valid.length) return 50
  const avgDb =
    valid.reduce((sum, r) => sum + (r.meteringDb as number), 0) / valid.length
  const score = ((avgDb + 160) / 160) * 100
  return Math.min(100, Math.max(0, Math.round(score)))
}

// Reads sensor history from AsyncStorage and computes a full breakdown.
// Always returns a valid WellbeingBreakdown — never throws.
export async function calculateWellbeingBreakdown(
  entries: MoodEntry[],
): Promise<WellbeingBreakdown> {
  try {
    const [accelReadings, micReadings] = await Promise.all([
      loadAccelerometerReadings(),
      loadMicrophoneReadings(),
    ])

    const mood = calcMoodScore(entries)
    const energy = calcEnergyScore(entries)
    const activity = calcActivityScore(accelReadings)
    const noise = calcNoiseScore(micReadings)
    const sleep = 50
    const social = 50

    const overall = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          mood * 0.35 +
            energy * 0.25 +
            activity * 0.20 +
            noise * 0.10 +
            sleep * 0.05 +
            social * 0.05,
        ),
      ),
    )

    return { overall, mood, energy, activity, noise, sleep, social }
  } catch (e) {
    console.error('[calculateWellbeingBreakdown] failed:', e)
    return {
      overall: 50,
      mood: 50,
      energy: 50,
      activity: 50,
      noise: 50,
      sleep: 50,
      social: 50,
    }
  }
}
