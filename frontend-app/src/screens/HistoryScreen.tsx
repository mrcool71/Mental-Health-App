import React, { useMemo } from "react";
import {
  SectionList,
  Text,
  View,
  type SectionListData,
  type SectionListRenderItemInfo,
} from "react-native";
import globalStyles from "../styles/global.styles";
import screenStyles from "../styles/screen.styles";
import MoodBadge from "../components/MoodBadge";
import { useStore } from "../store";
import { MoodEntry } from "../types/models";
import { BottomTabScreenProps } from "../types/navigation";
import type { HistorySection } from "../types/screens";
import { SCREEN_TITLES } from "../constants/screens";

const HistoryScreen: React.FC<BottomTabScreenProps<"History">> = () => {
  const { state } = useStore();

  const sections = useMemo(() => {
    const grouped: Record<string, MoodEntry[]> = {};
    state.history.forEach((entry) => {
      const dateKey = new Date(entry.timestamp).toDateString();
      grouped[dateKey] = grouped[dateKey]
        ? [...grouped[dateKey], entry]
        : [entry];
    });
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [state.history]);

  return (
    <View
      style={globalStyles.screen}
      accessible
      accessibilityLabel="History screen"
    >
      <Text style={globalStyles.heading}>{SCREEN_TITLES.history}</Text>
      <SectionList<MoodEntry, HistorySection>
        style={globalStyles.screen}
        contentContainerStyle={screenStyles.content}
        sections={sections}
        keyExtractor={(item: MoodEntry) => item.id}
        accessible
        accessibilityLabel="History list"
        ListEmptyComponent={() => (
          <View style={screenStyles.section}>
            <Text style={globalStyles.subheading}>{"No history yet"}</Text>
            <Text style={globalStyles.body}>
              {"Complete a quick check to start your timeline."}
            </Text>
          </View>
        )}
        renderSectionHeader={({
          section,
        }: {
          section: SectionListData<MoodEntry, HistorySection>;
        }) => (
          <View style={screenStyles.section}>
            <Text style={globalStyles.subheading}>{section.title}</Text>
          </View>
        )}
        renderItem={({
          item,
        }: SectionListRenderItemInfo<MoodEntry, HistorySection>) => (
          <View
            style={screenStyles.listItem}
            accessibilityLabel={`Mood ${item.mood}`}
          >
            <MoodBadge mood={item.mood} label={item.mood} />
            <Text style={screenStyles.listMeta}>
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default HistoryScreen;
