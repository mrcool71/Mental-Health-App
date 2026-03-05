import React from "react";
import { ScrollView, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_HEIGHT } from "../constants/navigation";
import globalStyles from "../styles/global.styles";
import theme from "../theme/theme";

interface ScreenScrollViewProps {
  accessibilityLabel: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const ScreenScrollView: React.FC<ScreenScrollViewProps> = ({
  accessibilityLabel,
  contentContainerStyle,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const autoBottomPad = TAB_BAR_HEIGHT + insets.bottom + theme.spacing.md;

  const defaultStyle = [
    globalStyles.scrollContent,
    { paddingBottom: autoBottomPad },
  ];

  const resolvedStyle = contentContainerStyle
    ? [contentContainerStyle, { paddingBottom: autoBottomPad }]
    : defaultStyle;

  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={resolvedStyle}
      showsVerticalScrollIndicator={false}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </ScrollView>
  );
};

export default ScreenScrollView;
