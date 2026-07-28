import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, startAfter } from "@react-native-firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bet, LeaderboardEntry, SportLeaderboard, BetUserStats, PronosMatch, BetStatus } from "@/types/models";
import { getMatchFromId } from "./matchService";
import auth from '@react-native-firebase/auth';
import { getUserFromUid } from "./usersService";

const db = getFirestore();

// ============ HELPER FUNCTIONS ============

/**
 * Convert Firestore timestamp to Date
 */
const convertTimestampToDate = (data: any): any => {
  if (!data) return data;
  
  const result: any = { ...data };
  
  if (result.created_at && typeof result.created_at.toDate === 'function') {
    result.created_at = result.created_at.toDate();
  }
  if (result.updated_at && typeof result.updated_at.toDate === 'function') {
    result.updated_at = result.updated_at.toDate();
  }
  
  return result;
};

/**
 * Calculate points for a bet based on match result
 * Rules:
 * - 1 point for a lost bet
 * - 10 points for a won bet (correct winner)
 * - 20 points for a won bet with exact score prediction
 * For sports like badminton (sets), compare set counts
 */
export const calculateBetPoints = (
  predictedTeam1Score: number | number[],
  predictedTeam2Score: number | number[],
  actualTeam1Score: number | number[] | undefined,
  actualTeam2Score: number | number[] | undefined
): { points: number; status: BetStatus } => {
  // If match result is not available yet
  if (actualTeam1Score === undefined || actualTeam2Score === undefined) {
    return { points: 0, status: 'pending' };
  }

  // Check if it's a sets-based sport (badminton, volleyball, etc.)
  const isSetsSport = Array.isArray(predictedTeam1Score) && Array.isArray(predictedTeam2Score);
  
  if (isSetsSport) {
    const predTeam1Sets = predictedTeam1Score as number[];
    const predTeam2Sets = predictedTeam2Score as number[];
    const actualTeam1Sets = actualTeam1Score as number[];
    const actualTeam2Sets = actualTeam2Score as number[];
    
    // Calculate total sets won for each team
    const predTeam1TotalSets = predTeam1Sets.reduce((a, b) => a + b, 0);
    const predTeam2TotalSets = predTeam2Sets.reduce((a, b) => a + b, 0);
    const actualTeam1TotalSets = actualTeam1Sets.reduce((a, b) => a + b, 0);
    const actualTeam2TotalSets = actualTeam2Sets.reduce((a, b) => a + b, 0);
    
    // Check winner
    const predictedWinner = predTeam1TotalSets > predTeam2TotalSets ? 'team1' : 
                           predTeam1TotalSets < predTeam2TotalSets ? 'team2' : 'draw';
    const actualWinner = actualTeam1TotalSets > actualTeam2TotalSets ? 'team1' : 
                        actualTeam1TotalSets < actualTeam2TotalSets ? 'team2' : 'draw';
    
    // Check if scores match exactly
    const exactScoreMatch = 
      JSON.stringify(predTeam1Sets) === JSON.stringify(actualTeam1Sets) &&
      JSON.stringify(predTeam2Sets) === JSON.stringify(actualTeam2Sets);
    
    if (predictedWinner === actualWinner) {
      if (exactScoreMatch) {
        return { points: 20, status: 'won' };
      }
      return { points: 10, status: 'won' };
    }
    return { points: 1, status: 'lost' };
  } else {
    // Football-style sport (single score)
    const predTeam1 = predictedTeam1Score as number;
    const predTeam2 = predictedTeam2Score as number;
    const actualTeam1 = actualTeam1Score as number;
    const actualTeam2 = actualTeam2Score as number;
    
    // Check winner
    const predictedWinner = predTeam1 > predTeam2 ? 'team1' : 
                           predTeam1 < predTeam2 ? 'team2' : 'draw';
    const actualWinner = actualTeam1 > actualTeam2 ? 'team1' : 
                        actualTeam1 < actualTeam2 ? 'team2' : 'draw';
    
    // Check if scores match exactly
    const exactScoreMatch = predTeam1 === actualTeam1 && predTeam2 === actualTeam2;
    
    if (predictedWinner === actualWinner) {
      if (exactScoreMatch) {
        return { points: 20, status: 'won' };
      }
      return { points: 10, status: 'won' };
    }
    return { points: 1, status: 'lost' };
  }
};

