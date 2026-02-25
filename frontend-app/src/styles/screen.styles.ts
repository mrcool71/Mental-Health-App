import { StyleSheet } from "react-native";
import theme from "../theme/theme";

// Screen-level styles shared across views; tokens sourced from src/theme/theme.ts.
export default StyleSheet.create({
  hero: {
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  heroEmoji: {
    fontSize: theme.typography.sizes.h1,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  content: {
    paddingBottom: theme.spacing.xl * 3,
    gap: theme.spacing.md,
  },
  section: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  listItem: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  listMeta: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  spacer: {
    height: theme.spacing.md,
  },
});
