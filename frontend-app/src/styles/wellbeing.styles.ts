import { StyleSheet } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  titleMascot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.cardSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  scoreLabel: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.h3,
    fontWeight: "700",
    textAlign: "center",
  },
  statCard: {
    width: "48.5%",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.small,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  statValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.h3,
    fontWeight: "700",
  },
  tipsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  tipText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    lineHeight: 22,
  },
});
