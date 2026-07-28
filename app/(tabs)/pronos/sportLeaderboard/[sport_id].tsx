import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { useSportLeaderboard } from '@/src/api/services/firestore/betService';
import { Leaderboard } from '@/src/components/Pronos';
import ScreenLoader from '@/src/components/ScreenLoader';
import { getSportFromId } from '@/src/api/services/firestore/sportsService';
import auth from '@react-native-firebase/auth';

const SportLeaderboardScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams<{ sport_id: string }>();
  const sportId = params.sport_id;
  const [sport, setSport] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Check auth state
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Fetch sport info
  useEffect(() => {
    if (sportId) {
      const fetchSport = async () => {
        try {
          const sportData = await getSportFromId(sportId);
          setSport(sportData);
        } catch (error) {
          console.error('Error fetching sport:', error);
        }
      };
      fetchSport();
    }
  }, [sportId]);

  const { data: leaderboard, isLoading } = useSportLeaderboard(sportId || null, 50);

  if (!sportId || !sport) {
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

  if (isLoading) {
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

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          Classement - {sport.title}
        </Text>

        {/* Leaderboard */}
        <Leaderboard
          entries={leaderboard || []}
          currentUserId={user?.uid}
          title="Classement par Sport"
          showTitle={false}
        />
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  headerTitleDark: {
    color: '#fff',
  },
});

export default SportLeaderboardScreen;
