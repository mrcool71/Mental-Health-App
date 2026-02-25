import React, { useMemo } from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import styles, { ringSize } from "../styles/progress.styles";
import { colors, spacing } from "../theme/theme";
import { ProgressRingProps } from "../types/ui";

// Simple SVG progress circle; styling sourced from src/styles/progress.styles.ts and tokens from src/theme/theme.ts.
const ProgressRing: React.FC<ProgressRingProps> = ({
  size = 140,
  value,
  max,
  label = "Wellbeing score",
  sublabel,
}) => {
  const strokeWidth = spacing.sm;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const { clampedValue, strokeDashoffset, percentage } = useMemo(() => {
    const clamped = Math.max(0, Math.min(value, max));
    const progress = max > 0 ? clamped / max : 0;
    const pct = progress * 100;
    const offset = circumference - progress * circumference;
    return {
      clampedValue: clamped,
      strokeDashoffset: offset,
      percentage: Math.round(pct),
    };
  }, [value, max, circumference]);

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={`${label} ${percentage}%`}
    >
      <View
        style={[styles.ringWrapper, ringSize(size)]}
        accessibilityRole="progressbar"
        accessibilityValue={{ now: clampedValue, min: 0, max }}
      >
        <Svg width={size} height={size}>
          <Circle
            stroke={colors.backgroundAlt}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={colors.primary}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={[styles.ringLabel, ringSize(size)]}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.sublabel}>{sublabel || `${percentage}%`}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProgressRing;
