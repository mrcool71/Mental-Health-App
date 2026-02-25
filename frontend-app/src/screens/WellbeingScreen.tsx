import React from "react";
import { ScrollView, Text, View } from "react-native";
import globalStyles from "../styles/global.styles";
import screenStyles from "../styles/screen.styles";
import ProgressRing from "../components/ProgressRing";
import ThemedButton from "../components/ThemedButton";
import { useStore } from "../store";
import { BottomTabScreenProps } from "../types/navigation";
import { WELLBEING_MAX_SCORE } from "../constants/metrics";
import { SCREEN_TITLES } from "../constants/screens";

// Wellbeing summary view; progress ring and quick actions.
const WellbeingScreen: React.FC<BottomTabScreenProps<"Wellbeing">> = ({
  navigation,
}) => {
  const { state } = useStore();
  const latest = state.history[0];

  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={screenStyles.content}
      accessible
      accessibilityLabel="Wellbeing screen"
    >
      <View style={screenStyles.hero}>
        <Text style={globalStyles.heading}>{SCREEN_TITLES.wellbeing}</Text>
        <Text style={globalStyles.body}>
          A gentle snapshot of how you have been feeling.
        </Text>
      </View>

      <View style={screenStyles.section}>
        <ProgressRing
          value={state.score}
          max={WELLBEING_MAX_SCORE}
          label="Mood score"
          sublabel={latest ? `Latest: ${latest.mood}` : "No check-ins yet"}
        />
      </View>

      <View style={screenStyles.section}>
        <Text style={globalStyles.subheading}>Recent</Text>
        <Text style={globalStyles.body}>
          {latest
            ? `Most recent feeling: ${latest.mood}`
            : "Complete a quick check to see recent mood insights."}
        </Text>
      </View>

      <View style={screenStyles.section}>
        <ThemedButton
          title="Take another check"
          onPress={() => navigation.navigate("QuickCheck")}
          accessibilityLabel="Start another quick check"
          variant="primary"
        />
      </View>
    </ScrollView>
  );
};

export default WellbeingScreen;
