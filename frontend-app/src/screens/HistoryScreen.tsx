import React, { useMemo } from "react";
import {
  SectionList,
  StyleSheet,
  Text,
  View,
  type SectionListData,
  type SectionListRenderItemInfo,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import globalStyles from "../styles/global.styles";
import screenStyles from "../styles/screen.styles";
import MoodBadge from "../components/MoodBadge";
import { useStore } from "../store";
import { MoodEntry, NotificationResponse } from "../types/models";
import { BottomTabScreenProps } from "../types/navigation";
import type { HistoryItem, UnifiedHistorySection } from "../types/screens";
import { SCREEN_TITLES } from "../constants/screens";
import theme from "../theme/theme";

// ─── Helper ─────────────────────────────────────────────────────────────────

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Sub-renderers ───────────────────────────────────────────────────────────

function MoodCard({ item }: { item: MoodEntry }) {
  return (
    <View style={screenStyles.listItem} accessibilityLabel={`Mood ${item.mood}`}>
      <MoodBadge mood={item.mood} label={item.mood} />
      <Text style={screenStyles.listMeta}>{formatTime(item.timestamp)}</Text>
    </View>
  );
}

function NotificationCard({ item }: { item: NotificationResponse }) {
  return (
    <View style={styles.notifCard} accessibilityLabel="Notification response">
      {/* header row */}
      <View style={styles.notifHeader}>
        <View style={styles.notifBadge}>
          <MaterialIcons
            name="notifications-active"
            size={14}
            color={theme.colors.primary}
          />
          <Text style={styles.notifBadgeText}>Check-in</Text>
        </View>
        <Text style={screenStyles.listMeta}>{formatTime(item.timestamp)}</Text>
      </View>

      {/* question */}
      <Text style={styles.notifQuestion}>{item.questionText}</Text>

      {/* answer chip */}
      <View style={styles.notifAnswerRow}>
        <MaterialIcons
          name="check-circle"
          size={16}
          color={theme.colors.success}
        />
        <Text style={styles.notifAnswer}>{item.optionText}</Text>
      </View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

const HistoryScreen: React.FC<BottomTabScreenProps<"History">> = () => {
  const { state } = useStore();

  /** Merge mood entries + notification responses, sort newest-first, group by date. */
  const sections = useMemo<UnifiedHistorySection[]>(() => {
    const moodItems: HistoryItem[] = state.history.map((d) => ({
      type: "mood" as const,
      data: d,
    }));
    const notifItems: HistoryItem[] = state.notificationResponses.map((d) => ({
      type: "notification" as const,
      data: d,
    }));

    const all = [...moodItems, ...notifItems].sort(
      (a, b) => b.data.timestamp - a.data.timestamp,
    );

    const grouped: Record<string, HistoryItem[]> = {};
    all.forEach((item) => {
      const key = new Date(item.data.timestamp).toDateString();
      grouped[key] = grouped[key] ? [...grouped[key], item] : [item];
    });

    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [state.history, state.notificationResponses]);

  return (
    <View
      style={globalStyles.screen}
      accessible
      accessibilityLabel="History screen"
    >
      <Text style={globalStyles.heading}>{SCREEN_TITLES.history}</Text>

      <SectionList<HistoryItem, UnifiedHistorySection>
        style={globalStyles.screen}
        contentContainerStyle={screenStyles.content}
        sections={sections}
        keyExtractor={(item) => item.data.id}
        showsVerticalScrollIndicator={false}
        accessible
        accessibilityLabel="History list"
        ListEmptyComponent={() => (
          <View style={screenStyles.section}>
            <Text style={globalStyles.subheading}>{"No history yet"}</Text>
            <Text style={globalStyles.body}>
              {"Complete a quick check or answer a notification to start your timeline."}
            </Text>
          </View>
        )}
        renderSectionHeader={({
          section,
        }: {
          section: SectionListData<HistoryItem, UnifiedHistorySection>;
        }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          </View>
        )}
        renderItem={({
          item,
        }: SectionListRenderItemInfo<HistoryItem, UnifiedHistorySection>) =>
          item.type === "mood" ? (
            <MoodCard item={item.data as MoodEntry} />
          ) : (
            <NotificationCard item={item.data as NotificationResponse} />
          )
        }
      />
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  sectionHeaderText: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  // Notification response card
  notifCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  notifHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notifBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
  },
  notifBadgeText: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.primary,
  },
  notifQuestion: {
    fontFamily: theme.typography.fontFamilyDisplay,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.plum,
    lineHeight: 22,
  },
  notifAnswerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  notifAnswer: {
    fontFamily: theme.typography.fontFamilyPrimary,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.success,
    fontWeight: "600",
  },
});

export default HistoryScreen;

