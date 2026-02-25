import { StyleSheet } from "react-native";
import theme from "../theme/theme";

// Shared layout styles; always source tokens from src/theme/theme.ts.
export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  heading: {
    fontSize: theme.typography.sizes.h1,
    fontFamily: theme.typography.fontFamilyDisplay,
    color: theme.colors.plum,
    fontWeight: "700",
  },
  subheading: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.plum,
  },
  body: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textSecondary,
  },
  sectionHeader: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.muted,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  pillButton: {
    borderRadius: theme.radii.pill,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  pillButtonText: {
    color: theme.colors.white,
    fontWeight: "600",
    fontSize: theme.typography.sizes.body,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spacer: {
    height: theme.spacing.md,
  },
});
