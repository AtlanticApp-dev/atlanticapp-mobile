import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LeaderboardEntry } from '@/types/models';
import { Colors } from '@/src/constants/Colors';
import { useColorScheme } from '@/src/hooks/useColorScheme';

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  position: number;
  isCurrentUser?: boolean;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ entry, position, isCurrentUser }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <View style={[styles.container, isCurrentUser && styles.currentUserContainer]}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rankText, position <= 3 && styles.topThreeRank]}>
          {position}
        </Text>
      </View>
      
      <View style={styles.infoContainer}>
        {entry.avatar ? (
          <Image source={{ uri: entry.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, isDark && styles.avatarPlaceholderDark]}>
            <Text style={styles.avatarText}>{entry.display_name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        
        <View style={styles.nameContainer}>
          <Text style={[styles.nameText, isDark && styles.nameTextDark]}>
            {entry.display_name}
          </Text>
          {entry.delegation_id && (
            <Text style={[styles.delegationText, isDark && styles.delegationTextDark]}>
              {entry.delegation_id}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDark && styles.statValueDark]}>
            {entry.total_points}
          </Text>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
            pts
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDark && styles.statValueDark]}>
            {entry.correct_predictions}
          </Text>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
            bon
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, isDark && styles.statValueDark]}>
            {entry.total_bets}
          </Text>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>
            paris
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  currentUserContainer: {
    backgroundColor: '#fff8e1',
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  topThreeRank: {
    color: '#ffc107',
    fontSize: 18,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderDark: {
    backgroundColor: '#424242',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nameTextDark: {
    color: '#fff',
  },
  delegationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  delegationTextDark: {
    color: '#aaa',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
});

export default LeaderboardItem;
