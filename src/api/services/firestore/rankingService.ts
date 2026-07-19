import { getFirestore, collection, getDocs, doc, getDoc, query } from "@react-native-firebase/firestore";
import { RawGeneralRanking, Ranking } from "@/types/models";
import { useQuery } from "@tanstack/react-query";

const db = getFirestore();

export const getAllRankings = async (): Promise<Ranking[]> => {
    const rankingsCol = collection(db, "rankings");
    const rankingSnapshot = await getDocs(rankingsCol);
    const rankingList = rankingSnapshot.docs.map(doc => doc.data());
    return rankingList as Ranking[];
}

export const getGroupsBySportIdAndCategory = async (sport_id: string, category: string): Promise<any> => {
    const groupsRef = collection(db, "sports", sport_id, "categories", category, "groups");
    const q = query(groupsRef);
    const rankingSnapshot = await getDocs(q);
    const groupList = rankingSnapshot.docs.map(doc => {
        return {
            ...doc.data(),
            id: doc.id
        };
    });

    return groupList;
}

export const getFinalRankingFromSportIdAndCategoryId = async (sport_id: string, category_id: string): Promise<any> => {
    const groupsRef = collection(db, "sports", sport_id, "categories", category_id, "final_ranking");
    const q = query(groupsRef);
    const rankingSnapshot = await getDocs(q);
    const rankingList = rankingSnapshot.docs.map(doc => doc.data());
    return rankingList;
}

export const getGeneralRanking = async (): Promise<RawGeneralRanking> => {
    const docRef = doc(db, 'competition', 'general_ranking');
    const rankingSnapshot = await getDoc(docRef);
    if (!rankingSnapshot.exists) {
        console.log('General ranking not found');
        throw new Error(`General ranking not found`);
    }

    return rankingSnapshot.data() as RawGeneralRanking;
}

// Hook personnalisé pour récupérer les groupes avec cache
export const useGroups = (sport_id: string, category_id: string) => {
  return useQuery({
    queryKey: ['groups', sport_id, category_id],
    queryFn: () => getGroupsBySportIdAndCategory(sport_id, category_id),
    enabled: !!sport_id && !!category_id,
  });
};

// Hook personnalisé pour le classement final
export const useFinalRanking = (sport_id: string, category_id: string) => {
  return useQuery({
    queryKey: ['finalRanking', sport_id, category_id],
    queryFn: () => getFinalRankingFromSportIdAndCategoryId(sport_id, category_id),
    enabled: !!sport_id && !!category_id,
  });
};