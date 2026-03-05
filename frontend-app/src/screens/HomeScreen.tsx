import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MoodBadge from "../components/MoodBadge";
import ScreenScrollView from "../components/ScreenScrollView";
import { MOTIVATIONAL_QUOTES } from "../constants/app";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import homeStyles from "../styles/home.styles";
import { BottomTabScreenProps } from "../types/navigation";
import { getGreetingByHour, formatTime } from "../utilities";

const HomeScreen: React.FC<BottomTabScreenProps<"Home">> = ({ navigation }) => {
  const { state } = useStore();
  const latestEntry = state.history[0];

  const greetingText = useMemo<string>(() => {
    const period = getGreetingByHour();
    return `Good ${period}! 👋`;
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
          <Text style={globalStyles.mascotEmojiSm}>😺</Text>
        </View>
      </View>

      <View style={homeStyles.quoteCard}>
        <Text style={homeStyles.quoteText}>{randomQuote}</Text>
        <View style={homeStyles.quoteDash} />
      </View>

      <View style={homeStyles.checkinCard}>
        <Text style={homeStyles.checkinTitle}>
          {"Ready for a quick\ncheck-in? 🐾"}
        </Text>
        <Text style={[globalStyles.body, homeStyles.checkinSubtitle]}>
          Take 30 seconds to log how you're feeling right now
        </Text>

        <View style={homeStyles.catStrip}>
          <View style={homeStyles.catStripRow}>
            <Text style={homeStyles.catStripEmoji}>😺</Text>
            <Text style={homeStyles.catStripEmoji}>😸</Text>
            <Text style={homeStyles.catStripEmoji}>🐱</Text>
          </View>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Take quick check"
          style={homeStyles.checkinButton}
          onPress={() => navigation.navigate("QuickCheck")}
        >
          <Text style={homeStyles.checkinButtonText}>Take Quick Check ♡</Text>
        </TouchableOpacity>
      </View>

      {latestEntry ? (
        <View style={homeStyles.latestRow}>
          <View>
            <Text style={homeStyles.latestLabel}>Last check-in</Text>
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
