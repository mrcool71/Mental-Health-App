import React, { useMemo } from "react";
import { Text, View } from "react-native";
import ProgressBar from "../components/ProgressBar";
import ProgressRing from "../components/ProgressRing";
import ScreenScrollView from "../components/ScreenScrollView";
import { PHQ9_MAX_SCORE } from "../constants/phq9";
import {
  WELLBEING_DEFAULT_STATS,
  WELLBEING_MAX_SCORE,
  WELLBEING_STAT_COLORS,
  WELLBEING_TIPS,
} from "../constants/wellbeing";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import styles from "../styles/wellbeing.styles";
import { BottomTabScreenProps } from "../types/navigation";
import type { BreakdownStat } from "../types/wellbeing";
import {
  calculateScore,
  formatTime,
  getPhq9SeverityLabel,
  getScoreLabel,
} from "../utilities";

const WellbeingScreen: React.FC<BottomTabScreenProps<"Wellbeing">> = () => {
  const { state } = useStore();
  const latestPhq9 = state.phq9History[0];

  const moodScore = useMemo<number>(
    () => calculateScore(state.history),
    [state.history],
  );

  const scoreLabel = useMemo<string>(
    () => getScoreLabel(state.score),
    [state.score],
  );

  const stats = useMemo<BreakdownStat[]>(
    () => [
      { label: "Mood", value: moodScore, color: WELLBEING_STAT_COLORS.Mood },
      {
        label: "Energy",
        value: WELLBEING_DEFAULT_STATS.energy,
        color: WELLBEING_STAT_COLORS.Energy,
      },
      {
        label: "Sleep",
        value: WELLBEING_DEFAULT_STATS.sleep,
        color: WELLBEING_STAT_COLORS.Sleep,
      },
      {
        label: "Social",
        value: WELLBEING_DEFAULT_STATS.social,
        color: WELLBEING_STAT_COLORS.Social,
      },
    ],
    [moodScore],
  );

  const tips = useMemo<string[]>(() => {
    if (state.score >= 90) return WELLBEING_TIPS.excellent;
    if (state.score < 50) return WELLBEING_TIPS.low;
    if (state.score < 70) return WELLBEING_TIPS.moderate;
    return WELLBEING_TIPS.high;
  }, [state.score]);

  return (
    <ScreenScrollView accessibilityLabel="Wellbeing score screen">
      <View style={styles.titleRow}>
        <Text style={globalStyles.heading}>Wellbeing Score</Text>
        <View style={styles.titleMascot}>
          <Text style={globalStyles.mascotEmojiSm}>{"\uD83D\uDE3A"}</Text>
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

      <View style={styles.phqCard}>
        <Text style={styles.phqTitle}>Latest PHQ-9</Text>
        {latestPhq9 ? (
          <>
            <Text style={styles.phqScore}>
              {latestPhq9.score}/{PHQ9_MAX_SCORE}
            </Text>
            <Text style={styles.phqSeverity}>
              {getPhq9SeverityLabel(latestPhq9.severity)}
            </Text>
            <Text style={styles.phqMeta}>
              Logged at {formatTime(latestPhq9.timestamp)}
            </Text>
          </>
        ) : (
          <Text style={styles.phqMeta}>
            Complete your first PHQ-9 check-in from the Home screen.
          </Text>
        )}
        <Text style={styles.phqNote}>
          PHQ-9 is a screening score and not a diagnosis.
        </Text>
      </View>

      <View>
        <Text style={globalStyles.sectionHeader}>Score Breakdown</Text>
        <View style={globalStyles.moodGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value} /100</Text>
              <ProgressBar value={stat.value} color={stat.color} />
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
                - {tip}
              </Text>
            ))}
          </View>
        </View>
      ) : null}
    </ScreenScrollView>
  );
};

export default WellbeingScreen;
