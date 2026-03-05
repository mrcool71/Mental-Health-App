import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import ProgressBar from "../components/ProgressBar";
import ScreenScrollView from "../components/ScreenScrollView";
import { PHQ9_MAX_SCORE, PHQ9_OPTIONS, PHQ9_QUESTIONS } from "../constants/phq9";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import quickCheckStyles from "../styles/quickCheck.styles";
import type { MoodEntry, Phq9Assessment } from "../types/models";
import { RootStackScreenProps } from "../types/navigation";
import {
  getPhq9Severity,
  getPhq9SeverityLabel,
  mapPhq9ScoreToEnergy,
  mapPhq9ScoreToMood,
} from "../utilities";

const QuickCheckScreen: React.FC<RootStackScreenProps<"QuickCheck">> = ({
  navigation,
}) => {
  const { addEntry, addPhq9Assessment } = useStore();
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Array<number | null>>(
    Array(PHQ9_QUESTIONS.length).fill(null),
  );
  const [completedAssessment, setCompletedAssessment] =
    useState<Phq9Assessment | null>(null);
  const isSubmittingRef = useRef<boolean>(false);

  const progressAnim = useRef<Animated.Value>(
    new Animated.Value(1 / PHQ9_QUESTIONS.length),
  ).current;

  const currentQuestion = PHQ9_QUESTIONS[questionIndex];
  const selectedScore = answers[questionIndex];

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: completedAssessment
        ? 1
        : (questionIndex + 1) / PHQ9_QUESTIONS.length,
      duration: 240,
      useNativeDriver: false,
    }).start();
  }, [completedAssessment, progressAnim, questionIndex]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const severitySummary = useMemo(() => {
    if (!completedAssessment) return null;

    const label = getPhq9SeverityLabel(completedAssessment.severity);
    if (completedAssessment.score <= 4) {
      return `${label} range. Keep checking in with your routines.`;
    }
    if (completedAssessment.score <= 9) {
      return `${label} range. A small reset plan can help this week.`;
    }
    if (completedAssessment.score <= 14) {
      return `${label} range. Consider adding support from someone you trust.`;
    }
    if (completedAssessment.score <= 19) {
      return `${label} range. Reaching out to a professional can help.`;
    }
    return `${label} range. Please seek support as soon as possible.`;
  }, [completedAssessment]);

  const finalizeAssessment = (nextAnswers: Array<number | null>) => {
    const now = Date.now();
    const completeAnswers = nextAnswers.map((answer) => answer ?? 0);
    const score = completeAnswers.reduce((sum, answer) => sum + answer, 0);
    const severity = getPhq9Severity(score);

    const assessment: Phq9Assessment = {
      id: `phq9-${now}`,
      timestamp: now,
      answers: completeAnswers,
      score,
      severity,
    };

    const entry: MoodEntry = {
      id: `mood-${now}`,
      timestamp: now,
      mood: mapPhq9ScoreToMood(score),
      energy: mapPhq9ScoreToEnergy(score),
      note: `PHQ-9 ${score}/${PHQ9_MAX_SCORE} (${getPhq9SeverityLabel(severity)})`,
    };

    addPhq9Assessment(assessment);
    addEntry(entry);
    setCompletedAssessment(assessment);
  };

  const handleAnswer = (score: number) => {
    if (isSubmittingRef.current || completedAssessment) {
      return;
    }

    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = score;
    setAnswers(nextAnswers);

    if (questionIndex < PHQ9_QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1);
      return;
    }

    isSubmittingRef.current = true;
    finalizeAssessment(nextAnswers);
  };

  const handleBack = () => {
    if (completedAssessment) {
      navigation.navigate("Tabs", { screen: "Home" });
      return;
    }

    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      return;
    }

    navigation.goBack();
  };

  return (
    <ScreenScrollView
      accessibilityLabel="PHQ-9 check-in screen"
      contentContainerStyle={quickCheckStyles.content}
    >
      <ProgressBar animatedWidth={progressWidth} />

      {!completedAssessment ? (
        <View style={quickCheckStyles.stepWrap}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={quickCheckStyles.backButton}
            onPress={handleBack}
          >
            <Text style={quickCheckStyles.backText}>{"<"}</Text>
          </TouchableOpacity>

          <Text style={[globalStyles.heading, quickCheckStyles.title]}>
            PHQ-9 Check-In
          </Text>
          <Text style={[globalStyles.body, quickCheckStyles.subtitle]}>
            Question {questionIndex + 1} of {PHQ9_QUESTIONS.length}
          </Text>

          <View style={quickCheckStyles.questionCard}>
            <Text style={quickCheckStyles.questionLabel}>
              Over the last 2 weeks, how often have you been bothered by:
            </Text>
            <Text style={quickCheckStyles.questionText}>
              {currentQuestion.prompt}
            </Text>
          </View>

          <View style={quickCheckStyles.optionList}>
            {PHQ9_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.score}
                accessibilityRole="button"
                accessibilityLabel={`Select ${option.label}`}
                disabled={isSubmittingRef.current}
                style={[
                  quickCheckStyles.optionButton,
                  selectedScore === option.score
                    ? quickCheckStyles.optionButtonSelected
                    : null,
                ]}
                onPress={() => handleAnswer(option.score)}
              >
                <View style={quickCheckStyles.optionBadge}>
                  <Text style={quickCheckStyles.optionBadgeText}>
                    {option.score}
                  </Text>
                </View>
                <Text style={quickCheckStyles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={quickCheckStyles.scaleHint}>
            StudentLife used PHQ-9 with a 0 to 3 scale (not at all to nearly
            every day).
          </Text>
        </View>
      ) : null}

      {completedAssessment ? (
        <View style={quickCheckStyles.successWrap}>
          <View style={globalStyles.mascotCircleLg}>
            <Text style={globalStyles.mascotEmojiLg}>{"\uD83D\uDE3A"}</Text>
          </View>

          <Text style={[globalStyles.heading, quickCheckStyles.successTitle]}>
            PHQ-9 Complete
          </Text>
          <Text style={[globalStyles.body, quickCheckStyles.successSubtitle]}>
            Score {completedAssessment.score}/{PHQ9_MAX_SCORE} |{" "}
            {getPhq9SeverityLabel(completedAssessment.severity)}
          </Text>

          <View style={quickCheckStyles.infoBox}>
            <Text style={[globalStyles.body, quickCheckStyles.infoText]}>
              {severitySummary}
            </Text>
          </View>

          {(completedAssessment.answers[8] ?? 0) > 0 ? (
            <View style={quickCheckStyles.alertBox}>
              <Text style={quickCheckStyles.alertText}>
                If you may hurt yourself or feel unsafe, contact local
                emergency services right now.
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="View wellbeing score"
            style={quickCheckStyles.primaryButton}
            onPress={() => navigation.navigate("Tabs", { screen: "Wellbeing" })}
          >
            <Text style={quickCheckStyles.primaryButtonText}>
              View Wellbeing
            </Text>
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
    </ScreenScrollView>
  );
};

export default QuickCheckScreen;
