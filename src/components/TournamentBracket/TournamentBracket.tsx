import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { translatePhase } from '@/src/utils/matchMetadataTranslator';
import { useTeam } from '@/src/api/services/firestore/teamsService';
import { useDelegation } from '@/src/api/services/firestore/delegationService';

// Constantes pour le layout
const MATCH_CARD_HEIGHT = 100;
const MATCH_CARD_WIDTH = 200;
const ROUND_SPACING = 60;
const MATCH_VERTICAL_SPACING = 20;
const CONNECTOR_COLOR = '#ccc';

// Calcule la position Y du centre d'un match pour un alignement en pyramide
// totalHeight = matchCount * (MATCH_CARD_HEIGHT + MATCH_VERTICAL_SPACING)
// matchIndex = index du match dans sa phase
// matchCount = nombre total de matchs dans la phase
const calculateMatchCenterY = (
  totalHeight: number,
  matchIndex: number,
  matchCount: number
): number => {
  return (matchIndex + 0.5) * (totalHeight / matchCount);
};

// Calcule la position TOP d'un match (pour le positionnement)
const calculateMatchTopPosition = (
  totalHeight: number,
  matchIndex: number,
  matchCount: number
): number => {
  return calculateMatchCenterY(totalHeight, matchIndex, matchCount) - (MATCH_CARD_HEIGHT / 2);
};

// Interface pour une équipe
interface TeamInfo {
  id: string;
  name: string;
  score?: number | null;
}

// Interface pour un match dans le bracket
interface BracketMatch {
  id: string;
  phase: string;
  team1: TeamInfo | null;
  team2: TeamInfo | null;
  start_time?: Date | string | null;
  status: 'incoming' | 'live' | 'completed' | 'cancelled' | 'postponed';
  winner_id?: string | null;
  position: string;
  match_number: number;
}

// Interface pour un round (phase) dans le bracket
interface BracketRound {
  phase: string;
  label: string;
  matches: BracketMatch[];
}

// Interface pour l'arbre complet
interface BracketTree {
  rounds: BracketRound[];
}

// Interface pour les props du composant principal
interface TournamentBracketProps {
  allMatches: any[];
  onMatchPress?: (match: BracketMatch) => void;
}

// Ordre des phases de la plus précoce à la plus tardive
const PHASE_ORDER = ['16f', '8f', '4f', '2f', '3f', 'f'];

// Phases considérées comme finales pour l'arbre
const FINAL_PHASES = new Set(['16f', '8f', '4f', '2f', '3f', 'f']);

/**
 * Calcule le nombre de matchs attendus par phase pour un bracket complet
 */
const getExpectedMatchesPerPhase = (): Record<string, number> => {
  return {
    '16f': 16,
    '8f': 8,
    '4f': 4,
    '2f': 2,
    '3f': 1,
    'f': 1,
  };
};

/**
 * Crée un match vide (placeholder) pour les matchs non disponibles
 */
const createBlankMatch = (phase: string, matchNumber: number): BracketMatch => ({
  id: `blank-${phase}-${matchNumber}`,
  phase,
  team1: null,
  team2: null,
  status: 'incoming',
  position: matchNumber.toString(),
  match_number: matchNumber,
});

/**
 * Construit un match à partir des données de la base
 */
