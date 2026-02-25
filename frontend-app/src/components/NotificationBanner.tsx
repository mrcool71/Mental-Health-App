import React from "react";
import { Text, View } from "react-native";
import styles from "../styles/banner.styles";
import { NotificationBannerProps } from "../types/ui";

// Lightweight toast/banner; styles live in src/styles/banner.styles.ts.
const NotificationBanner: React.FC<NotificationBannerProps> = ({
  message,
  type = "info",
}) => {
  const tone =
    type === "success"
      ? styles.success
      : type === "error"
        ? styles.error
        : styles.info;
  return (
    <View
      style={[styles.container, tone]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={message}
    >
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default NotificationBanner;
