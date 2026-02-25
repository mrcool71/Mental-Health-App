import React from "react";
import { ScrollView, Text, View } from "react-native";
import globalStyles from "../styles/global.styles";
import screenStyles from "../styles/screen.styles";
import ThemedButton from "../components/ThemedButton";
import { BottomTabScreenProps } from "../types/navigation";
import { SCREEN_TITLES } from "../constants/screens";

const ResourcesScreen: React.FC<BottomTabScreenProps<"Resources">> = () => (
  <ScrollView
    style={globalStyles.screen}
    contentContainerStyle={screenStyles.content}
    accessible
    accessibilityLabel="Resources screen"
  >
    <View style={screenStyles.hero}>
      <Text style={globalStyles.heading}>{SCREEN_TITLES.resources}</Text>
      <Text style={globalStyles.body}>
        Practical tools to reset, reflect, and recharge.
      </Text>
    </View>

    <View style={screenStyles.section}>
      <Text style={globalStyles.subheading}>Quick supports</Text>
      <Text style={globalStyles.body}>
        Tap a resource to open tips, grounding exercises, and mood guides.
      </Text>
    </View>

    <View style={screenStyles.section}>
      <ThemedButton
        title="Breathing reset"
        onPress={() => {}}
        accessibilityLabel="Open breathing reset"
        variant="primary"
      />
      <ThemedButton
        title="Journal prompts"
        onPress={() => {}}
        accessibilityLabel="Open journal prompts"
        variant="ghost"
      />
    </View>
  </ScrollView>
);

export default ResourcesScreen;
