import { StyleSheet } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    justifyContent: "space-between",
    gap: theme.spacing.lg,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    minHeight: theme.touch.minSize,
  },
  skipButton: {
    minHeight: theme.touch.minSize,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.sm,
  },
  skipText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
  },
  hero: {
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
  },
  mascotCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.cardSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotEmoji: {
    fontSize: 58,
  },
  title: {
    textAlign: "center",
  },
  body: {
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    gap: theme.spacing.md,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  nextButton: {
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.primary,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.body,
    fontWeight: "600",
  },
});
