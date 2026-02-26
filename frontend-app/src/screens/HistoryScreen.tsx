import React, { useMemo, useState } from "react";
import {
  ScrollView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
  type SectionListData,
  type SectionListRenderItemInfo,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MoodBadge from "../components/MoodBadge";
import { HISTORY_FILTER_OPTIONS, ENERGY_META } from "../constants/history";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import styles from "../styles/history.styles";
import screenStyles from "../styles/screen.styles";
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

  return (
    <View style={globalStyles.screen} accessibilityLabel="History screen">
      <Text style={globalStyles.heading}>History</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterTabs}
        accessibilityLabel="History mood filters"
      >
        {HISTORY_FILTER_OPTIONS.map((item) => {
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
              <Text style={screenStyles.listMeta}>
                {formatTime(item.timestamp)}
              </Text>
              {item.energy ? (
                <View style={styles.energyPill}>
                  <Text style={styles.energyPillText}>
                    {ENERGY_META[item.energy].emoji}{" "}
                    {ENERGY_META[item.energy].label}
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

export default HistoryScreen;
