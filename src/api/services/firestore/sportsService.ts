import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy } from "@react-native-firebase/firestore";
import { RawSport } from "@/types/rawModels";
import { EnrichedSport } from "@/types/enrichedModels";
import { useQuery } from "@tanstack/react-query";

const db = getFirestore();


export const getAllRawSports = async (): Promise<RawSport[]> => {
    try {
        const q = query(
            collection(getFirestore(), 'sports'),
            orderBy('title', 'asc'),
        );

        const querySnapshot = await getDocs(q);

        const sports: RawSport[] = [];
        querySnapshot.forEach((doc) => {
            const data = { 
                id: doc.id,
                ...doc.data()
            } as RawSport;
             
            sports.push(data);
        }); 

        return sports;
    }
    catch (error) {
        console.error("Erreur lors de la récupération des sports:", error);
        return [];
    }
}

export const getSportFromId = async (id: string): Promise<RawSport> => {
    const docRef = doc(db, 'sports', id);
        const docSnap = await getDoc(docRef);
    
        if (!docSnap.exists) {
            console.log('No sport found with id:', id);
            throw new Error(`Sport with id ${id} not found`);
        }
    
        return { id, ...docSnap.data() } as RawSport;
}

export const enrichSports = async (rawSports: RawSport[]): Promise<EnrichedSport[]> =>{
    return Promise.all(
        rawSports.map(async (raw) => ({
            id: raw.id,
            title: raw.title,
            ranking_category : raw.ranking_category,
            image: raw.image,
            categories: raw.categories,
        }))
    );
}

export const enrichSport = async (rawSport : RawSport): Promise<EnrichedSport> => {
    return {
        id: rawSport.id,
        title: rawSport.title,
        ranking_category : rawSport.ranking_category,
        image: rawSport.image,
        categories: rawSport.categories,
    };
}

// HOOKS pour récupérer les délégations avec cache
export const useSport = (id: string) => {
  return useQuery({
    queryKey: ['sport', id],
    queryFn: () => getSportFromId(id),
    enabled: !!id, // Ne s'exécute que si l'ID est défini
  });
};