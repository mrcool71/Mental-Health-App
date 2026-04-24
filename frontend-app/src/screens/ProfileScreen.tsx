import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import notifee from "@notifee/react-native";
import MoodBadge from "../components/MoodBadge";
import ProgressBar from "../components/ProgressBar";
import { SettingRow, SwitchRow } from "../components/ProfileSettingRow";
import ScreenScrollView from "../components/ScreenScrollView";
import TextPromptModal from "../components/TextPromptModal";
import { deleteMoodHistory, syncProfile } from "../services/cloudSync";
import {
  deleteAccount,
  getCurrentUser,
  sendPasswordReset,
  signOut,
} from "../services/auth";
import { scheduleNotifications } from "../services/notificationScheduler";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import profileStyles from "../styles/profile.styles";
import { BottomTabScreenProps } from "../types/navigation";
import { exportDataToCsv, formatTime, shareCsvFile } from "../utilities";

function minutesToDate(totalMinutes: number): Date {
  const next = new Date();
  next.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0);
  return next;
}

function dateToMinutes(value: Date): number {
  return value.getHours() * 60 + value.getMinutes();
}

function getErrorMessage(error: unknown, fallback: string): string {
  const message = error instanceof Error ? error.message : fallback;

  if (message.includes("auth/wrong-password")) {
    return "Incorrect password. Enter your current password and try again.";
  }

  if (message.includes("auth/requires-recent-login")) {
    return "Your session expired. Sign in again, then retry account deletion.";
  }

  return message;
}

