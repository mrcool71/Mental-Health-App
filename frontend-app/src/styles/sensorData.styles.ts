import { StyleSheet, Platform } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 3,
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.black,
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  cardTitle: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fontFamilyDisplay,
    color: theme.colors.plum,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  label: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyDisplay,
    color: theme.colors.textPrimary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  error: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.danger,
    marginTop: 2,
  },
  emptyText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.muted,
    textAlign: "center",
    marginTop: theme.spacing.xl,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  toggleLabel: {
    flex: 1,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textPrimary,
  },
});
