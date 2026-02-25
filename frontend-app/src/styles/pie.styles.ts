import { StyleSheet } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.lg,
  },
  legend: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flexShrink: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textPrimary,
    textTransform: "capitalize",
  },
  legendValue: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
  },
});
