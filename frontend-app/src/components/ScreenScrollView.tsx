import React from "react";
import { ScrollView, type StyleProp, type ViewStyle } from "react-native";
import globalStyles from "../styles/global.styles";

interface ScreenScrollViewProps {
  accessibilityLabel: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const ScreenScrollView: React.FC<ScreenScrollViewProps> = ({
  accessibilityLabel,
  contentContainerStyle,
  children,
}) => (
  <ScrollView
    style={globalStyles.screen}
    contentContainerStyle={contentContainerStyle ?? globalStyles.scrollContent}
    showsVerticalScrollIndicator={false}
    accessibilityLabel={accessibilityLabel}
  >
    {children}
  </ScrollView>
);

export default ScreenScrollView;
