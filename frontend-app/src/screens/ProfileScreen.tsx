import React, { useState } from "react";
import { Text, View } from "react-native";
import MoodBadge from "../components/MoodBadge";
import ProgressBar from "../components/ProgressBar";
import { SettingRow, SwitchRow } from "../components/ProfileSettingRow";
import ScreenScrollView from "../components/ScreenScrollView";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import profileStyles from "../styles/profile.styles";
import { BottomTabScreenProps } from "../types/navigation";

const ProfileScreen: React.FC<BottomTabScreenProps<"Profile">> = () => {
  const { state, reset } = useStore();
  const latestEntry = state.history[0];

  const [name, setName] = useState("Wellbeing Friend");
  const [email] = useState("hello@wellbeing.app");
  const [dailyReminders, setDailyReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const wellbeingProgress = Math.max(0, Math.min(state.score, 100));

  const toggleName = () =>
    setName((prev) =>
      prev === "Wellbeing Friend" ? "Mindful Friend" : "Wellbeing Friend",
    );

  return (
    <ScreenScrollView
      accessibilityLabel="Profile screen"
      contentContainerStyle={profileStyles.content}
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
      <ProgressBar value={wellbeingProgress} size="md" />

      <Text style={globalStyles.sectionHeader}>Account Settings</Text>
      <SettingRow
        icon="person"
        title="Change Name"
        subtitle={name}
        onPress={toggleName}
        accessibilityLabel="Change name"
      />
      <SettingRow
        icon="email"
        title="Change Email"
        subtitle={email}
        onPress={() => console.log("Change email pressed")}
        accessibilityLabel="Change email"
      />
      <SettingRow
        icon="lock"
        title="Change Password"
        subtitle="Update your password securely"
        onPress={() => console.log("Change password pressed")}
        accessibilityLabel="Change password"
      />

      <Text style={globalStyles.sectionHeader}>Mode & Check-In Preferences</Text>
      <SwitchRow
        title="Daily Reminders"
        subtitle="Receive gentle reminder prompts"
        value={dailyReminders}
        onValueChange={setDailyReminders}
      />
      <SettingRow
        icon="schedule"
        title="Preferred Check-In Time"
        subtitle="9:00 AM daily"
        onPress={() => console.log("Check-in time pressed")}
        accessibilityLabel="Preferred check-in time"
      />
      <SwitchRow
        title="Dark Mode"
        subtitle="Coming soon"
        value={darkMode}
        onValueChange={setDarkMode}
        disabled
      />

      <Text style={globalStyles.sectionHeader}>Privacy & Data</Text>
      <SettingRow
        icon="insights"
        title="View Data Usage"
        onPress={() => console.log("View data usage pressed")}
        accessibilityLabel="View data usage"
      />
      <SettingRow
        icon="download"
        title="Download My Data"
        onPress={() => console.log("Download data pressed")}
        accessibilityLabel="Download data"
      />
      <SettingRow
        icon="delete-outline"
        title="Clear Mood History"
        onPress={reset}
        danger
        accessibilityLabel="Clear mood history"
      />

      <Text style={globalStyles.sectionHeader}>Account Actions</Text>
      <SettingRow
        icon="warning"
        title="Delete Account"
        onPress={() => console.log("Delete account pressed")}
        danger
        accessibilityLabel="Delete account"
      />
      <SettingRow
        icon="logout"
        title="Log Out"
        onPress={() => console.log("Log out pressed")}
        accessibilityLabel="Log out"
      />

      <View style={profileStyles.footer}>
        <Text style={globalStyles.footerText}>Cat-themed Mental Health App</Text>
        <Text style={globalStyles.footerText}>
          Version 1.0 · Made with ♡ for your wellbeing
        </Text>
        <Text style={globalStyles.footerText}>
          Your data stays private and secure 🔒
        </Text>
      </View>
    </ScreenScrollView>
  );
};

export default ProfileScreen;
