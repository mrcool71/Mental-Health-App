import { MoodEntry } from "../types/models";
import { initialState, moodScores } from "../constants/store";
import { loadAccelerometerReadings, loadMicrophoneReadings } from './sensorStorage';
import type { AccelerometerReading, MicrophoneReading } from '../types/sensors';
import type { WellbeingBreakdown } from '../types/wellbeing';
import { getCurrentUser } from "../services/auth";
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";

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

// Returns mood score 0-100 from MoodEntry history using Time Decay & Volatility
export function calcMoodScore(entries: MoodEntry[]): number {
  if (!entries.length) return initialState.score;
  
  // Sort entries descending by timestamp
  const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp);
  
  const now = Date.now();
  let totalWeight = 0;
  let weightedSum = 0;
  const scores: number[] = [];

  sorted.forEach(e => {
    const score = moodScores[e.mood];
    scores.push(score);

    // Decay factor: half-life of 3 days
    const daysOld = (now - e.timestamp) / (1000 * 60 * 60 * 24);
    const weight = Math.pow(0.5, daysOld / 3); 

    weightedSum += score * weight;
    totalWeight += weight;
  });

  let baseScore = weightedSum / totalWeight;

  // Volatility Penalty (Standard Deviation)
  if (scores.length > 1) {
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    // Penalize up to 10 points for high volatility
    const penalty = Math.min(10, stdDev * 0.2); 
    baseScore -= penalty;
  }

  return Math.min(100, Math.max(0, Math.round(baseScore)));
}

// Returns energy score 0-100 from a smoothed moving average of recent entries
export function calcEnergyScore(entries: MoodEntry[]): number {
  if (!entries.length) return 50;
  
  const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp);
  const recent = sorted.slice(0, 3);
  
  let total = 0;
  recent.forEach(e => {
    if (e.energy === 'high') total += 100;
    else if (e.energy === 'medium') total += 60;
    else if (e.energy === 'low') total += 25;
    else total += 50;
  });
  
  return Math.round(total / recent.length);
}

// Returns activity score 0-100 from accelerometer readings
// Uses a Log-Normal / Bell-Curve mapping centered around an optimal magnitude
export function calcActivityScore(readings: AccelerometerReading[]): number {
  if (!readings.length) return 50;
  
  const avgMagnitude =
    readings.reduce(
      (sum, r) => sum + Math.sqrt(r.x * r.x + r.y * r.y + r.z * r.z),
      0,
    ) / readings.length;
    
  // Optimal magnitude is ~1.5. Lower is lethargic, higher is erratic.
  const optimalMagnitude = 1.5;
  const variance = 0.5; // Spread of the curve
  
  const score = 100 * Math.exp(-Math.pow(avgMagnitude - optimalMagnitude, 2) / (2 * variance));
  return Math.min(100, Math.max(0, Math.round(score)));
}

// Returns noise score 0-100 from microphone readings using threshold-based proxy
export function calcNoiseScore(readings: MicrophoneReading[]): number {
  const valid = readings.filter(
    (r) => r.meteringDb !== undefined && r.meteringDb !== null,
  );
  if (!valid.length) return 50;
  
  // Percentage of time above -40 dB (stressful threshold)
  const THRESHOLD = -40;
  const loudReadings = valid.filter(r => (r.meteringDb as number) > THRESHOLD);
  const loudPercentage = loudReadings.length / valid.length;
  
  // Score is inversely proportional to loud percentage
  const score = 100 * (1 - loudPercentage);
  return Math.min(100, Math.max(0, Math.round(score)));
}

// Helper to fetch external scores from Firestore
async function fetchScoreFromFirestore(userId: string, docName: string): Promise<number | null> {
  try {
    const docRef = doc(getFirestore(), "users", userId, "integrations", docName);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (typeof data?.score === 'number') {
        return data.score;
      }
    }
  } catch (e) {
    console.error(`[calculateScore] Error fetching ${docName}:`, e);
  }
  return null;
}

// Reads sensor history and computes a full breakdown dynamically weighted
export async function calculateWellbeingBreakdown(
  entries: MoodEntry[],
): Promise<WellbeingBreakdown> {
  try {
    const [accelReadings, micReadings] = await Promise.all([
      loadAccelerometerReadings(),
      loadMicrophoneReadings(),
    ]);

    const mood = calcMoodScore(entries);
    const energy = calcEnergyScore(entries);
    const activity = calcActivityScore(accelReadings);
    const noise = calcNoiseScore(micReadings);
    
    const user = getCurrentUser();
    let sleepScore: number | null = null;
    let socialScore: number | null = null;

    if (user) {
      const [fetchedSleep, fetchedSocial] = await Promise.all([
        fetchScoreFromFirestore(user.uid, "sleep"),
        fetchScoreFromFirestore(user.uid, "social")
      ]);
      sleepScore = fetchedSleep;
      socialScore = fetchedSocial;
    }

    const sleep = sleepScore !== null ? sleepScore : 50;
    const social = socialScore !== null ? socialScore : 50;

    // Base weights assuming sleep and social are not present
    let moodWeight = 0.40;
    let energyWeight = 0.30;
    let activityWeight = 0.20;
    let noiseWeight = 0.10;
    let sleepWeight = 0;
    let socialWeight = 0;

    // Adjust weights if data is dynamically fetched from Firestore
    if (sleepScore !== null) {
      sleepWeight = 0.05;
      moodWeight -= 0.025;
      energyWeight -= 0.025;
    }
    
    if (socialScore !== null) {
      socialWeight = 0.05;
      moodWeight -= 0.025;
      energyWeight -= 0.025;
    }

    const overall = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          mood * moodWeight +
            energy * energyWeight +
            activity * activityWeight +
            noise * noiseWeight +
            sleep * sleepWeight +
            social * socialWeight
        ),
      ),
    );

    return { overall, mood, energy, activity, noise, sleep, social };
  } catch (e) {
    console.error('[calculateWellbeingBreakdown] failed:', e);
    return {
      overall: 50,
      mood: 50,
      energy: 50,
      activity: 50,
      noise: 50,
      sleep: 50,
      social: 50,
    };
  }
}
