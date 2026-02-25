import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import QuickCheckScreen from "../screens/QuickCheckScreen";
import BottomTabs from "./BottomTabs";
import Header from "../components/Header";
import { RootStackParamList } from "../types/navigation";
import {
  NAV_STACK_INITIAL_ROUTE,
  NAV_STACK_SCREEN_OPTIONS,
} from "../constants/navigation";
import theme from "../theme/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

// Main app navigator wrapper that includes the top header and bottom tabs
function NavigatorContent() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header
        badgeCount={3}
        onPressProfile={() => {
          // @ts-ignore - navigation typing
          navigation.navigate("Tabs", { screen: "Profile" });
        }}
        onPressNotifications={() => {
          console.log("Notifications pressed");
        }}
      />
      <Stack.Navigator
        initialRouteName={NAV_STACK_INITIAL_ROUTE}
        screenOptions={NAV_STACK_SCREEN_OPTIONS}
      >
        <Stack.Screen name="Tabs" component={BottomTabs} />
        <Stack.Screen name="QuickCheck" component={QuickCheckScreen} />
      </Stack.Navigator>
    </View>
  );
}

// Navigation stack; keep options minimal for the demo.
const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <NavigatorContent />
  </NavigationContainer>
);

export default AppNavigator;
