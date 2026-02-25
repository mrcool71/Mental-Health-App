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
    gap: theme.spacing.sm,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    overflow: "hidden",
  },
  profileCardInner: {
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  accentStrip: {
    width: 4,
    backgroundColor: theme.colors.primary,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.cardSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
    gap: theme.spacing.xs,
    justifyContent: "center",
  },
  name: {
    fontSize: theme.typography.sizes.h3,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyDisplay,
    fontWeight: "700",
  },
  email: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  moodBadgeWrap: {
    marginTop: theme.spacing.sm,
  },
  wellbeingLabel: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.small,
    fontWeight: "600",
  },
  wellbeingTrack: {
    height: 8,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.backgroundAlt,
    overflow: "hidden",
  },
  wellbeingFill: {
    height: 8,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.primary,
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
  settingRow: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  rowIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.backgroundAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTextWrap: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
  },
  rowTitleDanger: {
    color: theme.colors.danger,
  },
  rowSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  arrowText: {
    color: theme.colors.muted,
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fontFamilyDisplay,
  },
  switchDisabledRow: {
    opacity: 0.5,
  },
  footer: {
    marginTop: theme.spacing.xl,
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingBottom: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontFamily: theme.typography.fontFamilyPrimary,
  },
});
