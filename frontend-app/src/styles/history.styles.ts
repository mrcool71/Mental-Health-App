import { StyleSheet } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  // Filter tabs
  filterTabs: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
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
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 80,
    gap: theme.spacing.sm,
  },

  // Section headers
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

  // Subtle list item
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.backgroundAlt,
    gap: theme.spacing.sm,
  },
  moodDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  moodDotEmoji: {
    fontSize: 18,
  },
  historyItemBody: {
    flex: 1,
    gap: 2,
  },
  historyMoodLabel: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textPrimary,
    textTransform: "capitalize",
    fontWeight: "600",
  },
  historyItemTime: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
  },

  // Item meta (kept for energyPill alignment)
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

});