// ============ CRUD OPERATIONS ============

/**
 * Create a new bet
 */
export const createBet = async (
  userId: string,
  matchId: string,
  predictedTeam1Score: number | number[],
  predictedTeam2Score: number | number[]
): Promise<Bet> => {
  try {
    const betRef = doc(collection(db, 'bets'));
    const now = new Date();
    
    const betData = {
      id: betRef.id,
      user_id: userId,
      match_id: matchId,
      predicted_team1_score: predictedTeam1Score,
      predicted_team2_score: predictedTeam2Score,
      created_at: now,
      updated_at: now,
      points: 0,
      status: 'pending' as BetStatus,
    };
    
    await setDoc(betRef, betData);
    return convertTimestampToDate(betData) as Bet;
  } catch (error) {
    console.error("Error creating bet:", error);
    throw error;
  }
};

/**
 * Update an existing bet
 */
export const updateBet = async (
  betId: string,
  predictedTeam1Score: number | number[],
  predictedTeam2Score: number | number[]
): Promise<Bet> => {
  try {
    const betRef = doc(db, 'bets', betId);
    const updatedData = {
      predicted_team1_score: predictedTeam1Score,
      predicted_team2_score: predictedTeam2Score,
      updated_at: new Date(),
    };
    
    await updateDoc(betRef, updatedData);
    
    const updatedBet = await getBetById(betId);
    return updatedBet;
  } catch (error) {
    console.error("Error updating bet:", error);
    throw error;
  }
};

/**
 * Delete a bet
 */
export const deleteBet = async (betId: string): Promise<void> => {
  try {
    const betRef = doc(db, 'bets', betId);
    await deleteDoc(betRef);
  } catch (error) {
    console.error("Error deleting bet:", error);
    throw error;
  }
};

/**
 * Get a bet by ID
 */
export const getBetById = async (betId: string): Promise<Bet> => {
  try {
    const docRef = doc(db, 'bets', betId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists) {
      throw new Error(`Bet with id ${betId} not found`);
    }
    
    return convertTimestampToDate({
      id: docSnap.id,
      ...docSnap.data(),
    }) as Bet;
  } catch (error) {
    console.error("Error fetching bet:", error);
    throw error;
  }
};

/**
 * Get all bets for a specific user
 */
