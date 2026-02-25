import "react-native-gesture-handler";
import React, { useCallback, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  Manrope_200ExtraLight,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider } from "./src/store";
import AppNavigator from "./src/navigation";
import globalStyles from "./src/styles/global.styles";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PoppinsRegular: Poppins_400Regular,
    PoppinsSemiBold: Poppins_600SemiBold,
    PoppinsBold: Poppins_700Bold,
    Manrope_200ExtraLight,
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      console.log("✅ Poppins fonts loaded successfully");
    }
    if (fontError) {
      console.error("❌ Font loading error:", fontError);
    }
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen once fonts are loaded or an error occurs
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF8F2",
        }}
      >
        <Text style={{ fontSize: 16, color: "#1F2937" }}>
          Loading Poppins fonts...
        </Text>
      </View>
    );
  }

  if (fontError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF8F2",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 16, color: "#E02424", textAlign: "center" }}>
          Font loading error: {fontError.message}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <StoreProvider>
        <AppNavigator />
        <StatusBar style="dark" />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
