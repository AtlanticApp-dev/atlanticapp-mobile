import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bet } from '@/types/models';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { router } from 'expo-router';
import BetCard from './BetCard';
import { getUserBets } from '@/src/api/services/firestore/betService';
import { useQuery } from '@tanstack/react-query';

interface MyBetsPreviewProps {
  userId: string;
  limit?: number;
}

const MyBetsPreview: React.FC<MyBetsPreviewProps> = ({ userId, limit = 3 }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Fetch user bets
  const { data: bets, isLoading } = useQuery({
    queryKey: ['userBetsPreview', userId],
    queryFn: () => getUserBets(userId, limit),
    enabled: !!userId,
  });

  const handleSeeAllPress = () => {
    router.navigate('/pronos/myBets');
  };

  if (isLoading) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Mes Pronostics</Text>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>Chargement...</Text>
        </View>
      </View>
    );
  }

  if (!bets) {
    return null;
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Mes Pronostics</Text>
        <TouchableOpacity onPress={handleSeeAllPress}>
          <Text style={styles.seeAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContent}>
        {bets.map((bet) => (
          <BetCard key={bet.id} bet={bet} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  containerDark: {
    backgroundColor: '#2d2d2d',
    shadowColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  titleDark: {
    color: '#fff',
  },
  seeAllText: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
  },
  loadingTextDark: {
    color: '#aaa',
  },
});

export default MyBetsPreview;
