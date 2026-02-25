import React from "react";
import { Text, View } from "react-native";
import styles from "../styles/avatar.styles";
import { AvatarWithMascotProps } from "../types/ui";

// Cat mascot avatar using tokens from src/theme/theme.ts via src/styles/avatar.styles.ts.
const AvatarWithMascot: React.FC<AvatarWithMascotProps> = ({
  name,
  moodLabel,
}) => (
  <View
    style={styles.container}
    accessible
    accessibilityLabel={`Profile for ${name}, feeling ${moodLabel}`}
  >
    <View style={styles.avatar} accessibilityRole="image">
      <Text style={styles.avatarText}>🐱</Text>
    </View>
    <View style={styles.info}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.mood}>{moodLabel}</Text>
    </View>
  </View>
);

export default AvatarWithMascot;
