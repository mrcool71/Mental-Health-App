import React, { useMemo } from "react";
import { Text, View } from "react-native";
import ProgressBar from "../components/ProgressBar";
import ProgressRing from "../components/ProgressRing";
import ScreenScrollView from "../components/ScreenScrollView";
import { WELLBEING_MAX_SCORE } from "../constants/wellbeing";
import { moodScores } from "../constants/store";
import {
  WELLBEING_DEFAULT_STATS,
  WELLBEING_STAT_COLORS,
  WELLBEING_TIPS,
} from "../constants/wellbeing";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import styles from "../styles/wellbeing.styles";
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
      { label: "Mood", value: moodScore, color: WELLBEING_STAT_COLORS.Mood },
      { label: "Energy", value: WELLBEING_DEFAULT_STATS.energy, color: WELLBEING_STAT_COLORS.Energy },
      { label: "Sleep", value: WELLBEING_DEFAULT_STATS.sleep, color: WELLBEING_STAT_COLORS.Sleep },
      { label: "Social", value: WELLBEING_DEFAULT_STATS.social, color: WELLBEING_STAT_COLORS.Social },
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
          <Text style={globalStyles.mascotEmojiSm}>😺</Text>
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
                • {tip}
              </Text>
            ))}
          </View>
        </View>
      ) : null}
    </ScreenScrollView>
  );
};

export default WellbeingScreen;
