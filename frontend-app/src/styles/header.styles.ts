import { StyleSheet } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  container: {
    minHeight: theme.sizes.headerHeight,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  profileWrap: {
    width: theme.sizes.avatar,
    height: theme.sizes.avatar,
    borderRadius: theme.radii.pill,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.cardSoft,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: theme.sizes.avatar - 4,
    height: theme.sizes.avatar - 4,
    borderRadius: (theme.sizes.avatar - 4) / 2,
  },
  titleWrap: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    color: theme.colors.plum,
    fontFamily: theme.typography.fontFamilyDisplay,
  },
  bellWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: 2,
    top: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 11,
    color: "#fff",
  },
});
