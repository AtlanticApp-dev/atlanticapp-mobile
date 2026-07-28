import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LeaderboardEntry } from '@/types/models';
import LeaderboardItem from './LeaderboardItem';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import ScreenLoader from '../ScreenLoader';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  title?: string;
  showTitle?: boolean;
  onPressEntry?: (entry: LeaderboardEntry) => void;
  limit?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  currentUserId,
  title,
  showTitle = true,
  onPressEntry,
  limit,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const displayEntries = limit ? entries.slice(0, limit) : entries;

  const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const isCurrentUser = currentUserId && item.user_id === currentUserId;
    
    return (
      <TouchableOpacity
        onPress={() => onPressEntry?.(item)}
        activeOpacity={0.7}
        disabled={!onPressEntry}
      >
        <LeaderboardItem
          entry={item}
          position={index + 1}
          isCurrentUser={isCurrentUser}
        />
      </TouchableOpacity>
    );
  };

  const ListHeaderComponent = () => (
    <View style={styles.headerContainer}>
      {showTitle && (
        <Text style={[styles.title, isDark && styles.titleDark]}>
          {title || 'Classement Général'}
        </Text>
      )}
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, styles.rankHeader, isDark && styles.headerTextDark]}>
          Rang
        </Text>
        <Text style={[styles.headerText, styles.nameHeader, isDark && styles.headerTextDark]}>
          Utilisateur
        </Text>
        <View style={styles.statsHeader}>
          <Text style={[styles.headerText, isDark && styles.headerTextDark]}>
            Points
          </Text>
        </View>
      </View>
    </View>
  );

  if (!entries || entries.length === 0) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
            Aucun classement disponible
          </Text>
          <Text style={[styles.emptySubtext, isDark && styles.emptyTextDark]}>
            Soyez le premier à parier sur des matchs !
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FlatList
        data={displayEntries}
        keyExtractor={(item) => item.user_id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  containerDark: {
    backgroundColor: '#1e1e1e',
  },
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  titleDark: {
    color: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  headerTextDark: {
    color: '#aaa',
  },
  rankHeader: {
    width: 40,
    textAlign: 'center',
  },
  nameHeader: {
    flex: 1,
    marginLeft: 52,
  },
  statsHeader: {
    width: 120,
    textAlign: 'right',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyTextDark: {
    color: '#aaa',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Leaderboard;
