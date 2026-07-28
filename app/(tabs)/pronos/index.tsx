import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { useGeneralLeaderboard, useAllSportsLeaderboards, useUserBetStats } from '@/src/api/services/firestore/betService';
import { Leaderboard, SportLeaderboardCard, Onboarding, MyBetsPreview, EmptyState } from '@/src/components/Pronos';
import ScreenLoader from '@/src/components/ScreenLoader';
import { router } from 'expo-router';

const PronosHomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  // Fetch onboarding status
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('pronosOnboardingCompleted');
        setOnboardingCompleted(value === 'true');
      } catch (error) {
        console.error('Error reading onboarding status:', error);
        setOnboardingCompleted(true); // Assume completed on error
      }
    };

    // Check auth state
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    checkOnboarding();

    return () => unsubscribe();
  }, []);

  // Fetch leaderboards
  const { data: generalLeaderboard, isLoading: isLoadingGeneral } = useGeneralLeaderboard(20);
  const { data: sportsLeaderboards, isLoading: isLoadingSports } = useAllSportsLeaderboards();
  const { data: userStats } = useUserBetStats(user?.uid || null);

  const handleOnboardingComplete = () => {
    setOnboardingCompleted(true);
  };

  const handleLoginPress = () => {
    // Navigate to login screen
    // For now, we'll just show an alert
    // In production, you'd navigate to your login screen
    router.navigate('/other');
  };

  const handleCreateAccountPress = () => {
    // Navigate to create account screen
    router.navigate('/other');
  };

  if (onboardingCompleted === null) {
    // Loading onboarding status
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <ScreenLoader />
      </SafeAreaView>
    );
  }

  // Show onboarding if not completed
  if (!onboardingCompleted) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <Onboarding onComplete={handleOnboardingComplete} />
      </SafeAreaView>
    );
  }

  // Loading data
  if (isLoadingGeneral || isLoadingSports) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <ScreenLoader />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // No leaderboard data available
  if (!generalLeaderboard) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <EmptyState
            title="Aucun classement disponible"
            message="Aucun pari n'a encore été placé. Soyez le premier à parier !"
            showLoginPrompt={!user}
            onLoginPress={handleLoginPress}
          />
          
          {!user && (
            <View style={styles.authPromptContainer}>
              <TouchableOpacity
                style={[styles.authButton, styles.loginButton]}
                onPress={handleLoginPress}
              >
                <Text style={styles.authButtonText}>Se connecter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authButton, styles.signupButton]}
                onPress={handleCreateAccountPress}
              >
                <Text style={[styles.authButtonText, styles.signupButtonText]}>
                  Créer un compte
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          Classements Pronostics
        </Text>

        {/* General Leaderboard */}
        <View style={styles.leaderboardContainer}>
          <Leaderboard
            entries={generalLeaderboard}
            currentUserId={user?.uid}
            title="Classement Général"
            limit={10}
          />
        </View>

        {/* Sport Leaderboards */}
        {sportsLeaderboards && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
              Classement par Sport
            </Text>
            {sportsLeaderboards.map((sportLeaderboard) => (
              <SportLeaderboardCard
                key={sportLeaderboard.sport_id}
                leaderboard={sportLeaderboard}
                currentUserId={user?.uid}
              />
            ))}
          </View>
        )}

        {/* User-specific content */}
        {user ? (
          // Connected user - show their bets preview
          userStats && (
            <MyBetsPreview userId={user.uid} limit={3} />
          )
        ) : (
          // Not connected - prompt to create account
          <View style={[styles.authPromptCard, isDark && styles.authPromptCardDark]}>
            <Text style={[styles.authPromptTitle, isDark && styles.authPromptTitleDark]}>
              Vous n'êtes pas connecté
            </Text>
            <Text style={[styles.authPromptMessage, isDark && styles.authPromptMessageDark]}>
              Créez un compte ou connectez-vous pour commencer à parier
              et apparaître dans les classements.
            </Text>
            <View style={styles.authButtonsContainer}>
              <TouchableOpacity
                style={[styles.authButton, styles.loginButton]}
                onPress={handleLoginPress}
              >
                <Text style={styles.authButtonText}>Se connecter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authButton, styles.signupButton]}
                onPress={handleCreateAccountPress}
              >
                <Text style={[styles.authButtonText, styles.signupButtonText]}>
                  Créer un compte
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  headerTitleDark: {
    color: '#fff',
  },
  leaderboardContainer: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionTitleDark: {
    color: '#fff',
  },
  authPromptCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  authPromptCardDark: {
    backgroundColor: '#2d2d2d',
    shadowColor: '#fff',
  },
  authPromptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  authPromptTitleDark: {
    color: '#fff',
  },
  authPromptMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  authPromptMessageDark: {
    color: '#aaa',
  },
  authButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  authButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6200ee',
  },
  signupButton: {
    backgroundColor: '#6200ee',
  },
  authButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6200ee',
  },
  signupButtonText: {
    color: 'white',
  },
  authPromptContainer: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
});

export default PronosHomeScreen;
