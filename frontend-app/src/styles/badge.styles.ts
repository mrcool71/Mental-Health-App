import { StyleSheet } from "react-native";
import theme from "../theme/theme";

// Mood badge styles; colors come from src/theme/theme.ts.
export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.pill,
    gap: theme.spacing.xs,
  },
  text: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textPrimary,
  },
  happy: {
    backgroundColor: theme.colors.accentAlt,
  },
  good: {
    backgroundColor: theme.colors.primary,
  },
  okay: {
    backgroundColor: theme.colors.lilac,
  },
  sad: {
    backgroundColor: theme.colors.accent,
  },
});
