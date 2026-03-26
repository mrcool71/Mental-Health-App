import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import MoodBadge from "../components/MoodBadge";
import ProgressBar from "../components/ProgressBar";
import { SettingRow, SwitchRow } from "../components/ProfileSettingRow";
import ScreenScrollView from "../components/ScreenScrollView";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import profileStyles from "../styles/profile.styles";
import { BottomTabScreenProps } from "../types/navigation";
import { exportDataToCsv, shareCsvFile } from "../utilities";
import { signOut, getCurrentUser } from "../services/auth";

const ProfileScreen: React.FC<BottomTabScreenProps<"Profile">> = () => {
  const {
    state,
    reset,
    setSensorEnabled,
    setBackgroundLocationEnabled,
    setBackgroundSensorsEnabled,
  } = useStore();
  const latestEntry = state.history[0];

  const [name, setName] = useState("Wellbeing Friend");
  const firebaseUser = getCurrentUser();
  const userEmail = firebaseUser?.email ?? "Not signed in";
  const [dailyReminders, setDailyReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const wellbeingProgress = Math.max(0, Math.min(state.score, 100));

  const toggleName = () =>
    setName((prev) =>
      prev === "Wellbeing Friend" ? "Mindful Friend" : "Wellbeing Friend",
    );

  const handleExportData = async () => {
    if (isExporting) return;

    try {
      setIsExporting(true);
      const { uri, rowCount } = await exportDataToCsv(state);
      const shared = await shareCsvFile(uri);

      if (!shared) {
        Alert.alert(
          "CSV Export Complete",
          `Created ${rowCount} row(s). File saved at:\n${uri}`,
        );
        return;
      }

      Alert.alert(
        "CSV Export Complete",
        `Created ${rowCount} row(s) and opened the share sheet.`,
      );
    } catch (error) {
      Alert.alert(
        "Export Failed",
        error instanceof Error
          ? error.message
          : "Unable to export local data to CSV.",
      );
    } finally {
      setIsExporting(false);
    }
  };

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
            <Text style={profileStyles.email}>{userEmail}</Text>
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
        title="Email"
        subtitle={userEmail}
        onPress={() => console.log("Email info")}
        accessibilityLabel="Email"
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
      <SwitchRow
        title="Location (GPS)"
        subtitle="Allow location tracking while using the app"
        value={state.sensors.enabled.location}
        onValueChange={(val) => setSensorEnabled("location", val)}
      />
      <SwitchRow
        title="Background Location"
        subtitle="Collect location when the app is closed"
        value={state.sensors.backgroundLocationEnabled}
        onValueChange={setBackgroundLocationEnabled}
      />
      <SwitchRow
        title="Accelerometer"
        subtitle="Allow motion sensing while using the app"
        value={state.sensors.enabled.accelerometer}
        onValueChange={(val) => setSensorEnabled("accelerometer", val)}
      />
      <SwitchRow
        title="Microphone"
        subtitle="Allow sound level metering while using the app"
        value={state.sensors.enabled.microphone}
        onValueChange={(val) => setSensorEnabled("microphone", val)}
      />
      <SwitchRow
        title="Background Sensors"
        subtitle="Keep accelerometer & mic sampling when app is minimised"
        value={state.sensors.backgroundSensorsEnabled}
        onValueChange={setBackgroundSensorsEnabled}
      />
      <SettingRow
        icon="insights"
        title="View Data Usage"
        onPress={() => console.log("View data usage pressed")}
        accessibilityLabel="View data usage"
      />
      <SettingRow
        icon="download"
        title={isExporting ? "Exporting Data..." : "Export Data (CSV)"}
        subtitle="Create a CSV from local mood, survey, and sensor data"
        onPress={handleExportData}
        accessibilityLabel="Export data as CSV"
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
        onPress={() => {
          Alert.alert("Log Out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Log Out",
              style: "destructive",
              onPress: () => signOut(),
            },
          ]);
        }}
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
