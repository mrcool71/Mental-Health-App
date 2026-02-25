import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../theme/theme";

type HeaderProps = {
  onPressProfile?: () => void;
  onPressNotifications?: () => void;
  badgeCount?: number;
  title?: string;
};

// Top header bar with profile avatar, title, and notification bell with badge.
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
          source={{ uri: "https://i.pravatar.cc/200?img=47" }}
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

const styles = StyleSheet.create({
  container: {
    height: theme.sizes.headerHeight,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  profileWrap: {
    width: theme.sizes.avatar,
    height: theme.sizes.avatar,
    borderRadius: theme.radii.pill,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.cardSoft,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: theme.sizes.avatar - 4,
    height: theme.sizes.avatar - 4,
    borderRadius: (theme.sizes.avatar - 4) / 2,
  },
  titleWrap: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    color: theme.colors.plum,
    // fontWeight: "700",
    fontFamily: theme.typography.fontFamilyDisplay,
  },
  bellWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: 2,
    top: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 11,
    color: "#fff",
    // fontWeight: "700",
  },
});
