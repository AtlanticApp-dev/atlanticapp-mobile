import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc, addDoc, updateDoc, query, limit, orderBy, startAfter, where } from "@react-native-firebase/firestore";
import { RawGeneralRanking, Ranking } from "@/types/models";
const db = getFirestore();

export const getAllRankings = async (): Promise<Ranking[]> => {
    const rankingsCol = collection(db, "rankings");
    const rankingSnapshot = await getDocs(rankingsCol);
    const rankingList = rankingSnapshot.docs.map(doc => doc.data());
    return rankingList as Ranking[];
}

export const getGroupRankingsBySportIdAndCategory = async (sport_id: string, category: string): Promise<any> => {
    const groupsRef = collection(db, "sports", sport_id, "categories", category, "groups");
    const q = query(groupsRef);
    const rankingSnapshot = await getDocs(q);
    const groupList = rankingSnapshot.docs.map(doc => {
        return {
            ...doc.data(),
            id: doc.id
        };
    });
    const rankingPromises = (groupList.map(async group => {
        const rankingRef = collection(db, "sports", sport_id, "categories", category, "groups", group.id, "ranking");
        const rankingSnapshot = await getDocs(rankingRef);
        const ranking = rankingSnapshot.docs.map(doc => {
            return {
                ...doc.data(),
                id: doc.id
            };
        });

        return {
            ranking,
            group: group
        };
    }));
    const rankingList = await Promise.all(rankingPromises);
    return rankingList;
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