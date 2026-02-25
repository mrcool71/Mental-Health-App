import { Mood, MoodEntry } from "./models";

export type TabBarItemProps = {
  routeName: string;
  label: string;
  focused: boolean;
  iconName: string;
  showBadge: boolean;
  accessibilityLabel?: string;
  testID?: string;
  onPress: () => void;
  onLongPress: () => void;
};

export type PieSegment = {
  mood: Mood;
  value: number;
  color: string;
};

export type WellbeingPieChartProps = {
  entries: MoodEntry[];
  size?: number;
  strokeWidth?: number;
};
