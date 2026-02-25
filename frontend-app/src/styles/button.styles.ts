import { StyleSheet } from "react-native";
import theme from "../theme/theme";

// Button visuals; variants consume tokens only from src/theme/theme.ts.
export default StyleSheet.create({
  base: {
    minHeight: theme.touch.minSize,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.9,
  },
  text: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.h3,
    color: theme.colors.textPrimary,
  },
  textInverted: {
    color: theme.colors.white,
  },
});
