import { StyleSheet, Platform } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  appAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.backgroundAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  appAvatarText: {
    fontSize: 18,
  },
  appTitle: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.h1,
    color: theme.colors.textPrimary,
  },
  hero: {
    fontSize: 32, // or theme.typography.sizes.h1 + 4
    fontFamily: theme.typography.fontFamilyDisplay,
    color: theme.colors.plum,
    // fontWeight: "700",
    marginBottom: theme.spacing.md,
    lineHeight: 40,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  iconButton: {
    minWidth: theme.touch.minSize,
    minHeight: theme.touch.minSize,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.backgroundAlt,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.black,
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },

  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.black,
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 14,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },

  mainCardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  smallLabel: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
  },
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  moodEmoji: {
    fontSize: 18,
  },
  moodText: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textPrimary,
    textTransform: "capitalize",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  ctaContainer: {
    position: "absolute",
    left: theme.spacing.lg,
    right: theme.spacing.lg,
  },
  ctaButton: {
    minHeight: theme.touch.minSize,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.black,
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  ctaText: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.h3,
    color: theme.colors.white,
  },
});
