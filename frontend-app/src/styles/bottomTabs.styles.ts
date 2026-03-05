import { StyleSheet, Platform } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.backgroundAlt,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.black,
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: -4 },
        shadowRadius: 8,
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
    gap: 3,
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: 10,
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
