import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/header.styles";
import theme from "../theme/theme";

type HeaderProps = {
  onPressProfile?: () => void;
  onPressNotifications?: () => void;
  badgeCount?: number;
  title?: string;
};

export default function Header({
  onPressProfile,
  onPressNotifications,
  badgeCount = 0,
  title,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Profile"
        onPress={onPressProfile}
        style={styles.profileWrap}
      >
        <Image
          source={{ uri: "https://www.gravatar.com/avatar/0?d=mp&f=y" }}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <View style={styles.titleWrap}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        onPress={onPressNotifications}
        style={styles.bellWrap}
      >
        <MaterialIcons
          name="notifications-none"
          size={22}
          color={theme.colors.plum}
        />
        {badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
