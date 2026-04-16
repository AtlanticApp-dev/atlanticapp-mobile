import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc, addDoc, updateDoc, query, limit, orderBy, startAfter, where } from "@react-native-firebase/firestore";

const db = getFirestore();

interface Match{
    id: string;
    category: string;
    description: string;
    place_id: string | null;
    sport_id: string;
    start_time: Date;
    status: string;
    team1_id: string;
    team2_id: string;
    team1_score: number | null;
    team2_score: number | null;
    kind: string;
    teams: any;
    title: string;
}

export const getMatchFromId = async (id: string): Promise<Match> => {
    try {
        const docRef = doc(db, 'matches', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists) {
            throw new Error(`Sport with id ${id} not found`);
        }

        const data =  { id, ...docSnap.data() } as Match;

        if (data.start_time) {
            data.start_time = (data.start_time as any).toDate();
        }
        return data;
    } catch (error) {
        console.error("Error fetching match:", error);
        throw error;
    }
}

export const getMatchesFromSportId = async (sportId: string, limitCount: number = 10, startAfterDate?: Date): Promise<Match[]> => {
    try {
        let q = query(
            collection(getFirestore(), 'matches'),
            where('sport_id', '==', sportId),
            orderBy('start_time', 'asc'),
            limit(limitCount)
        );

        if (startAfterDate) {
            q = query(q, startAfter(startAfterDate));
        }

        const querySnapshot = await getDocs(q);

        const matches: Match[] = [];
        querySnapshot.forEach((doc) => {
            const data = { 
                id: doc.id,
                ...doc.data()
            } as Match;

            if (data.start_time) {
                data.start_time = (data.start_time as any).toDate();
            }
             
            matches.push(data);
        }); 

        return matches;
    }
    catch (error) {
        console.error("Erreur lors de la récupération des matchs:", error);
        throw error;
    }
}

export const getMatchesFromPlaceId = async (placeId: string, limitCount: number = 10, startAfterDate?: Date, lastVisible: any): Promise<Match[]> => {
    try {
        let q = query(
            collection(getFirestore(), 'matches'),
            where('place_id', '==', placeId),
            orderBy('start_time', 'asc'),
            startAfter(lastVisible),
            limit(limitCount)
        );

        if (startAfterDate) {
            q = query(q, startAfter(startAfterDate));
        }

        const querySnapshot = await getDocs(q);

        const matches: Match[] = [];
        querySnapshot.forEach((doc) => {
            const data = { 
                id: doc.id,
                ...doc.data()
            } as Match;

            if (data.start_time) {
                data.start_time = (data.start_time as any).toDate();
            }

            matches.push(data);
        });

        return matches;
    }
    catch (error) {
        console.error("Erreur lors de la récupération des matchs:", error);
        throw error;
    }
}

type getMatchesFromPlaceIdAndCategoryParams = {
    sportId: string;
    categoryId: string;
    limitCount?: number;
    lastDoc?: any;
}
export const getMatchesFromSportIdAndCategory = async ({sportId, categoryId, limitCount = 10, lastDoc = null} : getMatchesFromPlaceIdAndCategoryParams): Promise<{ matches: Match[]; lastDoc: any }> => {
    try {
        let q = query(
            collection(getFirestore(), 'matches'),
            where('sport_id', '==', sportId),
            where('category_id', '==', categoryId),
            orderBy('start_time', 'asc'),
            limit(limitCount)
        );

        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }

        const querySnapshot = await getDocs(q);

        const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

        const matches: Match[] = [];
        querySnapshot.forEach((doc) => {
            const data = { 
                id: doc.id,
                ...doc.data()
            } as Match;

            if (data.start_time) {
                data.start_time = (data.start_time as any).toDate();
            }
             
            matches.push(data);
        }); 

        return {
            matches : matches,
            lastDoc : newLastDoc
        };
    }
    catch (error) {
        console.error("Erreur lors de la récupération des matchs:", error);
        throw error;
    }
}

export const updateHeadToHeadMatchScore = async (matchId: string, sport_id: string,team1Score: number | number[], team2Score: number | number[]): Promise<void> => {
    try {
        const match = await getMatchFromId(matchId);
        const team1 = { ...match.teams[0], score: team1Score };
        const team2 = { ...match.teams[1], score: team2Score };
        const matchRef = doc(getFirestore(), 'matches', matchId);
        await updateDoc(matchRef, { teams: [team1, team2] });
    } catch (error) {
        console.error("Error updating head-to-head match score:", error);
        throw error;
    }
};

export const updateRankedMatchRanking = async (matchId: string, ranking: string[]): Promise<void> => {
    try {
        const matchRef = doc(getFirestore(), 'matches', matchId);
        await updateDoc(matchRef, { teams : ranking });
    } catch (error) {
        console.error("Error updating ranked match ranking:", error);
        throw error;
    }
};
