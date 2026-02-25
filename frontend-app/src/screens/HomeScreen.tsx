import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import globalStyles from "../styles/global.styles";
import screenStyles from "../styles/screen.styles";
import homeStyles from "../styles/home.styles";
import ProgressRing from "../components/ProgressRing";
import WellbeingPieChart from "../components/WellbeingPieChart";
import { useStore } from "../store";
import { BottomTabScreenProps } from "../types/navigation";
import { WELLBEING_MAX_SCORE } from "../constants/metrics";
import { APP_TITLE } from "../constants/app";
import { BOTTOM_TAB_BAR_APPROX_HEIGHT } from "../constants/layout";
import { moodEmoji } from "../constants/moods";
import { colors, spacing } from "../theme/theme";

// Home uses tokenized styles; see src/theme/theme.ts and src/styles/* for references.
const HomeScreen: React.FC<BottomTabScreenProps<"Home">> = ({ navigation }) => {
  const { state } = useStore();
  const insets = useSafeAreaInsets();
  const latest = state.history[0];

  const currentMood = latest?.mood;
  const currentEmoji = currentMood ? moodEmoji[currentMood] : "😺";

  const ctaBottomOffset = useMemo(
    () => spacing.md + insets.bottom + BOTTOM_TAB_BAR_APPROX_HEIGHT,
    [insets.bottom],
  );

  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={screenStyles.content}
      accessible
      accessibilityLabel="Home screen"
    >
      <View style={homeStyles.header}>
        <View
          style={homeStyles.headerLeft}
          accessible
          accessibilityLabel={`${APP_TITLE} home`}
        >
          <View>
            <Text style={homeStyles.appTitle}>{"Good Morning \nAniket !"}</Text>
          </View>
        </View>

        <View style={homeStyles.headerRight}>
          <Pressable
            style={homeStyles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Open history"
            onPress={() => navigation.navigate("History")}
          >
            <MaterialIcons
              name="schedule"
              size={20}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>
      </View>

      <View
        style={homeStyles.card}
        accessible
        accessibilityLabel="Current mood and wellbeing score"
      >
        <View style={homeStyles.mainCardTopRow}>
          <View>
            <Text style={homeStyles.smallLabel}>Current mood</Text>
            <Text style={globalStyles.body}>
              {currentMood
                ? `Feeling ${currentMood}`
                : "Ready for your first check-in"}
            </Text>
          </View>

          <View style={homeStyles.moodRow}>
            <Text style={homeStyles.moodEmoji}>{currentEmoji}</Text>
            <Text style={homeStyles.moodText}>{currentMood ?? ""}</Text>
          </View>
        </View>

        <View style={homeStyles.center}>
          <ProgressRing
            size={170}
            value={state.score}
            max={WELLBEING_MAX_SCORE}
            label="Wellbeing score"
            sublabel={`${state.score}/${WELLBEING_MAX_SCORE}`}
          />
        </View>

        <Text style={globalStyles.body}>
          {latest
            ? `Last check-in: ${new Date(latest.timestamp).toLocaleString()}`
            : "Tap Quick Check to start tracking your mood."}
        </Text>
      </View>

      <View
        style={homeStyles.card}
        accessible
        accessibilityLabel="Wellbeing pie chart"
      >
        <Text style={globalStyles.subheading}>Wellbeing breakdown</Text>
        <WellbeingPieChart entries={state.history} />
      </View>

      <View
        pointerEvents="box-none"
        style={[homeStyles.ctaContainer, { bottom: ctaBottomOffset }]}
      >
        <Pressable
          style={homeStyles.ctaButton}
          accessibilityRole="button"
          accessibilityLabel="Take a quick check"
          onPress={() => navigation.navigate("QuickCheck")}
        >
          <MaterialIcons name="add" size={22} color={colors.white} />
          <Text style={homeStyles.ctaText}>Quick Check</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