const ProfileScreen: React.FC<BottomTabScreenProps<"Profile">> = ({
  navigation,
}) => {
  const {
    state,
    reset,
    clearMoodHistory,
    setProfileName,
    setDailyRemindersEnabled,
    setPreferredCheckInTime,
    setSensorEnabled,
    setBackgroundLocationEnabled,
    setBackgroundSensorsEnabled,
  } = useStore();
  const latestEntry = state.history[0];
  const firebaseUser = getCurrentUser();
  const userEmail = firebaseUser?.email ?? "Not signed in";
  const userUid = firebaseUser?.uid ?? "Unavailable";

  const [darkMode, setDarkMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUpdatingReminders, setIsUpdatingReminders] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [pendingName, setPendingName] = useState(state.profile.displayName);
  const [deletePassword, setDeletePassword] = useState("");
  const [iosTimeDraft, setIosTimeDraft] = useState(
    minutesToDate(state.profile.preferredCheckInTimeMinutes),
  );

  const wellbeingProgress = Math.max(0, Math.min(state.score, 100));
  const preferredCheckInTimeLabel = formatTime(
    minutesToDate(state.profile.preferredCheckInTimeMinutes).getTime(),
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

  const handleOpenNameModal = () => {
    setPendingName(state.profile.displayName);
    setIsNameModalVisible(true);
  };

  const handleSaveName = async () => {
    const nextName = pendingName.trim();
    if (!nextName) {
      Alert.alert("Name Required", "Enter a display name before saving.");
      return;
    }

    setIsSavingName(true);

    try {
      setProfileName(nextName);
      setIsNameModalVisible(false);

      if (firebaseUser) {
        await syncProfile(firebaseUser.uid, { displayName: nextName });
      }
    } catch (error) {
      Alert.alert(
        "Name Update Failed",
        getErrorMessage(error, "Unable to update your name right now."),
      );
    } finally {
      setIsSavingName(false);
    }
  };

  const handleShowEmailInfo = () => {
    Alert.alert("Account Info", `Email: ${userEmail}\nUID: ${userUid}`);
  };

  const handlePasswordReset = async () => {
    if (!firebaseUser?.email) {
      Alert.alert(
        "Password Reset Unavailable",
        "This account does not have a valid email address.",
      );
      return;
    }

    try {
      await sendPasswordReset(firebaseUser.email);
      Alert.alert(
        "Password Reset",
        "A reset link has been sent to your email",
      );
    } catch (error) {
      Alert.alert(
        "Password Reset Failed",
        getErrorMessage(error, "Unable to send a reset link right now."),
      );
    }
  };

  const handleDailyRemindersToggle = async (enabled: boolean) => {
    if (isUpdatingReminders) return;

    setIsUpdatingReminders(true);
    setDailyRemindersEnabled(enabled);

    try {
      if (enabled) {
        await scheduleNotifications({
          enabled: true,
          preferredTimeMinutes: state.profile.preferredCheckInTimeMinutes,
        });
      } else {
        await notifee.cancelAllNotifications();
      }
    } catch (error) {
      setDailyRemindersEnabled(!enabled);
      Alert.alert(
        "Reminder Update Failed",
        getErrorMessage(error, "Unable to update reminder settings right now."),
      );
    } finally {
      setIsUpdatingReminders(false);
    }
  };

  const applyPreferredCheckInTime = async (nextDate: Date) => {
    const previousMinutes = state.profile.preferredCheckInTimeMinutes;
    const nextMinutes = dateToMinutes(nextDate);

    if (nextMinutes === previousMinutes) {
      return;
    }

    setPreferredCheckInTime(nextMinutes);

    try {
      if (state.profile.dailyRemindersEnabled) {
        await scheduleNotifications({
          enabled: true,
          preferredTimeMinutes: nextMinutes,
        });
      }
    } catch (error) {
      setPreferredCheckInTime(previousMinutes);
      Alert.alert(
        "Time Update Failed",
        getErrorMessage(error, "Unable to update the preferred check-in time."),
      );
    }
  };

  const handleTimePickerChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setIsTimePickerVisible(false);
      if (event.type === "set" && selectedDate) {
        void applyPreferredCheckInTime(selectedDate);
      }
      return;
    }

    if (selectedDate) {
      setIosTimeDraft(selectedDate);
    }
  };

  const handleOpenTimePicker = () => {
    setIosTimeDraft(minutesToDate(state.profile.preferredCheckInTimeMinutes));
    setIsTimePickerVisible(true);
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear Mood History",
      "This will permanently delete all mood entries and recalculate your wellbeing score.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            clearMoodHistory();
            if (firebaseUser) {
              deleteMoodHistory(firebaseUser.uid).catch((error) => {
                console.error("[ProfileScreen] deleteMoodHistory failed:", error);
              });
            }
          },
        },
      ],
    );
  };

  const handleDeleteAccountPress = () => {
    if (isDeletingAccount) return;

    Alert.alert(
      "Delete Account",
      "This permanently deletes your account, local storage, and synced wellbeing data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          style: "destructive",
          onPress: () => {
            setDeletePassword("");
            setIsPasswordModalVisible(true);
          },
        },
      ],
    );
  };

  const handleDeleteAccountPromptConfirm = () => {
    if (isDeletingAccount) return;

    if (!deletePassword.trim()) {
      Alert.alert("Password Required", "Enter your current password to continue.");
      return;
    }

    setIsPasswordModalVisible(false);
    Alert.alert(
      "Delete Account",
      "Final confirmation: this action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () => {
            void (async () => {
              setIsDeletingAccount(true);
              try {
                await deleteAccount(deletePassword);
                reset();
              } catch (error) {
                Alert.alert(
                  "Delete Account Failed",
                  getErrorMessage(
                    error,
                    "Unable to delete your account right now.",
                  ),
                );
              } finally {
                setIsDeletingAccount(false);
                setDeletePassword("");
              }
            })();
          },
        },
      ],
    );
  };

  return (
    <>
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
              <Text style={profileStyles.name}>{state.profile.displayName}</Text>
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
          subtitle={state.profile.displayName}
          onPress={handleOpenNameModal}
          accessibilityLabel="Change name"
        />
        <SettingRow
          icon="email"
          title="Email"
          subtitle={userEmail}
          onPress={handleShowEmailInfo}
          accessibilityLabel="Email"
        />
        <SettingRow
          icon="lock"
          title="Change Password"
          subtitle="Send a password reset link to your email"
          onPress={() => {
            void handlePasswordReset();
          }}
          accessibilityLabel="Change password"
        />

        <Text style={globalStyles.sectionHeader}>Mode & Check-In Preferences</Text>
        <SwitchRow
          title="Daily Reminders"
          subtitle="Receive gentle reminder prompts"
          value={state.profile.dailyRemindersEnabled}
          onValueChange={(value) => {
            void handleDailyRemindersToggle(value);
          }}
          disabled={isUpdatingReminders}
        />
        <SettingRow
          icon="schedule"
          title="Preferred Check-In Time"
          subtitle={`${preferredCheckInTimeLabel} daily`}
          onPress={handleOpenTimePicker}
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
          onPress={() => navigation.navigate("SensorData")}
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
          onPress={handleClearHistory}
          danger
          accessibilityLabel="Clear mood history"
        />

        <Text style={globalStyles.sectionHeader}>Account Actions</Text>
        <SettingRow
          icon="warning"
          title={isDeletingAccount ? "Deleting Account..." : "Delete Account"}
          onPress={handleDeleteAccountPress}
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

      <TextPromptModal
        confirmDisabled={isSavingName || pendingName.trim().length === 0}
        confirmText={isSavingName ? "Saving..." : "Save"}
        message="Update the display name shown on your profile."
        onCancel={() => {
          setIsNameModalVisible(false);
          setPendingName(state.profile.displayName);
        }}
        onChangeText={setPendingName}
        onConfirm={() => {
          void handleSaveName();
        }}
        placeholder="Display name"
        title="Change Name"
        value={pendingName}
        visible={isNameModalVisible}
      />

      <TextPromptModal
        confirmDisabled={isDeletingAccount || deletePassword.trim().length === 0}
        confirmText={isDeletingAccount ? "Deleting..." : "Continue"}
        message="Enter your current password before the final delete confirmation."
        onCancel={() => {
          setIsPasswordModalVisible(false);
          setDeletePassword("");
        }}
        onChangeText={setDeletePassword}
        onConfirm={handleDeleteAccountPromptConfirm}
        placeholder="Current password"
        secureTextEntry
        autoCapitalize="none"
        title="Confirm Password"
        value={deletePassword}
        visible={isPasswordModalVisible}
      />

      {Platform.OS === "android" && isTimePickerVisible ? (
        <DateTimePicker
          mode="time"
          onChange={handleTimePickerChange}
          value={minutesToDate(state.profile.preferredCheckInTimeMinutes)}
        />
      ) : null}

      {Platform.OS === "ios" ? (
        <Modal
          animationType="fade"
          transparent
          visible={isTimePickerVisible}
          onRequestClose={() => setIsTimePickerVisible(false)}
        >
          <View style={profileStyles.modalBackdrop}>
            <View style={profileStyles.modalCard}>
              <Text style={profileStyles.modalTitle}>Preferred Check-In Time</Text>
              <Text style={profileStyles.modalMessage}>
                Pick the daily reminder time for mental health check-ins.
              </Text>
              <DateTimePicker
                display="spinner"
                mode="time"
                onChange={handleTimePickerChange}
                value={iosTimeDraft}
              />
              <View style={profileStyles.modalActions}>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => setIsTimePickerVisible(false)}
                  style={profileStyles.modalButton}
                >
                  <Text style={profileStyles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => {
                    setIsTimePickerVisible(false);
                    void applyPreferredCheckInTime(iosTimeDraft);
                  }}
                  style={[
                    profileStyles.modalButton,
                    profileStyles.modalButtonPrimary,
                  ]}
                >
                  <Text style={profileStyles.modalButtonTextPrimary}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
};

export default ProfileScreen;
