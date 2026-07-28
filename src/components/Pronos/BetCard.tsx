import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bet, Match } from '@/types/models';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { router } from 'expo-router';
import { getMatchFromId } from '@/src/api/services/firestore/matchService';

interface BetCardProps {
  bet: Bet;
  match?: Match;
  onPress?: () => void;
}

const BetCard: React.FC<BetCardProps> = ({ bet, match: providedMatch, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [match, setMatch] = useState<Match | null>(providedMatch || null);
  const [isLoading, setIsLoading] = useState(!providedMatch);

  useEffect(() => {
    if (!providedMatch) {
      const fetchMatch = async () => {
        try {
          const fetchedMatch = await getMatchFromId(bet.match_id);
          setMatch(fetchedMatch);
        } catch (error) {
          console.error('Error fetching match for bet:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMatch();
    }
  }, [bet.match_id, providedMatch]);

  if (isLoading) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>Chargement...</Text>
        </View>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
          Match introuvable
        </Text>
      </View>
    );
  }

  // Format team names
  const team1Name = match.teams[0]?.id || 'Équipe 1';
  const team2Name = match.teams[1]?.id || 'Équipe 2';
  
  // Format scores
  const formatScore = (score: number | number[] | undefined): string => {
    if (score === undefined) return '?';
    if (Array.isArray(score)) {
      return score.join('-');
    }
    return score.toString();
  };

  const predictedTeam1Score = formatScore(bet.predicted_team1_score);
  const predictedTeam2Score = formatScore(bet.predicted_team2_score);
  const actualTeam1Score = formatScore(match.teams[0]?.score);
  const actualTeam2Score = formatScore(match.teams[1]?.score);

  // Determine card style based on status
  const getCardStyle = () => {
    switch (bet.status) {
      case 'won':
        return [styles.container, styles.wonContainer, isDark && styles.wonContainerDark];
      case 'lost':
        return [styles.container, styles.lostContainer, isDark && styles.lostContainerDark];
      case 'pending':
      default:
        return [styles.container, isDark && styles.containerDark];
    }
  };

  // Get status text
  const getStatusText = () => {
    switch (bet.status) {
      case 'won':
        return 'Gagné';
      case 'lost':
        return 'Perdu';
      case 'pending':
        return 'En attente';
      case 'calculating':
        return 'Calcul...';
      default:
        return '';
    }
  };

  // Format match date
  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // If match is in the future
    if (diff < 0) {
      const days = Math.ceil(Math.abs(diff) / (1000 * 60 * 60 * 24));
      if (days === 0) {
        return 'Aujourd\'hui';
      } else if (days === 1) {
        return 'Demain';
      } else {
        return `Dans ${days} jours`;
      }
    }
    
    // If match is today
    if (diff < 1000 * 60 * 60 * 24) {
      return 'Aujourd\'hui';
    }
    
    // Otherwise, show date
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <TouchableOpacity
      style={getCardStyle()}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      {/* Match info */}
      <View style={styles.matchInfo}>
        <View style={styles.teamsContainer}>
          <Text style={[styles.teamName, isDark && styles.teamNameDark]} numberOfLines={1}>
            {team1Name}
          </Text>
          <Text style={styles.vsText}>vs</Text>
          <Text style={[styles.teamName, isDark && styles.teamNameDark]} numberOfLines={1}>
            {team2Name}
          </Text>
        </View>
        
        <Text style={[styles.matchDate, isDark && styles.matchDateDark]}>
          {formatDate(match.start_time)}
        </Text>
      </View>

      {/* Prediction */}
      <View style={styles.predictionContainer}>
        <Text style={[styles.predictionLabel, isDark && styles.predictionLabelDark]}>
          Ma prédiction:
        </Text>
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, isDark && styles.scoreTextDark]}>
            {predictedTeam1Score}
          </Text>
          <Text style={[styles.scoreSeparator, isDark && styles.scoreSeparatorDark]}> - </Text>
          <Text style={[styles.scoreText, isDark && styles.scoreTextDark]}>
            {predictedTeam2Score}
          </Text>
        </View>
      </View>

      {/* Actual result (if available) */}
      {match.status === 'completed' && (
        <View style={styles.resultContainer}>
          <Text style={[styles.resultLabel, isDark && styles.resultLabelDark]}>
            Résultat:
          </Text>
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, styles.actualScoreText, isDark && styles.scoreTextDark]}>
              {actualTeam1Score}
            </Text>
            <Text style={[styles.scoreSeparator, isDark && styles.scoreSeparatorDark]}> - </Text>
            <Text style={[styles.scoreText, styles.actualScoreText, isDark && styles.scoreTextDark]}>
              {actualTeam2Score}
            </Text>
          </View>
        </View>
      )}

      {/* Points and status */}
      <View style={styles.footerContainer}>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, isDark && styles.statusTextDark]}>
            {getStatusText()}
          </Text>
        </View>
        
        <View style={styles.pointsContainer}>
          <Text style={[styles.pointsLabel, isDark && styles.pointsLabelDark]}>
            Points:
          </Text>
          <Text style={[styles.pointsValue, isDark && styles.pointsValueDark]}>
            {bet.points}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#e0e0e0',
  },
  containerDark: {
    backgroundColor: '#2d2d2d',
    shadowColor: '#fff',
    borderLeftColor: '#424242',
  },
  wonContainer: {
    borderLeftColor: '#4caf50',
  },
  wonContainerDark: {
    borderLeftColor: '#66bb6a',
  },
  lostContainer: {
    borderLeftColor: '#f44336',
  },
  lostContainerDark: {
    borderLeftColor: '#ef5350',
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
  errorText: {
    color: '#f44336',
    textAlign: 'center',
    padding: 20,
  },
  errorTextDark: {
    color: '#ef5350',
  },
  matchInfo: {
    marginBottom: 12,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  teamNameDark: {
    color: '#fff',
  },
  vsText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  matchDate: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  matchDateDark: {
    color: '#aaa',
  },
  predictionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 8,
  },
  predictionLabel: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  predictionLabelDark: {
    color: '#fff',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  scoreTextDark: {
    color: '#fff',
  },
  actualScoreText: {
    fontSize: 16,
  },
  scoreSeparator: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  scoreSeparatorDark: {
    color: '#aaa',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  resultLabel: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  resultLabelDark: {
    color: '#fff',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statusContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statusTextDark: {
    color: '#aaa',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#666',
  },
  pointsLabelDark: {
    color: '#aaa',
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  pointsValueDark: {
    color: '#bb86fc',
  },
});

export default BetCard;
