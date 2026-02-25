import { Dimensions, StyleSheet } from "react-native";
import theme from "../theme/theme";

const screenWidth = Dimensions.get("window").width;
const quickActionWidth =
  (screenWidth - theme.spacing.lg * 2 - theme.spacing.sm) / 2;

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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.textPrimary,
  },
  titleEmoji: {
    fontSize: 28,
  },
  sectionHeader: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.muted,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: theme.spacing.md,
  },
  emergencyList: {
    gap: theme.spacing.sm,
  },
  emergencyCard: {
    backgroundColor: theme.colors.emergencySoft,
    borderRadius: theme.radii.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.danger,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  emergencyIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
  },
  emergencyNumber: {
    color: theme.colors.danger,
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fontFamilyDisplay,
    fontWeight: "700",
  },
  emergencySubtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  quickActionCard: {
    width: quickActionWidth,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  quickActionEmoji: {
    fontSize: 32,
  },
  quickActionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
    textAlign: "center",
  },
  quickActionSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamilyPrimary,
    textAlign: "center",
    lineHeight: 18,
  },
  learnMoreList: {
    gap: theme.spacing.sm,
  },
  learnMoreRow: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  learnMoreTextWrap: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  learnMoreTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
  },
  learnMoreSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
    lineHeight: 18,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  campusCard: {
    backgroundColor: theme.colors.cardSoft,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  campusHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  campusEmoji: {
    fontSize: 24,
  },
  campusTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fontFamilyDisplay,
    fontWeight: "700",
  },
  campusBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    lineHeight: 22,
  },
  campusLink: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
  },
  footerText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
    textAlign: "center",
    lineHeight: 18,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
});
