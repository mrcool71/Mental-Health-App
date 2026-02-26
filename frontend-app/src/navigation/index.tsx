import React, { useRef, useState } from "react";
import { View } from "react-native";
import {
  NavigationContainer,
  type NavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs";
import Header from "../components/Header";
import QuickCheckScreen from "../screens/QuickCheckScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import { RootStackParamList } from "../types/navigation";
import { NAV_STACK_SCREEN_OPTIONS } from "../constants/navigation";
import { useStore } from "../store";
import navigationStyles from "../styles/navigation.styles";

const Stack = createNativeStackNavigator<RootStackParamList>();

type NavigatorContentProps = {
  currentRoute: string;
  navRef: React.RefObject<NavigationContainerRef<RootStackParamList> | null>;
};

function NavigatorContent({ currentRoute, navRef }: NavigatorContentProps) {
  const { state } = useStore();
  return (
    <View style={navigationStyles.container}>
      {currentRoute === "Onboarding" ? null : (
        <Header
          badgeCount={3}
          onPressProfile={() => {
            navRef.current?.navigate("Tabs", { screen: "Profile" });
          }}
          onPressNotifications={() => {
            console.log("Notifications pressed");
          }}
        />
      )}
      <Stack.Navigator
        initialRouteName={state.hasOnboarded ? "Tabs" : "Onboarding"}
        screenOptions={NAV_STACK_SCREEN_OPTIONS}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Tabs" component={BottomTabs} />
        <Stack.Screen name="QuickCheck" component={QuickCheckScreen} />
      </Stack.Navigator>
    </View>
  );
}

const AppNavigator: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>("");
  const navRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  const handleStateChange = () => {
    const route = navRef.current?.getCurrentRoute();
    if (route?.name) {
      setCurrentRoute(route.name);
    }
  };

  return (
    <NavigationContainer
      ref={navRef}
      onReady={handleStateChange}
      onStateChange={handleStateChange}
    >
      <NavigatorContent currentRoute={currentRoute} navRef={navRef} />
    </NavigationContainer>
  );
};

export default AppNavigator;
