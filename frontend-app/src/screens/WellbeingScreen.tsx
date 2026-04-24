import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import ProgressBar from "../components/ProgressBar";
import ProgressRing from "../components/ProgressRing";
import ScreenScrollView from "../components/ScreenScrollView";
import { PHQ9_MAX_SCORE } from "../constants/phq9";
import {
  WELLBEING_MAX_SCORE,
  WELLBEING_STAT_COLORS,
  WELLBEING_TIPS,
} from "../constants/wellbeing";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import styles from "../styles/wellbeing.styles";
import { BottomTabScreenProps } from "../types/navigation";
import type { BreakdownStat } from "../types/wellbeing";
import type { WellbeingBreakdown } from "../types/wellbeing";
import {
  calculateWellbeingBreakdown,
  formatTime,
  getPhq9SeverityLabel,
  getScoreLabel,
} from "../utilities";

const DEFAULT_BREAKDOWN: WellbeingBreakdown = {
  overall: 50,
  mood: 50,
  energy: 50,
  activity: 50,
  noise: 50,
  sleep: 50,
  social: 50,
};

const WellbeingScreen: React.FC<BottomTabScreenProps<"Wellbeing">> = () => {
  const { state } = useStore();
  const latestPhq9 = state.phq9History[0];

  const [breakdown, setBreakdown] =
    useState<WellbeingBreakdown>(DEFAULT_BREAKDOWN);

  // Fetch the full breakdown whenever mood history changes
  useEffect(() => {
    let cancelled = false;
    calculateWellbeingBreakdown(state.history).then((result) => {
      if (!cancelled) setBreakdown(result);
    });
    return () => {
      cancelled = true;
    };
  }, [state.history]);

  const scoreLabel = useMemo<string>(
    () => getScoreLabel(breakdown.overall),
    [breakdown.overall],
  );

  const stats = useMemo<BreakdownStat[]>(
    () => [
      { label: "Mood", value: breakdown.mood, color: WELLBEING_STAT_COLORS.Mood },
      {
        label: "Energy",
        value: breakdown.energy,
        color: WELLBEING_STAT_COLORS.Energy,
      },
      {
        label: "Activity",
        value: breakdown.activity,
        color: WELLBEING_STAT_COLORS.Activity,
      },
      {
        label: "Noise",
        value: breakdown.noise,
        color: WELLBEING_STAT_COLORS.Noise,
      },
      {
        label: "Sleep",
        value: breakdown.sleep,
        color: WELLBEING_STAT_COLORS.Sleep,
      },
      {
        label: "Social",
        value: breakdown.social,
        color: WELLBEING_STAT_COLORS.Social,
      },
    ],
    [breakdown],
  );

  const tips = useMemo<string[]>(() => {
    if (breakdown.overall >= 90) return WELLBEING_TIPS.excellent;
    if (breakdown.overall < 50) return WELLBEING_TIPS.low;
    if (breakdown.overall < 70) return WELLBEING_TIPS.moderate;
    return WELLBEING_TIPS.high;
  }, [breakdown.overall]);

  return (
    <ScreenScrollView accessibilityLabel="Wellbeing score screen">
      <View style={styles.titleRow}>
        <Text style={globalStyles.heading}>Wellbeing Score</Text>
        <View style={styles.titleMascot}>
          <Text style={globalStyles.mascotEmojiSm}>{"\uD83D\uDE3A"}</Text>
        </View>
      </View>

      {state.history.length > 0 ? (
        <View style={styles.ringCard}>
          <ProgressRing
            size={180}
            value={breakdown.overall}
            max={WELLBEING_MAX_SCORE}
            label="Wellbeing"
            sublabel={`${breakdown.overall}/${WELLBEING_MAX_SCORE}`}
          />
          <Text style={styles.scoreLabel}>{scoreLabel}</Text>
        </View>
      ) : (
        <View style={styles.ringCard}>
          <Text style={{ textAlign: "center", color: "#666", padding: 20 }}>
            Complete a check-in on the Home screen to see your wellbeing score.
          </Text>
        </View>
      )}

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

      {state.history.length > 0 && (
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
      )}

      {state.history.length > 0 && tips.length ? (
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

