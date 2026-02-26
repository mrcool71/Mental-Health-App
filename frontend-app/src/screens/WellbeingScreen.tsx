import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import ProgressRing from "../components/ProgressRing";
import { WELLBEING_MAX_SCORE } from "../constants/metrics";
import { moodScores } from "../constants/store";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import styles from "../styles/wellbeing.styles";
import theme from "../theme/theme";
import { BottomTabScreenProps } from "../types/navigation";
import type { BreakdownStat } from "../types/wellbeing";
import { getScoreLabel } from "../utilities";

const WellbeingScreen: React.FC<BottomTabScreenProps<"Wellbeing">> = () => {
  const { state } = useStore();

  const moodScore = useMemo<number>(() => {
    if (!state.history.length) return state.score;
    const total = state.history.reduce(
      (sum, entry) => sum + moodScores[entry.mood],
      0,
    );
    return Math.round(total / state.history.length);
  }, [state.history, state.score]);

  const scoreLabel = useMemo<string>(
    () => getScoreLabel(state.score),
    [state.score],
  );

  const stats = useMemo<BreakdownStat[]>(
    () => [
      { label: "Mood", value: moodScore, color: theme.colors.primary },
      { label: "Energy", value: 75, color: theme.colors.accent },
      { label: "Sleep", value: 85, color: theme.colors.lilac },
      { label: "Social", value: 70, color: theme.colors.danger },
    ],
    [moodScore],
  );

  const tips = useMemo<string[]>(() => {
    if (state.score >= 90) {
      return [];
    }

    if (state.score < 50) {
      return [
        "Try a 5-minute breathing exercise",
        "Reach out to someone you trust",
      ];
    }

    if (state.score < 70) {
      return [
        "A short walk can lift your mood",
        "Try logging your feelings daily",
      ];
    }

    return [
      "Connect with friends or family this week",
      "You're doing great! Keep up your healthy habits",
    ];
  }, [state.score]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      accessibilityLabel="Wellbeing score screen"
    >
      <View style={styles.titleRow}>
        <Text style={globalStyles.heading}>Wellbeing Score</Text>
        <View style={styles.titleMascot}>
          <Text style={styles.titleMascotText}>😺</Text>
        </View>
      </View>

      <View style={styles.ringCard}>
        <ProgressRing
          size={180}
          value={state.score}
          max={WELLBEING_MAX_SCORE}
          label="Wellbeing"
          sublabel={`${state.score}/${WELLBEING_MAX_SCORE}`}
        />
        <Text style={styles.scoreLabel}>{scoreLabel}</Text>
      </View>

      <View>
        <Text style={globalStyles.sectionHeader}>Score Breakdown</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value} /100</Text>
              <View style={styles.statTrack}>
                <View
                  style={[
                    styles.statFill,
                    {
                      width: `${Math.max(0, Math.min(stat.value, 100))}%`,
                      backgroundColor: stat.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {tips.length ? (
        <View>
          <Text style={globalStyles.sectionHeader}>Tips to Improve</Text>
          <View style={styles.tipsCard}>
            {tips.map((tip) => (
              <Text key={tip} style={styles.tipText}>
                • {tip}
              </Text>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
};

export default WellbeingScreen;
