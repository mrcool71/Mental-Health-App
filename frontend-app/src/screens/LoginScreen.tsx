import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { signIn, signUp } from "../services/auth";
import styles from "../styles/login.styles";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length >= 6 && (!isSignUp || confirmPassword.length >= 6);

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setError(null);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      // Navigation is handled by the auth state listener in navigation/index.tsx
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Something went wrong. Try again.";
      // Simplify Firebase error messages
      if (message.includes("auth/email-already-in-use")) {
        setError("An account with this email already exists.");
      } else if (message.includes("auth/invalid-credential")) {
        setError("Invalid email or password.");
      } else if (message.includes("auth/weak-password")) {
        setError("Password must be at least 6 characters.");
      } else if (message.includes("auth/invalid-email")) {
        setError("Please enter a valid email address.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.hero}>
        <View style={styles.mascot}>
          <Text style={styles.mascotEmoji}>{"\uD83D\uDE3A"}</Text>
        </View>
        <Text style={styles.title}>
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>
        <Text style={styles.subtitle}>
          {isSignUp
            ? "Sign up to sync your wellbeing data"
            : "Sign in to continue your journey"}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#8A9E9B"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        accessibilityLabel="Email address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#8A9E9B"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType={isSignUp ? "newPassword" : "password"}
        autoComplete={isSignUp ? "new-password" : "current-password"}
        accessibilityLabel="Password"
      />

      {isSignUp ? (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#8A9E9B"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          textContentType="newPassword"
          autoComplete="new-password"
          accessibilityLabel="Confirm Password"
        />
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[
          styles.primaryButton,
          !canSubmit && styles.primaryButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!canSubmit || loading}
        accessibilityRole="button"
        accessibilityLabel={isSignUp ? "Sign up" : "Sign in"}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setConfirmPassword("");
          }}
          accessibilityRole="button"
        >
          <Text style={styles.secondaryButtonText}>
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
