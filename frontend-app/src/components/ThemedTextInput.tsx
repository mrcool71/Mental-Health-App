import React from "react";
import { Text, TextInput, View } from "react-native";
import styles from "../styles/input.styles";
import { ThemedTextInputProps } from "../types/ui";

// Inputs rely on src/styles/input.styles.ts for layout and src/theme/theme.ts tokens.
const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  label,
  value,
  placeholder,
  helperText,
  secureTextEntry,
  onChangeText,
  accessibilityLabel,
}) => (
  <TextInput
    value={value}
    placeholder={placeholder}
    secureTextEntry={secureTextEntry}
    onChangeText={onChangeText}
    accessibilityLabel={accessibilityLabel}
    accessible
    style={styles.input}
  />
);

export const ThemedTextField: React.FC<ThemedTextInputProps> = (props) => (
  <View style={styles.container}>
    <Text style={styles.label}>{props.label}</Text>
    <ThemedTextInput {...props} />
    {props.helperText ? (
      <Text style={styles.helper}>{props.helperText}</Text>
    ) : null}
  </View>
);

export default ThemedTextInput;
