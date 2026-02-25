import React, { useMemo } from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors, spacing } from "../theme/theme";
import pieStyles from "../styles/pie.styles";
import { Mood, MoodEntry } from "../types/models";
import type { PieSegment, WellbeingPieChartProps } from "../types/components";

const MOOD_COLORS: Record<Mood, string> = {
  happy: colors.primary,
  good: colors.accent,
  okay: colors.lilac,
  sad: colors.danger,
};

export default function WellbeingPieChart({
  entries,
  size = 140,
  strokeWidth = spacing.md,
}: WellbeingPieChartProps) {
  const { segments, total } = useMemo(() => {
    const counts: Record<Mood, number> = {
      happy: 0,
      good: 0,
      okay: 0,
      sad: 0,
    };

    entries.forEach((e) => {
      counts[e.mood] += 1;
    });

    const segs: PieSegment[] = (Object.keys(counts) as Mood[]).map((mood) => ({
      mood,
      value: counts[mood],
      color: MOOD_COLORS[mood],
    }));

    const sum = segs.reduce((acc, s) => acc + s.value, 0);
    return { segments: segs, total: sum };
  }, [entries]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const chart = useMemo(() => {
    if (total <= 0) return [];

    let cumulative = 0;
    return segments
      .filter((s) => s.value > 0)
      .map((s) => {
        const length = (s.value / total) * circumference;
        const dashArray = `${length} ${circumference - length}`;
        const dashOffset = -cumulative;
        cumulative += length;

        return (
          <Circle
            key={s.mood}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={s.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
      });
  }, [circumference, radius, segments, size, strokeWidth, total]);

  return (
    <View
      style={pieStyles.container}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Wellbeing mood distribution"
    >
      <View style={pieStyles.chartRow}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.backgroundAlt}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {chart}
        </Svg>

        <View style={pieStyles.legend}>
          {total <= 0 ? (
            <Text style={pieStyles.emptyText}>No check-ins yet</Text>
          ) : (
            segments.map((s) => {
              const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
              return (
                <View
                  key={s.mood}
                  style={pieStyles.legendItem}
                  accessible
                  accessibilityLabel={`${s.mood} ${pct} percent`}
                >
                  <View style={pieStyles.legendLeft}>
                    <View
                      style={[pieStyles.dot, { backgroundColor: s.color }]}
                    />
                    <Text style={pieStyles.legendLabel}>{s.mood}</Text>
                  </View>
                  <Text style={pieStyles.legendValue}>{pct}%</Text>
                </View>
              );
            })
          )}
        </View>
      </View>
    </View>
  );
}