const createMatchFromData = (matchData: any, matchNumber: number): BracketMatch => {
  let team1: TeamInfo | null = null;
  let team2: TeamInfo | null = null;
  
  if (matchData.teams && Array.isArray(matchData.teams) && matchData.teams.length >= 2) {
    team1 = {
      id: matchData.teams[0].id || matchData.team1_id || `team1-${matchData.id}`,
      name: matchData.teams[0].name || matchData.teams[0].title || `Équipe 1`,
      score: matchData.teams[0].score,
    };
    team2 = {
      id: matchData.teams[1].id || matchData.team2_id || `team2-${matchData.id}`,
      name: matchData.teams[1].name || matchData.teams[1].title || `Équipe 2`,
      score: matchData.teams[1].score,
    };
  } else {
    team1 = matchData.team1_id ? {
      id: matchData.team1_id,
      name: matchData.team1?.name || matchData.team1?.title || `Équipe 1`,
      score: matchData.team1_score,
    } : null;
    
    team2 = matchData.team2_id ? {
      id: matchData.team2_id,
      name: matchData.team2?.name || matchData.team2?.title || `Équipe 2`,
      score: matchData.team2_score,
    } : null;
  }

  let winner_id: string | null = null;
  if (matchData.status === 'completed') {
    if (matchData.winner_id) {
      winner_id = matchData.winner_id;
    } else if (matchData.team1_score !== undefined && matchData.team2_score !== undefined) {
      if (matchData.team1_score > matchData.team2_score) {
        winner_id = team1?.id || null;
      } else if (matchData.team2_score > matchData.team1_score) {
        winner_id = team2?.id || null;
      }
    }
  }

  return {
    id: matchData.id,
    phase: matchData.phase || matchData.phase_id,
    team1,
    team2,
    team1_score: matchData.team1_score,
    team2_score: matchData.team2_score,
    start_time: matchData.start_time,
    status: matchData.status || 'incoming',
    winner_id: winner_id,
    position: matchNumber.toString(),
    match_number: matchNumber,
  };
};

/**
 * Construit l'arbre de tournoi à partir de la liste des matchs
 * Utilise l'Option B : structure implicite basée sur la phase et l'ordre
 * N'affiche que les phases à partir de la phase la plus précoce qui a des matchs
 */
export const buildTournamentBracket = (matches: any[]): BracketTree => {
  const rounds: BracketRound[] = [];
  const expectedMatchesPerPhase = getExpectedMatchesPerPhase();

  // Filtrer uniquement les phases finales
  const finalMatches = matches.filter(m => FINAL_PHASES.has(m.phase || m.phase_id));

  // Regrouper les matchs par phase
  const matchesByPhase: Record<string, any[]> = {};
  finalMatches.forEach(match => {
    const phase = match.phase || match.phase_id;
    if (!matchesByPhase[phase]) {
      matchesByPhase[phase] = [];
    }
    matchesByPhase[phase].push(match);
  });

  // Déterminer quelles phases sont présentes (au moins un match avec match_number défini)
  const presentPhases = PHASE_ORDER.filter(phase => {
    const phaseMatches = matchesByPhase[phase] || [];
    return phaseMatches.some(m => m.match_number !== undefined && m.match_number !== null);
  });
  
  if (presentPhases.length === 0) {
    return { rounds: [] };
  }

  // Trouver la phase la plus précoce qui a des matchs
  const firstPresentPhase = presentPhases[0];
  const firstPhaseIndex = PHASE_ORDER.indexOf(firstPresentPhase);
  
  // Ne garder que les phases à partir de la première présente
  const phasesToDisplay = PHASE_ORDER.slice(firstPhaseIndex);
  
  // Calculer le nombre attendu de matchs pour la première phase
  let expectedCount = expectedMatchesPerPhase[firstPresentPhase] || finalMatches.length;

  // Parcourir uniquement les phases à afficher
  for (const phase of phasesToDisplay) {
    const phaseMatches = matchesByPhase[phase] || [];
    
    // Filtrer les matchs qui ont un match_number défini et les trier par match_number croissant
    const matchesWithNumber = phaseMatches.filter(m => m.match_number !== undefined && m.match_number !== null);
    const sortedMatches = [...matchesWithNumber].sort((a, b) => (a.match_number || 0) - (b.match_number || 0));
    
    // Déterminer le nombre attendu de matchs pour cette phase
    // Si des matchs avec match_number existent, utiliser le max match_number
    // mais ne pas dépasser la limite maximale autorisée pour la phase
    let expectedForPhase = expectedMatchesPerPhase[phase] || expectedCount / 2;
    if (sortedMatches.length > 0) {
      const maxMatchNumber = Math.max(...sortedMatches.map(m => m.match_number || 0));
      const maxAllowed = expectedMatchesPerPhase[phase];
      // Limiter expectedForPhase à la valeur maximale autorisée pour la phase
      expectedForPhase = maxAllowed 
        ? Math.min(Math.max(expectedForPhase, maxMatchNumber), maxAllowed)
        : Math.max(expectedForPhase, maxMatchNumber);
    }
    
    // Créer les matchs pour ce round
    const bracketMatches: BracketMatch[] = [];
    
    // Créer les matchs réels ou des placeholders en utilisant match_number
    for (let i = 0; i < expectedForPhase; i++) {
      // Trouver le match avec match_number = i+1 (car match_number commence à 1)
      const matchWithNumber = sortedMatches.find(m => m.match_number === i + 1);
      
      if (matchWithNumber) {
        bracketMatches.push(createMatchFromData(matchWithNumber, i + 1));
      } else {
        bracketMatches.push(createBlankMatch(phase, i + 1));
      }
    }

    if (bracketMatches.length > 0) {
      rounds.push({
        phase,
        label: translatePhase(phase),
        matches: bracketMatches,
      });
    }

    expectedCount = Math.ceil(expectedCount / 2);
  }

  // Gérer le match pour la 3ème place
  // Il doit exister si on a des demi-finales (2f) dans les rounds
  const hasSemiFinals = rounds.some(r => r.phase === '2f');
  const hasThirdPlace = rounds.some(r => r.phase === '3f');
  
  if (hasSemiFinals && !hasThirdPlace) {
    const thirdPlaceMatch = createBlankMatch('3f', 1);
    rounds.push({
      phase: '3f',
      label: translatePhase('3f'),
      matches: [thirdPlaceMatch],
    });
  }

  return { rounds };
};

