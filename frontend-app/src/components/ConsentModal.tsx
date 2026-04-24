import React, { useState } from "react"
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native"
import theme from "../theme/theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface ConsentModalProps {
  visible: boolean
  onConsent: () => void
}

export default function ConsentModal({ visible, onConsent }: ConsentModalProps) {
  const insets = useSafeAreaInsets()
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState<boolean>(false)

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent
    const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 20
    if (isAtBottom) setHasScrolledToBottom(true)
  }

  function handleRequestClose() {
    // Intentionally prevent dismissing the consent modal via the Android
    // hardware back button so the existing consent flow remains unchanged.
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleRequestClose}
    >
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
          <Text style={styles.headerTitle}>
            Data Collection & Privacy Agreement
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
        >
          <Text style={styles.body}>
            Please read this Data Collection & Privacy Agreement ("Agreement")
            carefully before using this application ("App"). By tapping "I
            Understand" below, you acknowledge that you have read, understood,
            and agree to the collection and processing of your personal data as
            described in this Agreement. If you do not agree, do not use this App.
          </Text>

          <Text style={styles.sectionTitle}>1. WHO WE ARE</Text>

          <Text style={styles.body}>
            This App is developed and maintained for academic research and personal wellbeing
            monitoring purposes. Data collected through this App may be used for research into
            mental health patterns, behavioural analytics, and wellbeing interventions. By
            using this App you consent to participation in this data collection programme.
          </Text>

          <Text style={styles.sectionTitle}>2. DATA WE COLLECT</Text>

          <Text style={styles.body}>
            We collect the following categories of personal and behavioural data:
          </Text>

          <Text style={styles.bulletItem}>
            • PHQ-9 Assessment Responses: Your answers to the nine-question
            Patient Health Questionnaire (PHQ-9), your total score, severity classification,
            and the timestamp of each assessment submission.
          </Text>

          <Text style={styles.bulletItem}>
            • Mood Entries: Your self-reported mood state (Happy, Good, Okay, Sad),
            associated energy level, and any optional notes you provide, along with submission
            timestamps.
          </Text>

          <Text style={styles.bulletItem}>
            • Notification Response Data: Your responses to scheduled mental health
            check-in notifications, including the question presented, the option selected, and
            the time of response.
          </Text>

          <Text style={styles.bulletItem}>
            • Accelerometer Data: Continuous motion sensor readings (x, y, z axis
            values and magnitude) sampled at regular intervals to estimate physical activity
            levels and behavioural patterns. This data is aggregated and stored in 5-minute
            buckets.
          </Text>

          <Text style={styles.bulletItem}>
            • Ambient Sound Level Data: Periodic microphone metering readings
            measuring decibel levels of your surrounding environment. Note: no audio recordings
            are made or stored. Only numeric dB metering values and timestamps are collected.
          </Text>

          <Text style={styles.bulletItem}>
            • Location Data: GPS coordinates (latitude, longitude, altitude,
            accuracy, speed, and heading) collected via foreground and/or background location
            services to provide contextual information about your environment and mobility
            patterns. Background location collection may continue when the App is not in active
            use.
          </Text>

          <Text style={styles.bulletItem}>
            • Device & Session Data: Basic session metadata including timestamps,
            app version, and device platform identifiers as generated by Firebase services.
          </Text>

          <Text style={styles.sectionTitle}>3. HOW WE USE YOUR DATA</Text>

          <Text style={styles.body}>
            The data collected is used for the following purposes:
          </Text>

          <Text style={styles.bulletItem}>
            • To calculate and display your personalised Wellbeing Score and
            PHQ-9 severity breakdown within the App.
          </Text>

          <Text style={styles.bulletItem}>
            • To identify longitudinal patterns in mood, activity, sleep, and
            environment for research and personal insight purposes.
          </Text>

          <Text style={styles.bulletItem}>
            • To schedule and personalise mental health check-in notifications
            based on your usage patterns.
          </Text>

          <Text style={styles.bulletItem}>
            • To generate aggregated, anonymised research datasets for academic
            study of mental health indicators and passive sensing methodologies.
          </Text>

          <Text style={styles.bulletItem}>
            • To improve the App's algorithms, scoring models, and user experience
            over time.
          </Text>

          <Text style={styles.sectionTitle}>4. DATA STORAGE & RETENTION</Text>

          <Text style={styles.body}>
            All personal data is stored in two locations: locally on your device using on-device
            application storage, and remotely via Google Firebase Firestore, a cloud database
            service operated by Google LLC. Remote data is stored in accordance with Firebase's
            data retention and security policies.
          </Text>

          <Text style={styles.body}>
            Sensor readings (accelerometer, microphone, location) are aggregated into 5-minute
            time buckets before being transmitted to remote storage to reduce granularity and
            protect your privacy. Raw sensor values are retained locally on-device only.
          </Text>

          <Text style={styles.body}>
            We retain your data for as long as your account remains active. You may request
            deletion of all your data at any time from the Profile screen within the App.
          </Text>

          <Text style={styles.sectionTitle}>5. THIRD PARTY SERVICES</Text>

          <Text style={styles.body}>
            This App uses the following third-party services which may process your data:
          </Text>

          <Text style={styles.bulletItem}>
            • Google Firebase Authentication: Manages your account login credentials
            and session tokens. Governed by Google's Privacy Policy.
          </Text>

          <Text style={styles.bulletItem}>
            • Google Firebase Firestore: Stores your mood entries, PHQ-9 assessments,
            consent records, and aggregated sensor data in Google's cloud infrastructure.
          </Text>

          <Text style={styles.bulletItem}>
            • Google Firebase (General): Subject to Google LLC's Terms of Service
            and Privacy Policy available at https://policies.google.com.
          </Text>

          <Text style={styles.bulletItem}>
            • Notifee (by Invertase): Used to schedule and display local push
            notifications on your device. Notification data is processed locally and not
            transmitted to external servers.
          </Text>

          <Text style={styles.body}>
            We do not sell, rent, or share your personal data with any third party outside of
            the service providers listed above. We do not use your data for advertising purposes.
          </Text>

          <Text style={styles.sectionTitle}>6. SENSOR COLLECTION & PERMISSIONS</Text>

          <Text style={styles.body}>
            By tapping "I Understand", you consent to the immediate enabling of the following
            device sensors: location services (foreground and background), accelerometer, and
            microphone metering. These sensors will begin collecting data as described in
            Section 2 above.
          </Text>

          <Text style={styles.body}>
            You may disable any individual sensor at any time by navigating to Profile → Settings
            within the App. Disabling a sensor will stop future data collection for that sensor
            but will not delete previously collected data unless you use the data deletion
            options in your Profile.
          </Text>

          <Text style={styles.sectionTitle}>7. YOUR RIGHTS</Text>

          <Text style={styles.body}>
            You have the following rights regarding your personal data:
          </Text>

          <Text style={styles.bulletItem}>
            • Right to Access: You may export a CSV copy of all your stored data
            from Profile → Export Data.
          </Text>

          <Text style={styles.bulletItem}>
            • Right to Deletion: You may clear your mood history from Profile →
            Clear Mood History, or permanently delete your account and all associated data from
            Profile → Delete Account.
          </Text>

          <Text style={styles.bulletItem}>
            • Right to Withdraw Consent: You may stop all sensor collection at
            any time by disabling sensors in Profile → Settings. Note that withdrawal of
            consent does not affect the lawfulness of processing carried out prior to withdrawal.
          </Text>

          <Text style={styles.bulletItem}>
            • Right to Query: If you have questions about how your data is processed,
            you may contact the research team via the details provided within the App.
          </Text>

          <Text style={styles.sectionTitle}>8. MENTAL HEALTH DISCLAIMER</Text>

          <Text style={styles.body}>
            The PHQ-9 assessments and Wellbeing Score provided by this App are screening tools
            only and do not constitute a medical diagnosis. Results should not be used as a
            substitute for professional medical advice, diagnosis, or treatment. If you are
            experiencing a mental health crisis, please contact emergency services or a qualified
            healthcare professional immediately.
          </Text>

          <Text style={styles.sectionTitle}>9. CHANGES TO THIS AGREEMENT</Text>

          <Text style={styles.body}>
            We reserve the right to update this Agreement at any time. Material changes will
            be communicated via an in-app notification. Continued use of the App following
            notification of changes constitutes acceptance of the updated Agreement.
          </Text>

          <Text style={styles.sectionTitle}>10. ACKNOWLEDGEMENT</Text>

          <Text style={styles.body}>
            By tapping the button below you confirm that: (i) you are at least 18 years of age
            or have obtained parental/guardian consent; (ii) you have read and understood this
            Agreement in its entirety; (iii) you freely and explicitly consent to the collection
            and processing of your personal data as described above; and (iv) you understand
            that certain sensor data collection will begin immediately upon confirmation.
          </Text>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              hasScrolledToBottom ? styles.buttonEnabled : styles.buttonDisabled,
            ]}
            onPress={onConsent}
            disabled={!hasScrolledToBottom}
            accessibilityRole="button"
            accessibilityLabel="I Understand — I have read and agree to the above"
          >
            <Text style={styles.buttonText}>
              I Understand — I have read and agree to the above
            </Text>
          </TouchableOpacity>
          <Text style={styles.lastUpdated}>Last updated: June 2025</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 16,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
  },
  buttonEnabled: {
    opacity: 1,
    backgroundColor: theme.colors.primary,
  },
  buttonDisabled: {
    opacity: 0.35,
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
  },
  lastUpdated: {
    fontSize: 11,
    color: "#aaa",
    marginTop: 8,
    textAlign: "center",
  },
  sectionTitle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 13,
    color: theme.colors.textPrimary,
    marginTop: 24,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  body: {
    fontFamily: "PoppinsRegular",
    fontSize: 12.5,
    color: "#444",
    lineHeight: 19,
    marginBottom: 8,
  },
  bulletItem: {
    fontFamily: "PoppinsRegular",
    fontSize: 12.5,
    color: "#444",
    lineHeight: 19,
    marginBottom: 4,
    paddingLeft: 12,
  },
})
