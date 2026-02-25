import { StyleSheet } from "react-native";
import theme from "../theme/theme";

// Notification banner visuals sourced from src/theme/theme.ts.
export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    gap: theme.spacing.sm,
  },
  text: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  success: {
    backgroundColor: theme.colors.accentAlt,
  },
  info: {
    backgroundColor: theme.colors.backgroundAlt,
  },
  error: {
    backgroundColor: theme.colors.accent,
  },
});