export const getUserBets = async (userId: string, limitCount?: number): Promise<Bet[]> => {
  try {
    let q = query(
      collection(db, 'bets'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    const bets: Bet[] = [];
    
    querySnapshot.forEach((doc) => {
      bets.push(convertTimestampToDate({
        id: doc.id,
        ...doc.data(),
      }) as Bet);
    });
    
    return bets;
  } catch (error) {
    console.error("Error fetching user bets:", error);
    throw error;
  }
};

/**
 * Get all bets for a specific match
 */
export const getBetsByMatchId = async (matchId: string): Promise<Bet[]> => {
  try {
    const q = query(
      collection(db, 'bets'),
      where('match_id', '==', matchId)
    );
    
    const querySnapshot = await getDocs(q);
    const bets: Bet[] = [];
    
    querySnapshot.forEach((doc) => {
      bets.push(convertTimestampToDate({
        id: doc.id,
        ...doc.data(),
      }) as Bet);
    });
    
    return bets;
  } catch (error) {
    console.error("Error fetching bets by match:", error);
    throw error;
  }
};

/**
 * Get bets with pagination
 */
export const getUserBetsPaginated = async (
  userId: string,
  limitCount: number = 10,
  lastVisible: any = null
): Promise<{ bets: Bet[]; lastDoc: any }> => {
  try {
    let q = query(
      collection(db, 'bets'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    
    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }
    
    const querySnapshot = await getDocs(q);
    const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    const bets: Bet[] = [];
    querySnapshot.forEach((doc) => {
      bets.push(convertTimestampToDate({
        id: doc.id,
        ...doc.data(),
      }) as Bet);
    });
    
    return {
      bets,
      lastDoc: newLastDoc,
    };
  } catch (error) {
    console.error("Error fetching paginated user bets:", error);
    throw error;
  }
};

// ============ STATISTICS & LEADERBOARD ============

/**
 * Get user's bet statistics
 */
export const getUserBetStats = async (userId: string): Promise<BetUserStats> => {
  try {
    const bets = await getUserBets(userId);
    
    const total_bets = bets.length;
    const correct_predictions = bets.filter(b => b.status === 'won').length;
    const total_points = bets.reduce((sum, bet) => sum + bet.points, 0);
    
    return {
      user_id: userId,
      total_bets,
      correct_predictions,
      total_points,
      ranking_position: 0, // Will be calculated in leaderboard
      last_updated: new Date(),
    };
  } catch (error) {
    console.error("Error fetching user bet stats:", error);
    throw error;
  }
};

/**
 * Get the general leaderboard (all sports)
 */
export const getGeneralLeaderboard = async (limitCount?: number): Promise<LeaderboardEntry[]> => {
  try {
    // First, get all users with bets
    const betsQuery = query(collection(db, 'bets'));
    const betsSnapshot = await getDocs(betsQuery);
    
    // Collect unique user IDs
    const userIds = new Set<string>();
    betsSnapshot.forEach(doc => {
      userIds.add(doc.data().user_id);
    });
    
    // Get stats for each user
    const leaderboardPromises = Array.from(userIds).map(async (userId) => {
      try {
        const user = await getUserFromUid(userId);
        const stats = await getUserBetStats(userId);
        
        return {
          user_id: userId,
          display_name: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`
            : user.email || `User ${userId.slice(0, 8)}`,
          delegation_id: user.supported_delegation,
          total_points: stats.total_points,
          total_bets: stats.total_bets,
          correct_predictions: stats.correct_predictions,
          avatar: undefined, // Can be added from user profile
        };
      } catch (error) {
        console.warn(`Could not fetch user ${userId}:`, error);
        return null;
      }
    });
    
    const entries = (await Promise.all(leaderboardPromises)).filter(Boolean) as LeaderboardEntry[];
    
    // Sort by points (descending)
    entries.sort((a, b) => b.total_points - a.total_points);
    
    // Add positions
    const finalEntries = entries.map((entry, index) => ({
      ...entry,
      position: index + 1,
    }));
    
    if (limitCount) {
      return finalEntries.slice(0, limitCount);
    }

    return finalEntries;
  } catch (error) {
    console.error("Error fetching general leaderboard:", error);
    throw error;
  }
};

/**
 * Get leaderboard for a specific sport
 */
export const getSportLeaderboard = async (
  sportId: string,
  limitCount?: number
): Promise<LeaderboardEntry[]> => {
  try {
    // Get all bets for this sport
    const matchesQuery = query(
      collection(db, 'matches'),
      where('sport_id', '==', sportId)
    );
    const matchesSnapshot = await getDocs(matchesQuery);
    
    const matchIds = matchesSnapshot.docs.map(doc => doc.id);
    
    // Get all bets for these matches
    const allBetsQuery = query(
      collection(db, 'bets'),
    );
    
    // This is a simplified version - for production, use pagination or batch queries
    const betsSnapshots = await getDocs(allBetsQuery);
    
    // Collect unique user IDs
    const userIds = new Set<string>();
    betsSnapshots.forEach(doc => {
      userIds.add(doc.data().user_id);
    });
    
    // Get stats for each user (only for bets on this sport)
    const leaderboardPromises = Array.from(userIds).map(async (userId) => {
      try {
        const user = await getUserFromUid(userId);
        const userBets = await getUserBets(userId);
        
        // Filter bets for this sport
        const sportBets = userBets.filter(bet => 
          matchIds.includes(bet.match_id)
        );
        
        const total_points = sportBets.reduce((sum, bet) => sum + bet.points, 0);
        const correct_predictions = sportBets.filter(b => b.status === 'won').length;
        
        return {
          user_id: userId,
          display_name: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`
            : user.email || `User ${userId.slice(0, 8)}`,
          delegation_id: user.supported_delegation,
          total_points,
          total_bets: sportBets.length,
          correct_predictions,
          sport_id: sportId,
          avatar: undefined,
        };
      } catch (error) {
        console.warn(`Could not fetch user ${userId} for sport ${sportId}:`, error);
        return null;
      }
    });
    
    const entries = (await Promise.all(leaderboardPromises)).filter(Boolean) as LeaderboardEntry[];
    
    // Sort by points (descending)
    entries.sort((a, b) => b.total_points - a.total_points);
    
    // Add positions
    const finalEntries = entries.map((entry, index) => ({
      ...entry,
      position: index + 1,
    }));
    
    if (limitCount) {
      return finalEntries.slice(0, limitCount);
    }
    
    return finalEntries;
  } catch (error) {
    console.error("Error fetching sport leaderboard:", error);
    throw error;
  }
};

/**
 * Get all sports with leaderboards
 */
export const getAllSportsLeaderboards = async (): Promise<SportLeaderboard[]> => {
  try {
    // This is a simplified version - for production, you might want to cache this
    // or implement a more efficient query
    const sportsQuery = query(collection(db, 'sports'));
    const sportsSnapshot = await getDocs(sportsQuery);
    
    const sportLeaderboards: SportLeaderboard[] = [];
    
    for (const sportDoc of sportsSnapshot.docs) {
      const sportId = sportDoc.id;
      const sportTitle = sportDoc.data().title;
      
      try {
        const entries = await getSportLeaderboard(sportId, 10);
        if (entries.length > 0) {
          sportLeaderboards.push({
            sport_id: sportId,
            sport_title: sportTitle,
            entries,
          });
        }
      } catch (error) {
        console.warn(`Could not fetch leaderboard for sport ${sportId}:`, error);
      }
    }
    
    return sportLeaderboards;
  } catch (error) {
    console.error("Error fetching all sports leaderboards:", error);
    throw error;
  }
};

// ============ MATCH WITH USER BET ============

/**
 * Get a match with the user's bet (if exists)
 */
export const getMatchWithUserBet = async (
  matchId: string,
  userId: string
): Promise<PronosMatch> => {
  try {
    const match = await getMatchFromId(matchId);
    
    // Check if user has a bet on this match
    const bets = await getBetsByMatchId(matchId);
    const userBet = bets.find(b => b.user_id === userId);
    
    if (userBet) {
      // Calculate points if status is still pending
      if (userBet.status === 'pending' && match.status === 'completed') {
        const actualTeam1Score = match.teams[0]?.score;
        const actualTeam2Score = match.teams[1]?.score;
        
        const { points, status } = calculateBetPoints(
          userBet.predicted_team1_score,
          userBet.predicted_team2_score,
          actualTeam1Score,
          actualTeam2Score
        );
        
        // Update the bet with calculated points
        const betRef = doc(db, 'bets', userBet.id);
        await updateDoc(betRef, { points, status });
        
        userBet.points = points;
        userBet.status = status;
      }
      
      return {
        ...match,
        user_bet: {
          bet_id: userBet.id,
          predicted_team1_score: userBet.predicted_team1_score,
          predicted_team2_score: userBet.predicted_team2_score,
          points: userBet.points,
          status: userBet.status,
        },
      };
    }
    
    return match as PronosMatch;
  } catch (error) {
    console.error("Error fetching match with user bet:", error);
    throw error;
  }
};

/**
 * Get upcoming matches that are available for betting
 */
export const getUpcomingMatchesForBetting = async (
  userId: string,
  limitCount?: number
): Promise<PronosMatch[]> => {
  try {
    const now = new Date();
    
    const matchesQuery = query(
      collection(db, 'matches'),
      where('start_time', '>', now),
      where('status', 'in', ['incoming', 'live']),
      orderBy('start_time', 'asc')
    );
    
    if (limitCount) {
      // Note: limit needs to be applied after the where clauses
      // This is a simplified query
    }
    
    const matchesSnapshot = await getDocs(matchesQuery);
    
    const pronosMatches: PronosMatch[] = [];
    
    for (const matchDoc of matchesSnapshot.docs) {
      const matchData = {
        id: matchDoc.id,
        ...matchDoc.data(),
      };
      
      if (matchData.start_time && typeof matchData.start_time.toDate === 'function') {
        matchData.start_time = matchData.start_time.toDate();
      }
      
      const matchWithBet = await getMatchWithUserBet(matchDoc.id, userId);
      pronosMatches.push(matchWithBet);
    }
    
    return pronosMatches;
  } catch (error) {
    console.error("Error fetching upcoming matches for betting:", error);
    throw error;
  }
};

// ============ REACT QUERY HOOKS ============

/**
 * Hook to get all bets for the current user
 */
export const useUserBets = (userId: string | null, limitCount?: number) => {
  return useQuery({
    queryKey: ['userBets', userId, limitCount],
    queryFn: () => userId ? getUserBets(userId, limitCount) : Promise.resolve([]),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get user's bet statistics
 */
export const useUserBetStats = (userId: string | null) => {
  return useQuery({
    queryKey: ['userBetStats', userId],
    queryFn: () => userId ? getUserBetStats(userId) : Promise.resolve(null),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get general leaderboard
 */
export const useGeneralLeaderboard = (limitCount?: number) => {
  return useQuery({
    queryKey: ['generalLeaderboard', limitCount],
    queryFn: () => getGeneralLeaderboard(limitCount),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

/**
 * Hook to get sport leaderboard
 */
export const useSportLeaderboard = (sportId: string | null, limitCount?: number) => {
  return useQuery({
    queryKey: ['sportLeaderboard', sportId, limitCount],
    queryFn: () => sportId ? getSportLeaderboard(sportId, limitCount) : Promise.resolve([]),
    enabled: !!sportId,
    staleTime: 15 * 60 * 1000,
  });
};

/**
 * Hook to get all sports leaderboards
 */
export const useAllSportsLeaderboards = () => {
  return useQuery({
    queryKey: ['allSportsLeaderboards'],
    queryFn: getAllSportsLeaderboards,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to get upcoming matches for betting
 */
export const useUpcomingMatchesForBetting = (userId: string | null) => {
  return useQuery({
    queryKey: ['upcomingMatchesForBetting', userId],
    queryFn: () => userId ? getUpcomingMatchesForBetting(userId, 20) : Promise.resolve([]),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  });
};

/**
 * Mutation hook to create a bet
 */
export const useCreateBet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, matchId, team1Score, team2Score }: {
      userId: string;
      matchId: string;
      team1Score: number | number[];
      team2Score: number | number[];
    }) => createBet(userId, matchId, team1Score, team2Score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBets'] });
      queryClient.invalidateQueries({ queryKey: ['userBetStats'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingMatchesForBetting'] });
      queryClient.invalidateQueries({ queryKey: ['generalLeaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['sportLeaderboard'] });
    },
  });
};

/**
 * Mutation hook to update a bet
 */
export const useUpdateBet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ betId, team1Score, team2Score }: {
      betId: string;
      team1Score: number | number[];
      team2Score: number | number[];
    }) => updateBet(betId, team1Score, team2Score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBets'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingMatchesForBetting'] });
    },
  });
};

/**
 * Mutation hook to delete a bet
 */
export const useDeleteBet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBets'] });
      queryClient.invalidateQueries({ queryKey: ['userBetStats'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingMatchesForBetting'] });
      queryClient.invalidateQueries({ queryKey: ['generalLeaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['sportLeaderboard'] });
    },
  });
};
