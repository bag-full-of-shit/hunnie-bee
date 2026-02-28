import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Spacing, FontSize, Colors } from '../../constants';

interface Props {
  emoji: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const OnboardingPage: React.FC<Props> = ({
  emoji,
  title,
  description,
  children,
}) => {
  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  emoji: {
    fontSize: 80,
    marginBottom: Spacing['2xl'],
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.gray800,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  description: {
    fontSize: FontSize.body,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 24,
  },
});
