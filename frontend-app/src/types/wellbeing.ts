export type BreakdownStat = {
  label: string;
  value: number;
  color: string;
};

export interface WellbeingBreakdown {
  overall: number   // 0–100 final blended score
  mood: number      // from MoodEntry history
  energy: number    // from MoodEntry energy field
  activity: number  // from accelerometer magnitude
  noise: number     // from microphone dB
  sleep: number     // placeholder 50
  social: number    // placeholder 50
}
