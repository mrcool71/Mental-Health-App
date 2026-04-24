import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import profileStyles from "../styles/profile.styles";

interface TextPromptModalProps {
  visible: boolean;
  title: string;
  message?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText: string;
  cancelText?: string;
  secureTextEntry?: boolean;
  confirmDisabled?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const TextPromptModal: React.FC<TextPromptModalProps> = ({
  visible,
  title,
  message,
  placeholder,
  value,
  onChangeText,
  onCancel,
  onConfirm,
  confirmText,
  cancelText = "Cancel",
  secureTextEntry,
  confirmDisabled,
  autoCapitalize = "words",
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={profileStyles.modalBackdrop}
      >
        <View style={profileStyles.modalCard}>
          <Text style={profileStyles.modalTitle}>{title}</Text>
          {message ? (
            <Text style={profileStyles.modalMessage}>{message}</Text>
          ) : null}
          <TextInput
            accessibilityLabel={title}
            autoCapitalize={autoCapitalize}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#8A9E9B"
            secureTextEntry={secureTextEntry}
            style={profileStyles.modalInput}
            value={value}
          />
          <View style={profileStyles.modalActions}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={onCancel}
              style={profileStyles.modalButton}
            >
              <Text style={profileStyles.modalButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={confirmDisabled}
              onPress={onConfirm}
              style={[
                profileStyles.modalButton,
                profileStyles.modalButtonPrimary,
                confirmDisabled && profileStyles.modalButtonDisabled,
              ]}
            >
              <Text style={profileStyles.modalButtonTextPrimary}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default TextPromptModal;
