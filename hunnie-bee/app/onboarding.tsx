import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useBeeStore } from '../stores/beeStore';
import { OnboardingPage } from '../components/onboarding/OnboardingPage';
import { PageIndicator } from '../components/onboarding/PageIndicator';
import { Colors, Spacing, FontSize } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_PAGES = 3;

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const [beeName, setBeeName] = useState('Honey');
  const scrollRef = useRef<ScrollView>(null);
  const { completeOnboarding } = useOnboardingStore();
  const { renameBee } = useBeeStore();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleGetStarted = async () => {
    if (beeName.trim()) {
      await renameBee(beeName.trim());
    }
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        <OnboardingPage
          emoji="🎯"
          title="100 Small Achievements"
          description={"Build habits by completing goals just 100 times a year.\nThat's less than twice a week!\n\nNo daily streak pressure.\nJust steady progress."}
        />

        <OnboardingPage
          emoji="🐝"
          title="Meet Your Bee Companion"
          description={"Your bee grows with you.\nComplete goals to earn honey\nand strengthen your bond!\n\nTake care of your bee and\nwatch it evolve."}
        />

        <OnboardingPage
          emoji="🍯"
          title="Name Your Bee"
          description="Give your bee companion a name to get started!"
        >
          <View style={styles.nameInputContainer}>
            <TextInput
              style={styles.nameInput}
              value={beeName}
              onChangeText={setBeeName}
              placeholder="Enter bee name"
              placeholderTextColor={Colors.gray400}
              maxLength={20}
              autoFocus={false}
            />
            <TouchableOpacity
              style={[styles.startButton, !beeName.trim() && styles.startButtonDisabled]}
              onPress={handleGetStarted}
              disabled={!beeName.trim()}
            >
              <Text style={styles.startButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </OnboardingPage>
      </ScrollView>

      <View style={styles.indicatorContainer}>
        <PageIndicator totalPages={TOTAL_PAGES} currentPage={currentPage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.honey50,
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: Spacing.lg,
    zIndex: 10,
  },
  skipText: {
    fontSize: FontSize.body,
    color: Colors.honey600,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  nameInputContainer: {
    marginTop: Spacing['2xl'],
    width: '100%',
    alignItems: 'center',
  },
  nameInput: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.base,
    fontSize: FontSize.bodyL,
    color: Colors.gray800,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: Colors.honey200,
    marginBottom: Spacing.lg,
  },
  startButton: {
    backgroundColor: Colors.honey500,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing['3xl'],
    borderRadius: 16,
    width: '100%',
  },
  startButtonDisabled: {
    backgroundColor: Colors.gray300,
  },
  startButtonText: {
    fontSize: FontSize.bodyL,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
  indicatorContainer: {
    paddingBottom: 60,
    alignItems: 'center',
  },
});
