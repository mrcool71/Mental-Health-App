import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MoodBadge from "../components/MoodBadge";
import ScreenScrollView from "../components/ScreenScrollView";
import { MOTIVATIONAL_QUOTES } from "../constants/app";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import homeStyles from "../styles/home.styles";
import { BottomTabScreenProps } from "../types/navigation";
import { formatTime } from "../utilities";

const getGreetingByHour = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour <= 11) return "morning";
  if (hour >= 12 && hour <= 17) return "afternoon";
  return "evening";
};

const HomeScreen: React.FC<BottomTabScreenProps<"Home">> = ({ navigation }) => {
  const { state } = useStore();
  const latestEntry = state.history[0];

  const greetingText = useMemo<string>(() => {
    const period = getGreetingByHour();
    return `Good ${period}`;
  }, []);

  const randomQuote = useMemo<string>(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[randomIndex];
  }, []);

  return (
    <ScreenScrollView accessibilityLabel="Home screen">
      <View style={homeStyles.greetingRow}>
        <View style={homeStyles.greetingTextWrap}>
          <Text style={homeStyles.greetingTitle}>{greetingText}</Text>
          <Text style={[globalStyles.body, homeStyles.greetingSubtitle]}>
            How are you feeling today?
          </Text>
        </View>
        <View style={globalStyles.mascotCircleSm}>
          <Text style={globalStyles.mascotEmojiSm}>{"\uD83D\uDE3A"}</Text>
        </View>
      </View>

      <View style={homeStyles.quoteCard}>
        <Text style={homeStyles.quoteText}>{randomQuote}</Text>
        <View style={homeStyles.quoteDash} />
      </View>

      <View style={homeStyles.checkinCard}>
        <Text style={homeStyles.checkinTitle}>Ready for a PHQ-9 check-in?</Text>
        <Text style={[globalStyles.body, homeStyles.checkinSubtitle]}>
          Takes about 1 to 2 minutes. Answer 9 questions to log your recent
          wellbeing.
        </Text>

        <View style={homeStyles.catStrip}>
          <View style={homeStyles.catStripRow}>
            <Text style={homeStyles.catStripEmoji}>0-3 scale</Text>
          </View>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Start PHQ-9 check-in"
          style={homeStyles.checkinButton}
          onPress={() => navigation.navigate("QuickCheck")}
        >
          <Text style={homeStyles.checkinButtonText}>Start PHQ-9</Text>
        </TouchableOpacity>
      </View>

      {latestEntry ? (
        <View style={homeStyles.latestRow}>
          <View>
            <Text style={homeStyles.latestLabel}>Last assessment</Text>
            <MoodBadge mood={latestEntry.mood} label={latestEntry.mood} />
          </View>

          <View style={homeStyles.latestMeta}>
            <Text style={homeStyles.latestTime}>
              {formatTime(latestEntry.timestamp)}
            </Text>
          </View>
        </View>
      ) : null}
    </ScreenScrollView>
  );
};

export default HomeScreen;
