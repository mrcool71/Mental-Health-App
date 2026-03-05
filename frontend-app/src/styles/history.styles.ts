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

});