/**
 * Composant pour dessiner les connecteurs entre deux colonnes (phases) du bracket
 * Crée une fourche : 2 branches du côté de la phase inférieure, 1 branche du côté de la phase supérieure
 */
interface BracketColumnConnectorProps {
  currentRound: BracketRound;
  nextRound: BracketRound;
  totalHeight: number;
}

const BracketColumnConnector: React.FC<BracketColumnConnectorProps> = ({
  currentRound,
  nextRound,
  totalHeight,
}) => {
  const currentMatchCount = currentRound.matches.length;
  const nextMatchCount = nextRound.matches.length;

  // Calculer les positions des centres des matchs
  const currentCenters: number[] = [];
  for (let i = 0; i < currentMatchCount; i++) {
    currentCenters.push(calculateMatchCenterY(totalHeight, i, currentMatchCount));
  }

  const nextCenters: number[] = [];
  for (let i = 0; i < nextMatchCount; i++) {
    nextCenters.push(calculateMatchCenterY(totalHeight, i, nextMatchCount));
  }

  // Chaque match de la phase suivante est relié à 2 matchs de la phase actuelle
  // On dessine UNIQUEMENT des lignes VERTICALES et HORIZONTALES
  const connectors: JSX.Element[] = [];
  
  for (let nextIndex = 0; nextIndex < nextMatchCount; nextIndex++) {
    const nextCenterY = nextCenters[nextIndex];
    
    // Calculer les indices des matchs de la phase actuelle qui se connectent à ce match
    const currentIndex1 = nextIndex * 2;
    const currentIndex2 = nextIndex * 2 + 1;
    
    if (currentIndex2 < currentMatchCount) {
      const currentCenterY1 = currentCenters[currentIndex1];
      const currentCenterY2 = currentCenters[currentIndex2];
      
      // Mi-distance horizontale dans le connecteur
      const mid = ROUND_SPACING / 2;
      
      // Ligne 1 : HORIZONTALE à hauteur du milieu de match A, s'arrête à mi-distance
      connectors.push(
        <Line
          key={`connector-${nextRound.phase}-${nextIndex}-line1`}
          x1={0}
          y1={currentCenterY1}
          x2={mid}
          y2={currentCenterY1}
          stroke={CONNECTOR_COLOR}
          strokeWidth={2}
        />
      );
      
      // Ligne 2 : HORIZONTALE à hauteur du milieu de match B, s'arrête à mi-distance
      connectors.push(
        <Line
          key={`connector-${nextRound.phase}-${nextIndex}-line2`}
          x1={0}
          y1={currentCenterY2}
          x2={mid}
          y2={currentCenterY2}
          stroke={CONNECTOR_COLOR}
          strokeWidth={2}
        />
      );
      
      // Ligne 3 : VERTICALE qui rejoint les 2 lignes horizontales à mi-distance
      connectors.push(
        <Line
          key={`connector-${nextRound.phase}-${nextIndex}-line3`}
          x1={mid}
          y1={currentCenterY1}
          x2={mid}
          y2={currentCenterY2}
          stroke={CONNECTOR_COLOR}
          strokeWidth={2}
        />
      );
      
      // Ligne 4 : HORIZONTALE à hauteur du milieu du match supérieur, de mi-distance à la colonne suivante
      connectors.push(
        <Line
          key={`connector-${nextRound.phase}-${nextIndex}-line4`}
          x1={mid}
          y1={nextCenterY}
          x2={ROUND_SPACING}
          y2={nextCenterY}
          stroke={CONNECTOR_COLOR}
          strokeWidth={2}
        />
      );
    }
  }

  return (
    <View style={[styles.connectorColumnContainer, { height: totalHeight }]}>
      <Svg width={ROUND_SPACING} height={totalHeight}>
        {connectors}
      </Svg>
    </View>
  );
};

