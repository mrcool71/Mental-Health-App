import { Dimensions, StyleSheet } from "react-native";
import theme from "../theme/theme";

const screenWidth = Dimensions.get("window").width;
export const moodCardWidth =
  (screenWidth - theme.spacing.lg * 2 - theme.spacing.sm) / 2;

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.backgroundAlt,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
  stepWrap: {
    flex: 1,
    gap: theme.spacing.md,
  },
  title: {
    color: theme.colors.textPrimary,
    lineHeight: 34,
  },
  subtitle: {
    color: theme.colors.textSecondary,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  moodCard: {
    width: moodCardWidth,
    borderRadius: theme.radii.lg,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
  },
  happyCard: {
    backgroundColor: theme.colors.moodHappy,
  },
  goodCard: {
    backgroundColor: theme.colors.moodGood,
  },
  okayCard: {
    backgroundColor: theme.colors.moodOkay,
  },
  sadCard: {
    backgroundColor: theme.colors.moodSad,
  },
  moodEmoji: {
    fontSize: 36,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  backButton: {
    alignSelf: "flex-start",
    minHeight: theme.touch.minSize,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xs,
  },
  backText: {
    fontSize: theme.typography.sizes.h2,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyDisplay,
  },
  energyOptions: {
    gap: theme.spacing.sm,
  },
  energyOption: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.backgroundAlt,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  energyOptionSelected: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  energyEmoji: {
    fontSize: 24,
  },
  energyLabel: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
  },
  successWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  mascotCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.cardSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotEmoji: {
    fontSize: 56,
  },
  successTitle: {
    textAlign: "center",
  },
  successSubtitle: {
    textAlign: "center",
    color: theme.colors.textSecondary,
  },
  infoBox: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
  },
  infoText: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  primaryButton: {
    borderRadius: theme.radii.pill,
    minHeight: 50,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.body,
    fontWeight: "600",
  },
  ghostLink: {
    minHeight: theme.touch.minSize,
    justifyContent: "center",
  },
  ghostLinkText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
  },
});
