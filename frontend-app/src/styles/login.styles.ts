import { StyleSheet } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: "center",
    gap: theme.spacing.lg,
  },
  hero: {
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  mascot: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.cardSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  mascotEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: theme.typography.sizes.h1,
    fontFamily: theme.typography.fontFamilyDisplay,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.backgroundAlt,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
  },
  primaryButton: {
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.primary,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.body,
    fontWeight: "600",
  },
  secondaryButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.body,
    fontWeight: "600",
  },
  errorText: {
    color: theme.colors.danger,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.small,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
});
