import { collection, getDoc, doc, getDocs, getFirestore, query, orderBy} from '@react-native-firebase/firestore';
import { RawPlace } from '@/types/rawModels';
import { EnrichedPlace } from '@/types/enrichedModels';
import { enrichSports, getSportFromId } from './sportsService';
import { useQuery } from '@tanstack/react-query';

const db = getFirestore();


export const getPlaceFromId = async (id: string): Promise<RawPlace> => {
    const docRef = doc(db, 'places', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists) {
        console.log('No user found with uid:', id);
        throw new Error(`User with uid ${id} not found`);
    }

    return { id, ...docSnap.data() } as RawPlace;
}


export const getAllPlaces = async (): Promise<RawPlace[]> => {
    try {
        const q = query(
            collection(getFirestore(), 'places'),
            orderBy('title', 'asc')
        );

        const querySnapshot = await getDocs(q);

        const delegations: RawPlace[] = [];
        querySnapshot.forEach((doc) => {
            const data = { 
                id: doc.id,
                ...doc.data()
            } as RawPlace;
             
            delegations.push(data);
        }); 

        return delegations;
    }
    catch (error) {
        console.error("Erreur lors de la récupération des délégations:", error);
        return [];
    }
}

export const enrichPlaces = async (rawPlaces : RawPlace[]) : Promise<EnrichedPlace[]> => {
    return Promise.all(
        rawPlaces.map(async (raw) => {
            const rawSports = await Promise.all(raw.sports_id_list.map(id => getSportFromId(id)));
            return {
                id: raw.id,
                description: raw.description,
                kind: raw.kind,
                title: raw.title,
                position: raw.position,
                sports: await enrichSports(rawSports),
            };
        })
    )
}

export const enrichPlace = async (rawPlace : RawPlace) : Promise<EnrichedPlace> => {
    return (await enrichPlaces([rawPlace]))[0];
}

// HOOKS pour récupérer les délégations avec cache
export const usePlace = (id: string) => {
  return useQuery({
    queryKey: ['place', id],
    queryFn: () => getPlaceFromId(id),
    enabled: !!id, // Ne s'exécute que si l'ID est défini
  });
};