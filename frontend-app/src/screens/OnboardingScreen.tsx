import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { ONBOARDING_SLIDES } from "../constants/onboarding";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import onboardingStyles from "../styles/onboarding.styles";
import theme from "../theme/theme";
import { RootStackScreenProps } from "../types/navigation";

const hexToRgba = (hex: string, alpha: number): string => {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const OnboardingScreen: React.FC<RootStackScreenProps<"Onboarding">> = ({
  navigation,
}) => {
  const { setOnboarded } = useStore();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const dotWidths = useRef<Animated.Value[]>(
    ONBOARDING_SLIDES.map((_, index) => new Animated.Value(index === 0 ? 24 : 8)),
  ).current;

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
    navigation.reset({
      index: 0,
      routes: [{ name: "Tabs" }],
    });
  };

  const handleNext = () => {
    if (isLastSlide) {
      finishOnboarding();
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <View style={onboardingStyles.screen}>
      <View style={onboardingStyles.content}>
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
          <View style={onboardingStyles.mascotCircle}>
            <Text style={onboardingStyles.mascotEmoji}>{slide.icon}</Text>
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
    </View>
  );
};

export default OnboardingScreen;
