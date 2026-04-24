import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ONBOARDING_SLIDES } from "../constants/onboarding";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import onboardingStyles from "../styles/onboarding.styles";
import theme from "../theme/theme";
import { RootStackScreenProps } from "../types/navigation";
import { hexToRgba } from "../utilities/color";
import ConsentModal from "../components/ConsentModal";
import { getCurrentUser } from "../services/auth";
import { syncProfile } from "../services/cloudSync";

const OnboardingScreen: React.FC<RootStackScreenProps<"Onboarding">> = ({
  navigation,
}) => {
  const { state, setOnboarded, giveConsent } = useStore();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showConsent, setShowConsent] = useState<boolean>(false);

  const dotWidths = useRef<Animated.Value[]>(
    ONBOARDING_SLIDES.map((_, index) => new Animated.Value(index === 0 ? 24 : 8)),
  ).current;

  useEffect(() => {
    if (state.hasOnboarded && !state.consentGiven) {
      setShowConsent(true);
    }
  }, [state.hasOnboarded, state.consentGiven]);

  useEffect(() => {
    Animated.parallel(
      dotWidths.map((dotWidth, index) =>
        Animated.timing(dotWidth, {
          toValue: index === currentIndex ? 24 : 8,
          duration: 220,
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, [currentIndex, dotWidths]);

  const slide = ONBOARDING_SLIDES[currentIndex];
  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;
  const inactiveDotColor = hexToRgba(theme.colors.muted, 0.3);

  const finishOnboarding = () => {
    setOnboarded();
    setShowConsent(true);
  };

  async function handleConsent() {
    const timestamp = Date.now();
    giveConsent(timestamp);
    setShowConsent(false);

    const user = getCurrentUser();
    if (user) {
      await syncProfile(user.uid, {
        hasOnboarded: true,
        consentGiven: true,
        consentTimestamp: timestamp,
      }).catch(() => undefined);
    }

    navigation.replace("Tabs", { screen: "Home" });
  }

  const handleNext = () => {
    if (isLastSlide) {
      finishOnboarding();
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <View style={globalStyles.screen}>
      <View
        style={[
          onboardingStyles.content,
          { paddingTop: Math.max(theme.spacing.lg, insets.top + theme.spacing.sm) },
        ]}
      >
        <View style={onboardingStyles.topBar}>
          {!isLastSlide ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding"
              style={onboardingStyles.skipButton}
              onPress={finishOnboarding}
            >
              <Text style={onboardingStyles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={onboardingStyles.hero}>
          <View style={globalStyles.mascotCircleLg}>
            <Text style={globalStyles.mascotEmojiLg}>{slide.icon}</Text>
          </View>
          <Text style={[globalStyles.heading, onboardingStyles.title]}>
            {slide.title}
          </Text>
          <Text style={[globalStyles.body, onboardingStyles.body]}>
            {slide.body}
          </Text>
        </View>

        <View style={onboardingStyles.footer}>
          <View style={onboardingStyles.dotsRow}>
            {dotWidths.map((dotWidth, index) => (
              <Animated.View
                key={ONBOARDING_SLIDES[index].id}
                style={[
                  onboardingStyles.dot,
                  {
                    width: dotWidth,
                    backgroundColor:
                      index === currentIndex
                        ? theme.colors.primary
                        : inactiveDotColor,
                  },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={isLastSlide ? "Get started" : "Go to next slide"}
            style={onboardingStyles.nextButton}
            onPress={handleNext}
          >
            <Text style={onboardingStyles.nextButtonText}>
              {isLastSlide ? "Get Started" : "Next ›"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ConsentModal visible={showConsent} onConsent={handleConsent} />
    </View>
  );
};

export default OnboardingScreen;
