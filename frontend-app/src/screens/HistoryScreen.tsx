import React, { useMemo, useState } from "react";
import {
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type SectionListData,
  type SectionListRenderItemInfo,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MoodBadge from "../components/MoodBadge";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import screenStyles from "../styles/screen.styles";
import theme from "../theme/theme";
import { EnergyLevel, Mood, MoodEntry } from "../types/models";
import { BottomTabScreenProps } from "../types/navigation";
import { HistorySection } from "../types/screens";

const FILTER_OPTIONS: Array<{ label: string; value: Mood | "all" }> = [
  { label: "All", value: "all" },
  { label: "Happy", value: "happy" },
  { label: "Good", value: "good" },
  { label: "Okay", value: "okay" },
  { label: "Sad", value: "sad" },
];

const ENERGY_META: Record<EnergyLevel, { emoji: string; label: string }> = {
  high: { emoji: "⚡", label: "High Energy" },
  medium: { emoji: "✨", label: "Medium" },
  low: { emoji: "🌙", label: "Low Energy" },
};

const formatTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

const HistoryScreen: React.FC<BottomTabScreenProps<"History">> = () => {
  const { state } = useStore();
  const [filter, setFilter] = useState<Mood | "all">("all");

  const filteredHistory = useMemo<MoodEntry[]>(() => {
    if (filter === "all") {
      return state.history;
    }
    return state.history.filter((entry) => entry.mood === filter);
  }, [filter, state.history]);

  const sections = useMemo<HistorySection[]>(() => {
    const grouped: Record<string, MoodEntry[]> = {};

    filteredHistory.forEach((entry) => {
      const dateKey = new Date(entry.timestamp).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(entry);
    });

    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [filteredHistory]);

  return (
    <View style={globalStyles.screen} accessibilityLabel="History screen">
      <Text style={globalStyles.heading}>History</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterTabs}
        accessibilityLabel="History mood filters"
      >
        {FILTER_OPTIONS.map((item) => {
          const isActive = filter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              accessibilityRole="button"
              accessibilityLabel={`Filter ${item.label}`}
              style={[
                styles.filterPill,
                isActive ? styles.filterPillActive : styles.filterPillInactive,
              ]}
              onPress={() => setFilter(item.value)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  isActive
                    ? styles.filterPillTextActive
                    : styles.filterPillTextInactive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <SectionList<MoodEntry, HistorySection>
        style={styles.list}
        contentContainerStyle={styles.listContent}
        sections={sections}
        keyExtractor={(item: MoodEntry) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={screenStyles.section}>
            <Text style={globalStyles.subheading}>No history yet</Text>
            <Text style={globalStyles.body}>
              Complete a quick check to start your timeline.
            </Text>
          </View>
        )}
        renderSectionHeader={({
          section,
        }: {
          section: SectionListData<MoodEntry, HistorySection>;
        }) => (
          <View style={styles.sectionHeaderRow}>
            <MaterialIcons
              name="event"
              size={18}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          </View>
        )}
        renderItem={({
          item,
        }: SectionListRenderItemInfo<MoodEntry, HistorySection>) => (
          <View
            style={screenStyles.listItem}
            accessibilityLabel={`Mood ${item.mood} at ${formatTime(item.timestamp)}`}
          >
            <MoodBadge mood={item.mood} label={item.mood} />

            <View style={styles.itemMetaWrap}>
              <Text style={screenStyles.listMeta}>{formatTime(item.timestamp)}</Text>
              {item.energy ? (
                <View style={styles.energyPill}>
                  <Text style={styles.energyPillText}>
                    {ENERGY_META[item.energy].emoji} {ENERGY_META[item.energy].label}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterTabs: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  filterPill: {
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
  },
  filterPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterPillInactive: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.backgroundAlt,
  },
  filterPillText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
  },
  filterPillTextActive: {
    color: theme.colors.white,
  },
  filterPillTextInactive: {
    color: theme.colors.muted,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  sectionHeaderRow: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  sectionHeaderText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamilyPrimary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  itemMetaWrap: {
    alignItems: "flex-end",
    gap: theme.spacing.xs,
  },
  energyPill: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
  },
  energyPillText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
});

export default HistoryScreen;
