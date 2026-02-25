import React, { useMemo, useRef } from "react";
import {
  Animated,
  Pressable,
  Text,
  View,
  AccessibilityInfo,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "../theme/theme";
import styles from "../styles/bottomTabs.styles";
import { useStore } from "../store";
import type { TabBarItemProps } from "../types/components";

const ICONS: Record<string, string> = {
  Home: "home",
  Wellbeing: "favorite",
  History: "history",
  Profile: "person",
  Resources: "menu-book",
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabBarItem({
  routeName,
  label,
  focused,
  iconName,
  showBadge,
  accessibilityLabel,
  testID,
  onPress,
  onLongPress,
}: TabBarItemProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const color = focused ? theme.colors.primary : theme.colors.muted;
  return (
    <AnimatedPressable
      accessibilityRole="tab"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel ?? `${label} tab`}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.tabItem, { transform: [{ scale }] }]}
      onPressIn={() =>
        Animated.spring(scale, {
          toValue: 0.96,
          useNativeDriver: true,
          speed: 20,
          bounciness: 6,
        }).start()
      }
      onPressOut={() =>
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 6,
        }).start()
      }
    >
      <View>
        <MaterialIcons name={iconName as any} size={24} color={color} />
        {routeName === "History" && showBadge ? (
          <View style={styles.badgeDot} />
        ) : null}
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </AnimatedPressable>
  );
}

export default function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { state: storeState } = useStore();

  const showHistoryBadge = storeState.history.length > 0;

  const bottomOffset = useMemo(
    () => theme.spacing.md + insets.bottom,
    [insets.bottom],
  );

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { bottom: bottomOffset }]}
      accessibilityRole="tablist"
      accessible
      accessibilityLabel="Bottom navigation"
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];

        const label =
          options.tabBarLabel !== undefined
            ? String(options.tabBarLabel)
            : options.title !== undefined
              ? options.title
              : route.name;

        const iconName = ICONS[route.name] ?? "ellipse";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name as never);
            AccessibilityInfo.announceForAccessibility(`${label} tab`);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarItem
            key={route.key}
            routeName={route.name}
            label={label}
            focused={focused}
            iconName={iconName}
            showBadge={showHistoryBadge}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
}