/**
 * Composant principal du bracket
 */
const TournamentBracket: React.FC<TournamentBracketProps> = ({ allMatches, onMatchPress }) => {
  const bracket = buildTournamentBracket(allMatches);

  if (!bracket || bracket.rounds.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucun match de phase finale disponible</Text>
      </View>
    );
  }

  // Calculer la hauteur totale basée sur la première phase (celle avec le plus de matchs)
  const firstRound = bracket.rounds[0];
  const totalHeight = firstRound.matches.length * MATCH_CARD_HEIGHT +
                     (firstRound.matches.length - 1) * MATCH_VERTICAL_SPACING;

  return (
    <ScrollView
      style={styles.outerScrollView}
      contentContainerStyle={styles.outerScrollContainer}
      showsVerticalScrollIndicator={true}
      nestedScrollEnabled={true}
    >
      <ScrollView
        horizontal={true}
        contentContainerStyle={[styles.bracketContainer, { minHeight: totalHeight }]}
        showsHorizontalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        {bracket.rounds.map((round, roundIndex) => (
          <React.Fragment key={`${round.phase}-${roundIndex}`}>
            <BracketRoundColumn
              round={round}
              roundIndex={roundIndex}
              totalRounds={bracket.rounds.length}
              allRounds={bracket.rounds}
              onMatchPress={onMatchPress}
              totalHeight={totalHeight}
            />
            {roundIndex < bracket.rounds.length - 1 && (
              <BracketColumnConnector
                currentRound={round}
                nextRound={bracket.rounds[roundIndex + 1]}
                totalHeight={totalHeight}
              />
            )}
          </React.Fragment>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

/**
 * Composant pour une colonne (un round/phase) du bracket
 */
interface BracketRoundColumnProps {
  round: BracketRound;
  roundIndex: number;
  totalRounds: number;
  allRounds: BracketRound[];
  onMatchPress?: (match: BracketMatch) => void;
  totalHeight: number;
}

const BracketRoundColumn: React.FC<BracketRoundColumnProps> = ({
  round,
  roundIndex,
  totalRounds,
  allRounds,
  onMatchPress,
  totalHeight,
}) => {
  const matchCount = round.matches.length;
  
  return (
    <View style={[styles.roundColumn, { height: totalHeight }]}>
      <Text style={styles.roundTitle}>{round.label}</Text>
      
      <View style={[styles.matchesContainer, { height: totalHeight }]}>
        {round.matches.map((match, matchIndex) => {
          const topPosition = calculateMatchTopPosition(totalHeight, matchIndex, matchCount);
          
          return (
            <View 
              key={`${match.id}-${matchIndex}`} 
              style={[styles.matchWrapper, { top: topPosition }]}
            >
              <BracketMatchCard
                match={match}
                onPress={() => onMatchPress?.(match)}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

/**
 * Composant pour afficher un match
 */
interface BracketMatchCardProps {
  match: BracketMatch;
  onPress: () => void;
}

const BracketMatchCard: React.FC<BracketMatchCardProps> = ({ match, onPress }) => {
  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';
  const isBlank = match.team1 === null && match.team2 === null;

  const {
    data: team1,
    isLoading: isTeam1Loading,
    error: team1Error,
  } = useTeam(match.team1?.id || '');

  const {
    data: team2,
    isLoading: isTeam2Loading,
    error: team2Error,
  } = useTeam(match.team2?.id || '');

  const {
    data: delegation1,
    isLoading: isDelegation1Loading,
    error: delegation1Error,
  } = useDelegation(team1?.delegation_id || '');

  const {
    data: delegation2,
    isLoading: isDelegation2Loading,
    error: delegation2Error,
  } = useDelegation(team2?.delegation_id || '');

  const winner = match.winner_id 
    ? (match.team1?.id === match.winner_id ? match.team1 : match.team2)
    : null;


  return (
    <TouchableOpacity
      style={[
        styles.matchCard,
        isCompleted && styles.matchCompleted,
        isLive && styles.matchLive,
        isBlank && styles.matchBlank,
      ]}
      onPress={onPress}
      disabled={isBlank}
    >
      <View style={styles.teamRow}>
        <Text
          style={[
            styles.teamName,
            isCompleted && winner && winner.id !== match.team1?.id && styles.teamLost,
            isCompleted && winner && winner.id === match.team1?.id && styles.teamWon,
          ]}
          numberOfLines={1}
        >
          {delegation1?.title ? `${delegation1.title} ${team1?.description || ''}` : 'Non défini'}
        </Text>
        {match.team1_score !== undefined && (
          <Text style={styles.score}>{match.team1_score}</Text>
        )}
      </View>

      <View style={styles.teamRow}>
        <Text
          style={[
            styles.teamName,
            isCompleted && winner && winner.id !== match.team2?.id && styles.teamLost,
            isCompleted && winner && winner.id === match.team2?.id && styles.teamWon,
          ]}
          numberOfLines={1}
        >
          {delegation2?.title ? `${delegation2.title} ${team2?.description || ''}` : 'Non défini'}
        </Text>
        {match.team2_score !== undefined && (
          <Text style={styles.score}>{match.team2_score}</Text>
        )}
      </View>

      {match.start_time && (
        <Text style={styles.matchTime}>
          {formatMatchTime(match.start_time)}
        </Text>
      )}

      {isBlank && <Text style={styles.blankText}>Match non défini</Text>}
      {isLive && <Text style={styles.liveIndicator}>EN DIRECT</Text>}
      {isCompleted && <Text style={styles.completedIndicator}>Terminé</Text>}
    </TouchableOpacity>
  );
};

/**
 * Formate la date/heure d'un match
 */
const formatMatchTime = (time: Date | string): string => {
  try {
    const date = new Date(time);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return '';
  }
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  outerScrollView: {
    flex: 1,
  },
  outerScrollContainer: {
    flexGrow: 1,
  },
  bracketContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
  },
  roundColumn: {
    marginRight: ROUND_SPACING,
    width: MATCH_CARD_WIDTH,
  },
  roundTitle: {
    position: 'absolute',
    top: -25,
    left: 0,
    right: 0,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    zIndex: 10,
    paddingVertical: 5,
  },
  matchesContainer: {
    position: 'relative',
    flex: 1,
  },
  matchWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    width: MATCH_CARD_WIDTH,
    minHeight: MATCH_CARD_HEIGHT,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  matchLive: {
    borderColor: '#ff9800',
    borderWidth: 2,
  },
  matchCompleted: {
    opacity: 0.8,
  },
  matchBlank: {
    backgroundColor: '#f5f5f5',
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamName: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  teamWon: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  teamLost: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 24,
    textAlign: 'right',
  },
  vsText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
    fontStyle: 'italic',
  },
  matchTime: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  blankText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  liveIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff9800',
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  completedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#4caf50',
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  connectorColumnContainer: {
    position: 'relative',
    width: ROUND_SPACING,
    marginLeft: -ROUND_SPACING,
    zIndex: -1,
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
});

export { BracketMatch, BracketRound, BracketTree };

export default TournamentBracket;
