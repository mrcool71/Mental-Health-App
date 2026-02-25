import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableStateCallbackType,
} from "react-native";
import styles from "../styles/button.styles";
import { colors } from "../theme/theme";
import { ThemedButtonProps } from "../types/ui";
import { buttonVariantMap } from "../constants/button";

// Use tokens from src/theme/theme.ts; styles reside in src/styles/button.styles.ts.
const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  accessibilityLabel,
  testID,
}) => {
  const isPrimary = variant === "primary";
  const textColorStyle = isPrimary ? styles.textInverted : styles.text;
  const indicatorColor = isPrimary ? colors.white : colors.textPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessible
      testID={testID}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }: PressableStateCallbackType) => [
        styles.base,
        buttonVariantMap[variant],
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <Text style={textColorStyle}>{title}</Text>
      )}
    </Pressable>
  );
};

export default ThemedButton;
