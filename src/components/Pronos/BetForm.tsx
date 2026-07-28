import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Match, Bet } from '@/types/models';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface BetFormProps {
  match: Match;
  betId?: string;
  initialTeam1Score?: number | number[];
  initialTeam2Score?: number | number[];
  onSubmit: (team1Score: number | number[], team2Score: number | number[]) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const BetForm: React.FC<BetFormProps> = ({
  match,
  betId,
  initialTeam1Score,
  initialTeam2Score,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [team1Score, setTeam1Score] = useState<string>(
    initialTeam1Score !== undefined ? formatScore(initialTeam1Score) : ''
  );
  const [team2Score, setTeam2Score] = useState<string>(
    initialTeam2Score !== undefined ? formatScore(initialTeam2Score) : ''
  );
  const [error, setError] = useState<string | null>(null);
  
  // Check if match has already started
  const matchStarted = match.status === 'live' || match.status === 'completed';
  const isDisabled = matchStarted || isSubmitting;

  // Determine if it's a sets-based sport
  const isSetsSport = match.type === 'ranked_match' || 
                     (match.teams[0]?.score && Array.isArray(match.teams[0]?.score));

  // Format score for display
  const formatScore = (score: number | number[] | undefined): string => {
    if (score === undefined) return '';
    if (Array.isArray(score)) {
      return score.join('-');
    }
    return score.toString();
  };

  // Parse score from string
  const parseScore = (scoreStr: string): number | number[] => {
    if (!scoreStr) {
      if (isSetsSport) {
        // Default for sets sport: 2-1
        return [2, 1];
      }
      return 0;
    }
    
    // Check if it's a sets format (contains '-')
    if (scoreStr.includes('-')) {
      const parts = scoreStr.split('-').map(s => {
        const num = parseInt(s.trim(), 10);
        return isNaN(num) ? 0 : num;
      });
      return parts.length === 1 ? [parts[0]] : parts;
    }
    
    const num = parseInt(scoreStr, 10);
    return isNaN(num) ? (isSetsSport ? [0, 0] : 0) : num;
  };

  // Validate scores
  const validateScores = (): boolean => {
    if (!team1Score || !team2Score) {
      setError('Veuillez entrer les scores pour les deux équipes');
      return false;
    }
    
    const parsed1 = parseScore(team1Score);
    const parsed2 = parseScore(team2Score);
    
    if (isSetsSport) {
      if (!Array.isArray(parsed1) || !Array.isArray(parsed2)) {
        setError('Format de score invalide pour ce sport');
        return false;
      }
    } else {
      if (typeof parsed1 !== 'number' || typeof parsed2 !== 'number') {
        setError('Format de score invalide');
        return false;
      }
      
      if (parsed1 < 0 || parsed2 < 0) {
        setError('Les scores doivent être positifs');
        return false;
      }
    }
    
    setError(null);
    return true;
  };

  // Handle submit
  const handleSubmit = () => {
    if (!validateScores()) return;
    
    const parsedTeam1 = parseScore(team1Score);
    const parsedTeam2 = parseScore(team2Score);
    
    onSubmit(parsedTeam1, parsedTeam2);
  };

  // Auto-fill with match time info if available
  useEffect(() => {
    // If this is a ranked match (sets sport) and no initial values, pre-fill with common scores
    if (isSetsSport && !initialTeam1Score && !initialTeam2Score) {
      setTeam1Score('2-1');
      setTeam2Score('1-2');
    }
  }, [isSetsSport, initialTeam1Score, initialTeam2Score]);

  // Format team names
  const team1Name = match.teams[0]?.id || 'Équipe 1';
  const team2Name = match.teams[1]?.id || 'Équipe 2';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>
        {betId ? 'Modifier mon pari' : 'Nouveau pari'}
      </Text>

      {/* Match info */}
      <View style={styles.matchInfo}>
        <Text style={[styles.matchInfoText, isDark && styles.matchInfoTextDark]}>
          {team1Name} vs {team2Name}
        </Text>
        {match.start_time && (
          <Text style={[styles.matchDate, isDark && styles.matchDateDark]}>
            {new Date(match.start_time).toLocaleString('fr-FR', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
      </View>

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={16} color="#f44336" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Score inputs */}
      <View style={styles.inputContainer}>
        <View style={styles.teamInput}>
          <Text style={[styles.teamLabel, isDark && styles.teamLabelDark]}>
            {team1Name}
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            value={team1Score}
            onChangeText={setTeam1Score}
            placeholder={isSetsSport ? '2-1' : '0'}
            placeholderTextColor={isDark ? '#999' : '#666'}
            keyboardType="numeric"
            editable={!isDisabled}
          />
        </View>

        <Text style={styles.vsText}>-</Text>

        <View style={styles.teamInput}>
          <Text style={[styles.teamLabel, isDark && styles.teamLabelDark]}>
            {team2Name}
          </Text>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            value={team2Score}
            onChangeText={setTeam2Score}
            placeholder={isSetsSport ? '1-2' : '0'}
            placeholderTextColor={isDark ? '#999' : '#666'}
            keyboardType="numeric"
            editable={!isDisabled}
          />
        </View>
      </View>

      {isSetsSport && (
        <Text style={[styles.helpText, isDark && styles.helpTextDark]}>
          Format: sets gagnés par chaque équipe (ex: 2-1)
        </Text>
      )}

      {/* Warning if match started */}
      {matchStarted && (
        <View style={styles.warningContainer}>
          <Icon name="warning" size={16} color="#ff9800" />
          <Text style={styles.warningText}>
            Le match a déjà commencé. Vous ne pouvez plus modifier votre pari.
          </Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={isSubmitting}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Annuler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.submitButton, isDisabled && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isDisabled}
        >
          {isSubmitting ? (
            <Text style={styles.buttonText}>Envoi...</Text>
          ) : (
            <Text style={[styles.buttonText, isDisabled && styles.disabledButtonText]}>
              {betId ? 'Modifier' : 'Valider'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  containerDark: {
    backgroundColor: '#2d2d2d',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  titleDark: {
    color: '#fff',
  },
  matchInfo: {
    marginBottom: 20,
    alignItems: 'center',
  },
  matchInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  matchInfoTextDark: {
    color: '#fff',
  },
  matchDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  matchDateDark: {
    color: '#aaa',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#f44336',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  teamInput: {
    alignItems: 'center',
    gap: 8,
  },
  teamLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  teamLabelDark: {
    color: '#aaa',
  },
  vsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  input: {
    width: 80,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  inputDark: {
    borderColor: '#444',
    backgroundColor: '#3d3d3d',
    color: '#fff',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  helpTextDark: {
    color: '#aaa',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#ff9800',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    maxWidth: 150,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
  },
  submitButton: {
    backgroundColor: '#6200ee',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  cancelButtonText: {
    color: '#666',
  },
  disabledButtonText: {
    color: '#999',
  },
});

export default BetForm;
