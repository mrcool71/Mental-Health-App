import React from "react";
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import WellbeingScreen from "../screens/WellbeingScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ResourcesScreen from "../screens/ResourcesScreen";
import BottomTabBar from "../components/BottomTabBar";
import { BottomTabParamList } from "../types/navigation";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      tabBar={(props: BottomTabBarProps) => <BottomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Wellbeing"
        component={WellbeingScreen}
        options={{ tabBarLabel: "Score" }}
      />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
