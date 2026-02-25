import { StyleSheet } from "react-native";
import theme from "../theme/theme";

// Avatar + mascot strip styles, tokenized via src/theme/theme.ts.
export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.backgroundAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  avatarText: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.h2,
    color: theme.colors.textPrimary,
  },
  info: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  name: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.h2,
    color: theme.colors.textPrimary,
  },
  mood: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
  },
});
