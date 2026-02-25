import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider } from "./src/store";
import AppNavigator from "./src/navigation";
import globalStyles from "./src/styles/global.styles";
import {
  requestNotificationPermission,
  scheduleAllCheckups,
} from "./src/services/notificationService";
import { registerForegroundHandler } from "./src/services/notificationEventHandler";

// App entry wires fonts, store, and navigation. Tokens live in src/theme/theme.ts.
// Note: Ionicons is already bundled in Expo Go, no need to manually load it.
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PoppinsRegular: require("./assets/Poppins/Poppins-Regular.ttf"),
    PoppinsSemiBold: require("./assets/Poppins/Poppins-SemiBold.ttf"),
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      console.log('✅ Poppins fonts loaded successfully');
    }
    if (fontError) {
      console.error('❌ Font loading error:', fontError);
    }
  }, [fontsLoaded, fontError]);

  // Register Notifee foreground event listener & schedule daily checkups
  React.useEffect(() => {
    const unsubscribe = registerForegroundHandler();

    (async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleAllCheckups();
      } else {
        console.warn('⚠️ Notification permission not granted');
      }
    })();

    return unsubscribe;
  }, []);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF8F2" }}>
        <Text style={{ fontSize: 16, color: "#1F2937" }}>Loading Poppins fonts...</Text>
      </View>
    );
  }

  if (fontError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF8F2", padding: 20 }}>
        <Text style={{ fontSize: 16, color: "#E02424", textAlign: "center" }}>Font loading error: {fontError.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <AppNavigator />
        <StatusBar style="dark" />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
