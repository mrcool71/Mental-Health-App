import { StyleSheet } from "react-native";
import theme from "../theme/theme";

// Progress ring styles; visuals still pull from src/theme/theme.ts.
export default StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  ringWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  ringLabel: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.h3,
    color: theme.colors.textPrimary,
  },
  sublabel: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
  },
});

// Helper to size ring wrapper dynamically while keeping definition near other styles.
export const ringSize = (size: number) => ({ width: size, height: size });
