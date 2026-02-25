import React, { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import globalStyles from "../styles/global.styles";
import screenStyles from "../styles/screen.styles";
import ThemedButton from "../components/ThemedButton";
import NotificationBanner from "../components/NotificationBanner";
import { useStore } from "../store";
import { Mood } from "../types/models";
import { RootStackScreenProps } from "../types/navigation";
import { quickCheckMoods } from "../constants/moods";
import { QUICK_CHECK_TIMEOUT_MS } from "../constants/quickCheck";
import { SCREEN_TITLES } from "../constants/screens";

const QuickCheckScreen: React.FC<RootStackScreenProps<"QuickCheck">> = ({
  navigation,
}) => {
  const { addEntry } = useStore();
  const [recentMood, setRecentMood] = useState<Mood | null>(null);

  const handleSelect = useCallback(
    (mood: Mood) => {
      const entry = {
        id: `${Date.now()}`,
        timestamp: Date.now(),
        mood,
      };
      addEntry(entry);
      setRecentMood(mood);
      setTimeout(
        () => navigation.navigate("Tabs", { screen: "History" }),
        QUICK_CHECK_TIMEOUT_MS,
      );
    },
    [addEntry, navigation],
  );

  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={screenStyles.content}
      accessible
      accessibilityLabel="Quick check screen"
    >
      <View style={screenStyles.hero}>
        <Text style={globalStyles.heading}>{SCREEN_TITLES.quickCheck}</Text>
        <Text style={globalStyles.body}>
          Pick the cat face that matches your mood right now.
        </Text>
      </View>

      {recentMood ? (
        <NotificationBanner
          message={`Saved mood: ${recentMood}`}
          type="success"
        />
      ) : null}

      <View style={screenStyles.section}>
        <Text style={globalStyles.subheading}>How are you feeling?</Text>
        <View style={screenStyles.moodGrid}>
          {quickCheckMoods.map((item) => (
            <ThemedButton
              key={item.mood}
              title={`${item.label} ${item.mood === "sad" ? "🙀" : "😺"}`}
              variant={item.variant}
              accessibilityLabel={`Select mood ${item.label}`}
              onPress={() => handleSelect(item.mood)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default QuickCheckScreen;
