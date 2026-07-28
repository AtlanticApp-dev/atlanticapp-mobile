import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BetUserStats } from '@/types/models';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PronosHeaderProps {
  userStats?: BetUserStats | null;
  showStats?: boolean;
  showCreateBetButton?: boolean;
}

const PronosHeader: React.FC<PronosHeaderProps> = ({
  userStats,
  showStats = true,
  showCreateBetButton = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleCreateBetPress = () => {
    router.navigate('/pronos/create');
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Pronostics</Text>
        {showStats && userStats && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                {userStats.total_points}
              </Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                pts
              </Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                {userStats.total_bets}
              </Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                paris
              </Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.wonStatValue, isDark && styles.statValueDark]}>
                {userStats.correct_predictions}
              </Text>
              <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
                gagnés
              </Text>
            </View>
          </View>
        )}
      </View>

      {showCreateBetButton && (
        <TouchableOpacity style={[styles.button, isDark && styles.buttonDark]} onPress={handleCreateBetPress}>
          <Icon name="add" size={20} color="white" />
          <Text style={styles.buttonText}>Nouveau pari</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  containerDark: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  titleDark: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  wonStatValue: {
    color: '#4caf50',
  },
  statValueDark: {
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
  },
  statLabelDark: {
    color: '#aaa',
  },
  statSeparator: {
    width: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#6200ee',
    borderRadius: 8,
  },
  buttonDark: {
    backgroundColor: '#6200ee',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PronosHeader;
