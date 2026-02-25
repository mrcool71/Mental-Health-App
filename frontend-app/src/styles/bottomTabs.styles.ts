import { StyleSheet, Platform } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  container: {
    position: "absolute",
    left: theme.spacing.md,
    right: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.black,
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
  tabItem: {
    flex: 1,
    minHeight: theme.touch.minSize,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  label: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.small,
  },
  badgeDot: {
    position: "absolute",
    top: theme.spacing.xs,
    right: -theme.spacing.xs,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
});
