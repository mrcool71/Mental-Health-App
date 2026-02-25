import { Mood } from "./models";

export interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
  testID?: string;
}

export interface ThemedTextInputProps {
  label: string;
  value: string;
  placeholder?: string;
  helperText?: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  accessibilityLabel: string;
}

export interface MoodBadgeProps {
  mood: Mood;
  label?: string;
  emoji?: string;
}

export interface ProgressRingProps {
  size?: number;
  value: number;
  max: number;
  label?: string;
  sublabel?: string;
}

export interface AvatarWithMascotProps {
  name: string;
  moodLabel: string;
}

export interface NotificationBannerProps {
  message: string;
  type?: "success" | "info" | "error";
}

export type QuickCheckMoodOption = {
  mood: Mood;
  label: string;
  variant: NonNullable<ThemedButtonProps["variant"]>;
};
