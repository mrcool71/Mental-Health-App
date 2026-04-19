import React, { useEffect, useRef, useState } from "react";
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
import LoginScreen from "../screens/LoginScreen";
import { RootStackParamList } from "../types/navigation";
import { NAV_STACK_SCREEN_OPTIONS } from "../constants/navigation";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import { sendTestNotification } from "../utilities";
import { onAuthStateChanged, type AuthUser } from "../services/auth";

const Stack = createNativeStackNavigator<RootStackParamList>();

type NavigatorContentProps = {
  currentRoute: string;
  navRef: React.RefObject<NavigationContainerRef<RootStackParamList> | null>;
  user: AuthUser | null;
};

function NavigatorContent({ currentRoute, navRef, user }: NavigatorContentProps) {
  const { state, isRestored } = useStore();

  if (!isRestored) return null;

  // Not signed in → show Login screen only
  if (!user) {
    return (
      <View style={globalStyles.screen}>
        <Stack.Navigator screenOptions={NAV_STACK_SCREEN_OPTIONS}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </View>
    );
  }

  // Signed in → normal app flow
  return (
    <View style={globalStyles.screen}>
      {currentRoute === "Onboarding" || currentRoute === "Login" ? null : (
        <Header
          badgeCount={3}
          onPressProfile={() => {
            navRef.current?.navigate("Tabs", { screen: "Profile" });
          }}
          onPressNotifications={() => {
            console.log("Notifications pressed");
            sendTestNotification();
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  const handleStateChange = () => {
    const route = navRef.current?.getCurrentRoute();
    if (route?.name) {
      setCurrentRoute(route.name);
    }
  };

  // Wait for auth state to resolve before rendering to avoid flicker
  if (!authReady) return null;

  return (
    <NavigationContainer
      ref={navRef}
      onReady={handleStateChange}
      onStateChange={handleStateChange}
    >
      <NavigatorContent currentRoute={currentRoute} navRef={navRef} user={user} />
    </NavigationContainer>
  );
};

export default AppNavigator;

