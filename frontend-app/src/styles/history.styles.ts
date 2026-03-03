import { StyleSheet } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  // Filter tabs
  filterTabs: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  filterPill: {
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
  },
  filterPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterPillInactive: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.backgroundAlt,
  },
  filterPillText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
  },
  filterPillTextActive: {
    color: theme.colors.white,
  },
  filterPillTextInactive: {
    color: theme.colors.muted,
  },

  // List
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },

  // Section headers
  sectionHeader: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  sectionHeaderRow: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  sectionHeaderText: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // Item meta
  itemMetaWrap: {
    alignItems: "flex-end",
    gap: theme.spacing.xs,
  },
  energyPill: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
  },
  energyPillText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamilyPrimary,
  },

  // Notification response card
  notifCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  notifHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notifBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
  },
  notifBadgeText: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.primary,
  },
  notifQuestion: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.plum,
    lineHeight: 22,
  },
  notifAnswerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  notifAnswer: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.success,
    fontWeight: "600",
  },
});
