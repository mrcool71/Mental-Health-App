import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ScreenScrollView from "../components/ScreenScrollView";
import { LEARN_MORE_ITEMS, QUICK_ACTIONS } from "../constants/resources";
import globalStyles from "../styles/global.styles";
import resourcesStyles from "../styles/resources.styles";
import theme from "../theme/theme";
import { BottomTabScreenProps } from "../types/navigation";

const ResourcesScreen: React.FC<BottomTabScreenProps<"Resources">> = () => {
  return (
    <ScreenScrollView accessibilityLabel="Resources and help screen">
      <View style={resourcesStyles.headerRow}>
        <Text style={[globalStyles.heading, resourcesStyles.title]}>
          Resources & Help
        </Text>
        <Text style={resourcesStyles.titleEmoji}>😺</Text>
      </View>

      <Text style={resourcesStyles.sectionHeader}>Emergency Support</Text>
      <View style={resourcesStyles.emergencyList}>
        <View style={resourcesStyles.emergencyCard}>
          <View style={resourcesStyles.emergencyIconWrap}>
            <MaterialIcons name="phone" size={18} color={theme.colors.danger} />
          </View>
          <Text style={resourcesStyles.emergencyTitle}>Crisis Hotline</Text>
          <Text style={resourcesStyles.emergencyNumber}>988</Text>
          <Text style={resourcesStyles.emergencySubtitle}>
            24/7 Suicide & Crisis Lifeline
          </Text>
        </View>

        <View style={resourcesStyles.emergencyCard}>
          <View style={resourcesStyles.emergencyIconWrap}>
            <MaterialIcons name="chat" size={18} color={theme.colors.danger} />
          </View>
          <Text style={resourcesStyles.emergencyTitle}>Crisis Text Line</Text>
          <Text style={resourcesStyles.emergencyNumber}>Text HOME to 741741</Text>
          <Text style={resourcesStyles.emergencySubtitle}>
            Free 24/7 support via text
          </Text>
        </View>
      </View>

      <Text style={resourcesStyles.sectionHeader}>Quick Actions</Text>
      <View style={globalStyles.moodGrid}>
        {QUICK_ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.title}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            style={resourcesStyles.quickActionCard}
            onPress={() => {
              console.log(`${item.title} pressed`);
            }}
          >
            <Text style={resourcesStyles.quickActionEmoji}>{item.emoji}</Text>
            <Text style={resourcesStyles.quickActionTitle}>{item.title}</Text>
            <Text style={resourcesStyles.quickActionSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={resourcesStyles.sectionHeader}>Learn More</Text>
      <View style={resourcesStyles.learnMoreList}>
        {LEARN_MORE_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.title}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            style={resourcesStyles.learnMoreRow}
            onPress={() => {
              console.log(`${item.title} pressed`);
            }}
          >
            <View style={resourcesStyles.learnMoreTextWrap}>
              <Text style={resourcesStyles.learnMoreTitle}>{item.title}</Text>
              <Text style={resourcesStyles.learnMoreSubtitle}>{item.subtitle}</Text>
            </View>
            <MaterialIcons
              name="open-in-new"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={resourcesStyles.campusCard}>
        <View style={resourcesStyles.campusHeaderRow}>
          <Text style={resourcesStyles.campusEmoji}>😺</Text>
          <Text style={resourcesStyles.campusTitle}>Campus Resources</Text>
        </View>

        <Text style={resourcesStyles.campusBody}>
          If you're a student, your campus likely offers free counseling
          services and support groups.
        </Text>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Find campus help"
          onPress={() => {
            console.log("Find Campus Help pressed");
          }}
        >
          <Text style={resourcesStyles.campusLink}>Find Campus Help ›</Text>
        </TouchableOpacity>
      </View>

      <Text style={resourcesStyles.footerText}>
        🔒 Your privacy matters. All your data is stored locally on your device
        and is never shared.
      </Text>
    </ScreenScrollView>
  );
};

export default ResourcesScreen;
