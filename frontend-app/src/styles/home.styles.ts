import { StyleSheet } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
    gap: theme.spacing.md,
  },

  // Greeting section
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  greetingTextWrap: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  greetingTitle: {
    fontSize: theme.typography.sizes.h1,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyDisplay,
    fontWeight: "700",
    lineHeight: 36,
  },
  greetingSubtitle: {
    color: theme.colors.textSecondary,
  },
  mascotCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  mascotEmoji: {
    fontSize: 24,
  },

  // Quote card
  quoteCard: {
    backgroundColor: theme.colors.quoteCard,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  quoteText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 24,
  },
  quoteDash: {
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    alignSelf: "center",
    marginTop: theme.spacing.sm,
  },

  // Quick check-in card
  checkinCard: {
    backgroundColor: theme.colors.checkinCard,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  checkinTitle: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fontFamilyDisplay,
    color: theme.colors.white,
    fontWeight: "700",
    lineHeight: 30,
  },
  checkinSubtitle: {
    color: theme.colors.white,
    opacity: 0.85,
    lineHeight: 22,
  },
  catStrip: {
    height: 80,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  catStripRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
  },
  catStripEmoji: {
    fontSize: 30,
  },
  checkinButton: {
    alignSelf: "center",
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.white,
    minHeight: 46,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  checkinButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyDisplay,
    fontWeight: "600",
  },

  // Latest entry row
  latestRow: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  latestMeta: {
    alignItems: "flex-end",
    gap: theme.spacing.xs,
  },
  latestLabel: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.muted,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  latestTime: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
  },
});
