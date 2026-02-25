import { ViewStyle } from "react-native";
import styles from "../styles/button.styles";
import type { ThemedButtonProps } from "../types/ui";

export const buttonVariantMap: Record<
  NonNullable<ThemedButtonProps["variant"]>,
  ViewStyle
> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
};
