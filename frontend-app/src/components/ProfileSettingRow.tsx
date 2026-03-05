import React from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import profileStyles from "../styles/profile.styles";
import theme from "../theme/theme";

interface SettingRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
  accessibilityLabel: string;
}

export function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
  danger,
  accessibilityLabel,
}: SettingRowProps) {
  const iconColor = danger ? theme.colors.danger : theme.colors.primary;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={profileStyles.settingRow}
      onPress={onPress}
    >
      <View style={profileStyles.leftRow}>
        <View style={profileStyles.rowIconWrap}>
          <MaterialIcons name={icon} size={18} color={iconColor} />
        </View>
        <View style={profileStyles.rowTextWrap}>
          <Text
            style={[profileStyles.rowTitle, danger && profileStyles.rowTitleDanger]}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text style={profileStyles.rowSubtitle}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
      {!danger && <Text style={profileStyles.arrowText}>›</Text>}
    </TouchableOpacity>
  );
}

interface SwitchRowProps {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
}

export function SwitchRow({
  title,
  subtitle,
  value,
  onValueChange,
  disabled,
}: SwitchRowProps) {
  return (
    <View
      style={[profileStyles.settingRow, disabled && profileStyles.switchDisabledRow]}
    >
      <View style={profileStyles.leftRow}>
        <View style={profileStyles.rowTextWrap}>
          <Text style={profileStyles.rowTitle}>{title}</Text>
          <Text style={profileStyles.rowSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        thumbColor={value ? theme.colors.primary : theme.colors.muted}
      />
    </View>
  );
}
