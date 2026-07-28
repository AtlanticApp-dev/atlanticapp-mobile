import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SportLeaderboard } from '@/types/models';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { router } from 'expo-router';

interface SportLeaderboardCardProps {
  leaderboard: SportLeaderboard;
  currentUserId?: string;
}

const SportLeaderboardCard: React.FC<SportLeaderboardCardProps> = ({
  leaderboard,
  currentUserId,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Get current user's entry in this sport leaderboard
  const currentUserEntry = leaderboard.entries.find(e => e.user_id === currentUserId);

  const handlePress = () => {
    router.navigate(`/pronos/sportLeaderboard/${leaderboard.sport_id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.container, isDark && styles.containerDark]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={[styles.sportTitle, isDark && styles.sportTitleDark]}>
          {leaderboard.sport_title}
        </Text>
        <Text style={styles.seeAllText}>Voir tout</Text>
      </View>

      <View style={styles.topThreeContainer}>
        {leaderboard.entries.slice(0, 3).map((entry, index) => (
          <View key={entry.user_id} style={[styles.podiumItem, index === 0 && styles.firstPlace, index === 1 && styles.secondPlace, index === 2 && styles.thirdPlace]}>
            <View style={styles.podiumRank}>
              <Text style={styles.podiumRankText}>{index + 1}</Text>
            </View>
            <View style={styles.podiumInfo}>
              <Text style={[styles.podiumName, isDark && styles.podiumNameDark]} numberOfLines={1}>
                {entry.display_name}
              </Text>
              <Text style={[styles.podiumPoints, isDark && styles.podiumPointsDark]}>
                {entry.total_points} pts
              </Text>
            </View>
          </View>
        ))}
      </View>

      {currentUserEntry && !leaderboard.entries.slice(0, 3).some(e => e.user_id === currentUserId) && (
        <View style={[styles.currentUserContainer, isDark && styles.currentUserContainerDark]}>
          <Text style={[styles.currentUserText, isDark && styles.currentUserTextDark]}>
            Votre position: #{currentUserEntry.position}
          </Text>
          <Text style={[styles.currentUserPoints, isDark && styles.currentUserPointsDark]}>
            {currentUserEntry.total_points} pts
          </Text>
        </View>
      )}
    </TouchableOpacity>
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
  sportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sportTitleDark: {
    color: '#fff',
  },
  seeAllText: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '500',
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  firstPlace: {
    backgroundColor: '#fff9c4',
  },
  secondPlace: {
    backgroundColor: '#f0f0f0',
  },
  thirdPlace: {
    backgroundColor: '#ffcc80',
  },
  podiumRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffc107',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  podiumRankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  podiumInfo: {
    alignItems: 'center',
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  podiumNameDark: {
    color: '#fff',
  },
  podiumPoints: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  podiumPointsDark: {
    color: '#aaa',
  },
  currentUserContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentUserContainerDark: {
    backgroundColor: '#3d3d3d',
  },
  currentUserText: {
    fontSize: 13,
    color: '#333',
  },
  currentUserTextDark: {
    color: '#fff',
  },
  currentUserPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  currentUserPointsDark: {
    color: '#bb86fc',
  },
});

export default SportLeaderboardCard;
