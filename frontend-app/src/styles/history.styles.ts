import { StyleSheet } from "react-native";
import theme from "../theme/theme";

export default StyleSheet.create({
  // Header
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    gap: 2,
  },
  headerSub: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.muted,
  },

  // Filter chips — compact row
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  filterChip: {
    borderRadius: theme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipInactive: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.backgroundAlt,
  },
  filterChipText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: theme.colors.white,
  },
  filterChipTextInactive: {
    color: theme.colors.muted,
  },

  // List
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 80,
  },

  // Section headers
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  sectionHeaderText: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // Card item
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.sm,
    flexDirection: "row",
    overflow: "hidden",
    // Subtle shadow
    shadowColor: theme.colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  cardAccent: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  moodDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  moodEmoji: {
    fontSize: 15,
  },
  moodLabel: {
    flex: 1,
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textPrimary,
    textTransform: "capitalize",
  },
  timeText: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.muted,
  },

  // Energy
  energyRow: {
    flexDirection: "row",
    paddingLeft: 30 + theme.spacing.sm, // align with text after moodDot
  },
  energyPill: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  energyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamilyPrimary,
  },

  // Empty state
  emptyWrap: {
    alignItems: "center",
    marginTop: theme.spacing.xl * 2,
    gap: theme.spacing.sm,
  },
  emptyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.backgroundAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.h3,
    color: theme.colors.plum,
  },
  emptyBody: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.muted,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xl,
  },
});
