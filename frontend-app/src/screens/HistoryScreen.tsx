import React, { useMemo, useState } from "react";
import {
  SectionList,
  Text,
  TouchableOpacity,
  View,
  type SectionListData,
  type SectionListRenderItemInfo,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HISTORY_FILTER_OPTIONS, ENERGY_LEVELS } from "../constants/history";
import { MOOD_COLORS, moodEmoji } from "../constants/moods";
import { TAB_BAR_HEIGHT } from "../constants/navigation";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import styles from "../styles/history.styles";
import theme from "../theme/theme";
import { Mood, MoodEntry } from "../types/models";
import { BottomTabScreenProps } from "../types/navigation";
import { HistorySection } from "../types/screens";
import { formatTime } from "../utilities";

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

  const insets = useSafeAreaInsets();
  const listBottomPad = TAB_BAR_HEIGHT + insets.bottom + theme.spacing.md;

  return (
    <View style={globalStyles.screen} accessibilityLabel="History screen">
      {/* Header */}
      <View style={styles.header}>
        <Text style={globalStyles.heading}>History</Text>
        <Text style={styles.headerSub}>
          {state.history.length} {state.history.length === 1 ? "entry" : "entries"}
        </Text>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {HISTORY_FILTER_OPTIONS.map((item) => {
          const isActive = filter === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              accessibilityRole="button"
              accessibilityLabel={`Filter ${item.label}`}
              style={[
                styles.filterChip,
                isActive ? styles.filterChipActive : styles.filterChipInactive,
              ]}
              onPress={() => setFilter(item.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive
                    ? styles.filterChipTextActive
                    : styles.filterChipTextInactive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Timeline list */}
      <SectionList<MoodEntry, HistorySection>
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: listBottomPad }]}
        sections={sections}
        keyExtractor={(item: MoodEntry) => item.id}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyCircle}>
              <MaterialIcons name="history" size={32} color={theme.colors.muted} />
            </View>
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptyBody}>
              Complete a PHQ-9 check-in to start your timeline.
            </Text>
          </View>
        )}
        renderSectionHeader={({
          section,
        }: {
          section: SectionListData<MoodEntry, HistorySection>;
        }) => (
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          </View>
        )}
        renderItem={({
          item,
        }: SectionListRenderItemInfo<MoodEntry, HistorySection>) => (
          <View
            style={styles.card}
            accessibilityLabel={`Mood ${item.mood} at ${formatTime(item.timestamp)}`}
          >
            {/* Accent bar on the left */}
            <View style={[styles.cardAccent, { backgroundColor: MOOD_COLORS[item.mood] }]} />

            <View style={styles.cardContent}>
              {/* Top row: emoji + mood + time */}
              <View style={styles.cardTopRow}>
                <View style={[styles.moodDot, { backgroundColor: MOOD_COLORS[item.mood] + "20" }]}>
                  <Text style={styles.moodEmoji}>{moodEmoji[item.mood]}</Text>
                </View>
                <Text style={styles.moodLabel}>{item.mood}</Text>
                <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
              </View>

              {/* Energy pill if present */}
              {item.energy ? (
                <View style={styles.energyRow}>
                  <View style={styles.energyPill}>
                    <Text style={styles.energyText}>
                      {ENERGY_LEVELS[item.energy].emoji}{"  "}{ENERGY_LEVELS[item.energy].label}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default HistoryScreen;
