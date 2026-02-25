import { StyleSheet } from "react-native";
import { colors, spacing, radii, typography, touch } from "../theme/theme";

// Common header styles; consistent tokens from src/theme/theme.ts.
export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.h1,
    fontFamily: typography.fontFamilyDisplay,
    color: colors.textPrimary,
    flex: 1,
  },
  placeholder: {
    flex: 1,
  },
  profileButton: {
    width: touch.minSize,
    height: touch.minSize,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
});
