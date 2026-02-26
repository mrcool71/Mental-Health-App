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
  titleMascotText: {
    fontSize: 24,
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
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
  statTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.backgroundAlt,
    overflow: "hidden",
  },
  statFill: {
    height: 4,
    borderRadius: 2,
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
