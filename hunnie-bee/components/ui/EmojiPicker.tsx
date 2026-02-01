import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DEFAULT_EMOJIS, Colors, Spacing } from '../../constants';

interface EmojiPickerProps {
  selectedEmoji: string;
  onSelect: (emoji: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  selectedEmoji,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>아이콘 선택</Text>
      <View style={styles.grid}>
        {DEFAULT_EMOJIS.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={[
              styles.emojiButton,
              selectedEmoji === emoji && styles.selectedButton,
            ]}
            onPress={() => onSelect(emoji)}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray700,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  emojiButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: Colors.gray100,
  },
  selectedButton: {
    backgroundColor: Colors.honey200,
    borderWidth: 2,
    borderColor: Colors.honey500,
  },
  emoji: {
    fontSize: 24,
  },
});
