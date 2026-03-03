import React from "react";
import { Animated, View } from "react-native";
import theme from "../theme/theme";

interface ProgressBarProps {
  /** 0–100 static value (ignored when animatedWidth is provided). */
  value?: number;
  /** Fill colour. Defaults to theme.colors.primary. */
  color?: string;
  /** "sm" → height 4 / borderRadius 2 (default). "md" → height 8 / borderRadius pill. */
  size?: "sm" | "md";
  /** Supply an Animated interpolation for the width instead of a static %. */
  animatedWidth?: Animated.AnimatedInterpolation<string | number>;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  color = theme.colors.primary,
  size = "sm",
  animatedWidth,
}) => {
  const height = size === "md" ? 8 : 4;
  const radius = size === "md" ? theme.radii.pill : 2;
  const clamped = Math.max(0, Math.min(value, 100));

  const FillComponent = animatedWidth ? Animated.View : View;
  const widthStyle = animatedWidth
    ? { width: animatedWidth }
    : { width: `${clamped}%` as const };

  return (
    <View
      style={{
        height,
        borderRadius: radius,
        backgroundColor: theme.colors.backgroundAlt,
        overflow: "hidden" as const,
      }}
    >
      <FillComponent
        style={[
          { height, borderRadius: radius, backgroundColor: color },
          widthStyle,
        ]}
      />
    </View>
  );
};

export default ProgressBar;
