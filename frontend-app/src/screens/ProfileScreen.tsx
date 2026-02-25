import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MoodBadge from "../components/MoodBadge";
import { useStore } from "../store";
import profileStyles from "../styles/profile.styles";
import theme from "../theme/theme";
import { BottomTabScreenProps } from "../types/navigation";

const ProfileScreen: React.FC<BottomTabScreenProps<"Profile">> = () => {
  const { state, reset } = useStore();
  const latestEntry = state.history[0];

  const [name, setName] = useState<string>("Wellbeing Friend");
  const [email] = useState<string>("hello@wellbeing.app");
  const [dailyReminders, setDailyReminders] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const wellbeingProgress = Math.max(0, Math.min(state.score, 100));

  return (
    <ScrollView
      style={profileStyles.screen}
      contentContainerStyle={profileStyles.content}
      showsVerticalScrollIndicator={false}
      accessibilityLabel="Profile screen"
    >
      <View style={profileStyles.profileCard}>
        <View style={profileStyles.profileCardInner}>
          <View style={profileStyles.accentStrip} />

          <View style={profileStyles.avatar}>
            <Text style={profileStyles.avatarEmoji}>👤</Text>
          </View>

          <View style={profileStyles.profileInfo}>
            <Text style={profileStyles.name}>{name}</Text>
            <Text style={profileStyles.email}>{email}</Text>
            {latestEntry ? (
              <View style={profileStyles.moodBadgeWrap}>
                <MoodBadge mood={latestEntry.mood} label={latestEntry.mood} />
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <Text style={profileStyles.wellbeingLabel}>Today's Wellbeing</Text>
      <View style={profileStyles.wellbeingTrack}>
        <View
          style={[profileStyles.wellbeingFill, { width: `${wellbeingProgress}%` }]}
        />
      </View>

      <Text style={profileStyles.sectionHeader}>Account Settings</Text>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Change name"
        style={profileStyles.settingRow}
        onPress={() =>
          setName((prev) =>
            prev === "Wellbeing Friend" ? "Mindful Friend" : "Wellbeing Friend",
          )
        }
      >
        <View style={profileStyles.leftRow}>
          <View style={profileStyles.rowIconWrap}>
            <MaterialIcons name="person" size={18} color={theme.colors.primary} />
          </View>
          <View style={profileStyles.rowTextWrap}>
            <Text style={profileStyles.rowTitle}>Change Name</Text>
            <Text style={profileStyles.rowSubtitle}>{name}</Text>
          </View>
        </View>
        <Text style={profileStyles.arrowText}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Change email"
        style={profileStyles.settingRow}
        onPress={() => {
          console.log("Change email pressed");
        }}
      >
        <View style={profileStyles.leftRow}>
          <View style={profileStyles.rowIconWrap}>
            <MaterialIcons name="email" size={18} color={theme.colors.primary} />
          </View>
          <View style={profileStyles.rowTextWrap}>
            <Text style={profileStyles.rowTitle}>Change Email</Text>
            <Text style={profileStyles.rowSubtitle}>{email}</Text>
          </View>
        </View>
        <Text style={profileStyles.arrowText}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Change password"
        style={profileStyles.settingRow}
        onPress={() => {
          console.log("Change password pressed");
        }}
      >
        <View style={profileStyles.leftRow}>
          <View style={profileStyles.rowIconWrap}>
            <MaterialIcons name="lock" size={18} color={theme.colors.primary} />
          </View>
          <View style={profileStyles.rowTextWrap}>
            <Text style={profileStyles.rowTitle}>Change Password</Text>
            <Text style={profileStyles.rowSubtitle}>Update your password securely</Text>
          </View>
        </View>
        <Text style={profileStyles.arrowText}>›</Text>
      </TouchableOpacity>

      <Text style={profileStyles.sectionHeader}>Mode & Check-In Preferences</Text>

      <View style={profileStyles.settingRow}>
        <View style={profileStyles.leftRow}>
          <View style={profileStyles.rowTextWrap}>
            <Text style={profileStyles.rowTitle}>Daily Reminders</Text>
            <Text style={profileStyles.rowSubtitle}>Receive gentle reminder prompts</Text>
          </View>
        </View>
        <Switch
          value={dailyReminders}
          onValueChange={setDailyReminders}
          thumbColor={dailyReminders ? theme.colors.primary : theme.colors.muted}
        />
      </View>

      <View style={profileStyles.settingRow}>
        <View style={profileStyles.leftRow}>
          <View style={profileStyles.rowTextWrap}>
            <Text style={profileStyles.rowTitle}>Preferred Check-In Time</Text>
            <Text style={profileStyles.rowSubtitle}>9:00 AM daily</Text>
          </View>
        </View>
        <Text style={profileStyles.arrowText}>›</Text>
      </View>

      <View style={[profileStyles.settingRow, profileStyles.switchDisabledRow]}>
        <View style={profileStyles.leftRow}>
          <View style={profileStyles.rowTextWrap}>
            <Text style={profileStyles.rowTitle}>Dark Mode</Text>
            <Text style={profileStyles.rowSubtitle}>Coming soon</Text>
          </View>
        </View>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          disabled
          thumbColor={darkMode ? theme.colors.primary : theme.colors.muted}
        />
      </View>

      <Text style={profileStyles.sectionHeader}>Privacy & Data</Text>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="View data usage"
        style={profileStyles.settingRow}
        onPress={() => {
          console.log("View data usage pressed");
        }}
      >
        <View style={profileStyles.leftRow}>
          <View style={profileStyles.rowIconWrap}>
            <MaterialIcons name="insights" size={18} color={theme.colors.primary} />
          </View>
          <View style={profileStyles.rowTextWrap}>
            <Text style={profileStyles.rowTitle}>View Data Usage</Text>
          </View>
        </View>
        <Text style={profileStyles.arrowText}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Download data"
        style={profileStyles.settingRow}
        onPress={() => {
          console.log("Download data pressed");
        }}
      >
        <View style={profileStyles.leftRow}>
          <View style={profileStyles.rowIconWrap}>
            <MaterialIcons name="download" size={18} color={theme.colors.primary} />
          </View>
          <View style={profileStyles.rowTextWrap}>
            <Text style={profileStyles.rowTitle}>Download My Data</Text>
          </View>
        </View>
        <Text style={profileStyles.arrowText}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Clear mood history"
        style={profileStyles.settingRow}
        onPress={reset}
      >
        <View style={profileStyles.leftRow}>
          <View style={profileStyles.rowIconWrap}>
            <MaterialIcons
              name="delete-outline"
              size={18}
              color={theme.colors.danger}
            />
          </View>
          <View style={profileStyles.rowTextWrap}>
            <Text style={[profileStyles.rowTitle, profileStyles.rowTitleDanger]}>
              Clear Mood History
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={profileStyles.sectionHeader}>Account Actions</Text>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Delete account"
        style={profileStyles.settingRow}
        onPress={() => {
          console.log("Delete account pressed");
        }}
      >
        <View style={profileStyles.leftRow}>
          <View style={profileStyles.rowIconWrap}>
            <MaterialIcons name="warning" size={18} color={theme.colors.danger} />
          </View>
          <View style={profileStyles.rowTextWrap}>
            <Text style={[profileStyles.rowTitle, profileStyles.rowTitleDanger]}>
              Delete Account
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Log out"
        style={profileStyles.settingRow}
        onPress={() => {
          console.log("Log out pressed");
        }}
      >
        <View style={profileStyles.leftRow}>
          <View style={profileStyles.rowIconWrap}>
            <MaterialIcons name="logout" size={18} color={theme.colors.primary} />
          </View>
          <View style={profileStyles.rowTextWrap}>
            <Text style={profileStyles.rowTitle}>Log Out</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={profileStyles.footer}>
        <Text style={profileStyles.footerText}>Cat-themed Mental Health App</Text>
        <Text style={profileStyles.footerText}>
          Version 1.0 · Made with ♡ for your wellbeing
        </Text>
        <Text style={profileStyles.footerText}>
          Your data stays private and secure 🔒
        </Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
