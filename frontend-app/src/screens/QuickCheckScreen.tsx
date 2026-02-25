import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moodEmoji, quickCheckMoods } from "../constants/moods";
import {
  ENERGY_OPTIONS,
  QUICK_CHECK_TIMEOUT_MS,
} from "../constants/quickCheck";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import quickCheckStyles from "../styles/quickCheck.styles";
import { EnergyLevel, Mood, MoodEntry } from "../types/models";
import { RootStackScreenProps } from "../types/navigation";

const QuickCheckScreen: React.FC<RootStackScreenProps<"QuickCheck">> = ({
  navigation,
}) => {
  const { addEntry } = useStore();
  const [step, setStep] = useState<number>(0);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedEnergy, setSelectedEnergy] =
    useState<EnergyLevel | null>(null);

  const progressAnim = useRef<Animated.Value>(new Animated.Value(1 / 3)).current;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSavedRef = useRef<boolean>(false);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (step + 1) / 3,
      duration: 240,
      useNativeDriver: false,
    }).start();
  }, [progressAnim, step]);

  useEffect(() => {
    if (step === 2 && selectedMood && selectedEnergy && !hasSavedRef.current) {
      const entry: MoodEntry = {
        id: `${Date.now()}`,
        timestamp: Date.now(),
        mood: selectedMood,
        energy: selectedEnergy,
      };
      addEntry(entry);
      hasSavedRef.current = true;

      saveTimerRef.current = setTimeout(() => {
        hasSavedRef.current = false;
        saveTimerRef.current = null;
      }, QUICK_CHECK_TIMEOUT_MS);
    }

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [addEntry, selectedEnergy, selectedMood, step]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setStep(1);
  };

  const handleEnergySelect = (energy: EnergyLevel) => {
    setSelectedEnergy(energy);
    setStep(2);
  };

  return (
    <ScrollView
      style={quickCheckStyles.screen}
      contentContainerStyle={quickCheckStyles.content}
      showsVerticalScrollIndicator={false}
      accessibilityLabel="Quick check screen"
    >
      <View style={quickCheckStyles.progressTrack}>
        <Animated.View
          style={[quickCheckStyles.progressFill, { width: progressWidth }]}
        />
      </View>

      {step === 0 ? (
        <View style={quickCheckStyles.stepWrap}>
          <Text style={[globalStyles.heading, quickCheckStyles.title]}>
            {"How are you feeling\nright now?"}
          </Text>
          <Text style={[globalStyles.body, quickCheckStyles.subtitle]}>
            Tap your mood to continue 🐾
          </Text>

          <View style={quickCheckStyles.moodGrid}>
            {quickCheckMoods.map((item) => (
              <TouchableOpacity
                key={item.mood}
                accessibilityRole="button"
                accessibilityLabel={`Select mood ${item.label}`}
                style={[
                  quickCheckStyles.moodCard,
                  item.mood === "happy"
                    ? quickCheckStyles.happyCard
                    : item.mood === "good"
                      ? quickCheckStyles.goodCard
                      : item.mood === "okay"
                        ? quickCheckStyles.okayCard
                        : quickCheckStyles.sadCard,
                ]}
                onPress={() => handleMoodSelect(item.mood)}
              >
                <Text style={quickCheckStyles.moodEmoji}>{moodEmoji[item.mood]}</Text>
                <Text style={quickCheckStyles.moodLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}

      {step === 1 ? (
        <View style={quickCheckStyles.stepWrap}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back to mood selection"
            style={quickCheckStyles.backButton}
            onPress={() => setStep(0)}
          >
            <Text style={quickCheckStyles.backText}>←</Text>
          </TouchableOpacity>

          <Text style={[globalStyles.heading, quickCheckStyles.title]}>
            How's your energy level?
          </Text>

          <View style={quickCheckStyles.energyOptions}>
            {ENERGY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.level}
                accessibilityRole="button"
                accessibilityLabel={`Select ${option.label}`}
                style={[
                  quickCheckStyles.energyOption,
                  selectedEnergy === option.level
                    ? quickCheckStyles.energyOptionSelected
                    : null,
                ]}
                onPress={() => handleEnergySelect(option.level)}
              >
                <Text style={quickCheckStyles.energyEmoji}>{option.emoji}</Text>
                <Text style={quickCheckStyles.energyLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}

      {step === 2 ? (
        <View style={quickCheckStyles.successWrap}>
          <View style={quickCheckStyles.mascotCircle}>
            <Text style={quickCheckStyles.mascotEmoji}>😺</Text>
          </View>

          <Text style={[globalStyles.heading, quickCheckStyles.successTitle]}>
            Thanks — logged! ✨
          </Text>
          <Text style={[globalStyles.body, quickCheckStyles.successSubtitle]}>
            Here's a tiny cat hug 😸
          </Text>

          <View style={quickCheckStyles.infoBox}>
            <Text style={[globalStyles.body, quickCheckStyles.infoText]}>
              Your check-in has been saved. Keep it up! Every check-in helps us
              understand your wellbeing better.
            </Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="View history"
            style={quickCheckStyles.primaryButton}
            onPress={() => navigation.navigate("Tabs", { screen: "History" })}
          >
            <Text style={quickCheckStyles.primaryButtonText}>View History ✓</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Back to home"
            style={quickCheckStyles.ghostLink}
            onPress={() => navigation.navigate("Tabs", { screen: "Home" })}
          >
            <Text style={quickCheckStyles.ghostLinkText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default QuickCheckScreen;
