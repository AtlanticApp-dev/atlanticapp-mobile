import { EnrichedDelegation } from '@/types/enrichedModels';
import { RawDelegation } from '@/types/rawModels';
import { collection, where, getDoc, doc, getDocs, setDoc, updateDoc, getFirestore, query, orderBy} from '@react-native-firebase/firestore';


const db = getFirestore();


export const getDelegationFromId = async (id: string): Promise<RawDelegation> => {
    const docRef = doc(db, 'delegations', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists) {
        console.warn('No delegation found with id:', id);
        throw new Error(`Delegation with uid ${id} not found`);
    }

    return { id, ...docSnap.data() } as RawDelegation;
}


export const getAllDelegations = async (): Promise<RawDelegation[]> => {
    try {
        const q = query(
            collection(getFirestore(), 'delegations'),
            orderBy('title', 'asc')
        );

        const querySnapshot = await getDocs(q);

        const delegations: RawDelegation[] = [];
        querySnapshot.forEach((doc) => {
            const data = { 
                id: doc.id,
                ...doc.data()
            } as RawDelegation;
             
            delegations.push(data);
        }); 

        return delegations;
    }
    catch (error) {
        console.error("Erreur lors de la récupération des délégations:", error);
        return [];
    }
}

export function enrichDelegations(rawDelegations : RawDelegation[]) : Promise<EnrichedDelegation[]> {
    return Promise.all(
        rawDelegations.map(async (raw) => {
            return {
                id: raw.id,
                title: raw.title,
                //color: raw.color,
                image: raw.image
            };
        })
    );
}

export async function enrichDelegation(rawDelegation : RawDelegation) : Promise<EnrichedDelegation> {
    return (await enrichDelegations([rawDelegation]))[0];
}