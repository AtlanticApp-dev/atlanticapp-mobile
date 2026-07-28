import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import auth from '@react-native-firebase/auth';
import { useUserBets, useUserBetStats } from '@/src/api/services/firestore/betService';
import { BetCard, EmptyState, PronosHeader } from '@/src/components/Pronos';
import ScreenLoader from '@/src/components/ScreenLoader';
import { Bet } from '@/types/models';

const MyBetsScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'won' | 'lost'>('all');

  // Check auth state
  React.useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const { data: bets, isLoading, refetch } = useUserBets(user?.uid || null);
  const { data: userStats } = useUserBetStats(user?.uid || null);

  // Filter bets based on status
  const filteredBets = React.useMemo(() => {
    if (!bets) return [];
    
    switch (filter) {
      case 'pending':
        return bets.filter(b => b.status === 'pending');
      case 'won':
        return bets.filter(b => b.status === 'won');
      case 'lost':
        return bets.filter(b => b.status === 'lost');
      default:
        return bets;
    }
  }, [bets, filter]);

  const handleRefresh = () => {
    refetch();
  };

  const handleBetPress = (bet: Bet) => {
    // Navigate to bet detail or edit
    console.log('Bet pressed:', bet.id);
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <EmptyState
            title="Vous n'êtes pas connecté"
            message="Connectez-vous pour voir vos pronostics."
            showLoginPrompt
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
        <PronosHeader userStats={userStats} showStats />
        <View style={styles.loaderContainer}>
          <ScreenLoader />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.headerContainer}>
        <PronosHeader userStats={userStats} showStats showCreateBetButton />
      </View>

      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilterButton]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.activeFilterButtonText]}>
            Tous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'pending' && styles.activeFilterButton]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterButtonText, filter === 'pending' && styles.activeFilterButtonText]}>
            En attente
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'won' && styles.activeFilterButton]}
          onPress={() => setFilter('won')}
        >
          <Text style={[styles.filterButtonText, filter === 'won' && styles.activeFilterButtonText]}>
            Gagnés
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'lost' && styles.activeFilterButton]}
          onPress={() => setFilter('lost')}
        >
          <Text style={[styles.filterButtonText, filter === 'lost' && styles.activeFilterButtonText]}>
            Perdus
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bets list */}
      <View style={styles.listContainer}>
        {filteredBets.length === 0 ? (
          <EmptyState
            title="Aucun pronostic"
            message={`Aucun pronostic ${filter !== 'all' ? filter : ''}. Placez votre premier pari !`}
          />
        ) : (
          <FlatList
            data={filteredBets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BetCard bet={item} onPress={() => handleBetPress(item)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
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
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  activeFilterButton: {
    backgroundColor: '#6200ee',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default MyBetsScreen;
