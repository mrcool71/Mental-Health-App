import { StyleSheet } from "react-native";
import theme from "../theme/theme";

// Input styles reference tokens from src/theme/theme.ts.
export default StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  label: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    minHeight: theme.touch.minSize,
    borderWidth: 1,
    borderColor: theme.colors.lilac,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textPrimary,
  },
  helper: {
    marginTop: theme.spacing.xs,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.small,
  },
});
