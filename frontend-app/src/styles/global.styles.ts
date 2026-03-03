import { StyleSheet } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  // Layout
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
    gap: theme.spacing.md,
  },

  // Cards
  listItem: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },

  // Typography
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
  listMeta: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.small,
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

  // Sections
  section: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },

  // Mascot circles
  mascotCircleSm: {
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
  mascotCircleLg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.cardSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotEmojiSm: {
    fontSize: 24,
  },
  mascotEmojiLg: {
    fontSize: 56,
  },

  // Footer
  footerText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontFamily: theme.typography.fontFamilyPrimary,
  },

  // Grid
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
});
