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
    color: theme.colors.muted,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spacer: {
    height: theme.spacing.md,
  },
});
