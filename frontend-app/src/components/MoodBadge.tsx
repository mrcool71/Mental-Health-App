import React from "react";
import { Text, View } from "react-native";
import styles from "../styles/badge.styles";
import { MoodBadgeProps } from "../types/ui";
import { moodEmoji } from "../constants/moods";

const MoodBadge: React.FC<MoodBadgeProps> = ({ mood, label, emoji }) => {
  const backgroundStyle =
    mood === "happy"
      ? styles.happy
      : mood === "good"
        ? styles.good
        : mood === "okay"
          ? styles.okay
          : styles.sad;

  return (
    <View
      accessible
      accessibilityLabel={`${label || mood} mood badge`}
      style={[styles.container, backgroundStyle]}
    >
      <Text style={styles.text}>{emoji || moodEmoji[mood]}</Text>
      <Text style={styles.text}>{label || mood}</Text>
    </View>
  );
};

export default MoodBadge;
