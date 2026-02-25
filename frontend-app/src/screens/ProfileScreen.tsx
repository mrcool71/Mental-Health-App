import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import globalStyles from "../styles/global.styles";
import screenStyles from "../styles/screen.styles";
import { ThemedTextField } from "../components/ThemedTextInput";
import ThemedButton from "../components/ThemedButton";
import { BottomTabScreenProps } from "../types/navigation";
import { SCREEN_TITLES } from "../constants/screens";

// Lightweight profile stub; theme toggle placeholder for future.
const ProfileScreen: React.FC<BottomTabScreenProps<"Profile">> = () => {
  const [name, setName] = useState("Cat Friend");

  return (
    <ScrollView
      style={globalStyles.screen}
      contentContainerStyle={screenStyles.content}
      accessible
      accessibilityLabel="Profile screen"
    >
      <View style={screenStyles.hero}>
        <Text style={globalStyles.heading}>{SCREEN_TITLES.profile}</Text>
        <Text style={globalStyles.body}>Add a name and tweak your vibe.</Text>
      </View>

      <View style={screenStyles.section}>
        <ThemedTextField
          label="Display name"
          value={name}
          onChangeText={setName}
          placeholder="Type your name"
          accessibilityLabel="Display name input"
        />
      </View>

      <View style={screenStyles.section}>
        <ThemedButton
          title="Save"
          onPress={() => {}}
          accessibilityLabel="Save profile settings"
          variant="primary"
        />
        <ThemedButton
          title="Toggle theme (coming soon)"
          onPress={() => {}}
          accessibilityLabel="Toggle theme placeholder"
          variant="ghost"
        />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
