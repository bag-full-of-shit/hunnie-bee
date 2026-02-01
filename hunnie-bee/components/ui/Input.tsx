import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Colors, Spacing, FontSize } from '../../constants';

interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={Colors.gray400}
        {...props}
      />
      {(helperText || error) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: FontSize.bodyS,
    fontWeight: '500',
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  input: {
    height: 48,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 8,
    paddingHorizontal: Spacing.base,
    fontSize: FontSize.body,
    color: Colors.gray700,
  },
  inputError: {
    borderColor: Colors.error,
  },
  helperText: {
    fontSize: FontSize.caption,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  errorText: {
    color: Colors.error,
  },
});
