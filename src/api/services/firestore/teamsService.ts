import { getFirestore, doc, getDoc, DocumentReference } from "@react-native-firebase/firestore";
import { RawMatchTeam, RawTeam } from "@/types/rawModels";
import { EnrichedMatchTeam, EnrichedTeam } from "@/types/enrichedModels";
import { enrichSport, getSportFromId } from "./sportsService";
import { getDelegationFromId, enrichDelegation } from "./delegationService";
import { useQuery } from "@tanstack/react-query";

const db = getFirestore();


export const getTeamFromId = async (id: string): Promise<RawTeam> => {
    const docRef = doc(db, 'teams', id);
        const docSnap = await getDoc(docRef);
    
        if (!docSnap.exists) {
            console.log('No sport found with id:', id);
            throw new Error(`Sport with id ${id} not found`);
        }
    
        return { id, ...docSnap.data() } as RawTeam;
}

export function enrichTeams(rawTeams : RawTeam[]) : Promise<EnrichedTeam[]> {
    return Promise.all(
        rawTeams.map(async (raw) => {
            const rawSport = await getSportFromId(raw.sport_id);
            const rawDelegation = await getDelegationFromId(raw.delegation_id);
            return {
                id: raw.id,
                name: raw.name,
                category : raw.category,
                sport: await enrichSport(rawSport),
                delegation: await enrichDelegation(rawDelegation),
            };
        })
    );
}

export async function enrichTeam(rawTeam : RawTeam) : Promise<EnrichedTeam> {
    return (await enrichTeams([rawTeam]))[0];
}

export const enrichMatchTeams = async (rawMatchTeams : RawMatchTeam[]) : Promise<EnrichedMatchTeam[]> => {
    return Promise.all(
        rawMatchTeams.map(async (raw) => {
            const rawDelegation = await getDelegationFromId(raw.delegation_id);
            return {
                id: raw.id,
                score : raw.score,
                ranking : raw.ranking,
                last_update : raw.last_update,
                delegation : await enrichDelegation(rawDelegation)
            };
        })
    );
}

export const enrichMatchTeam = async (rawMatchTeam : RawMatchTeam) : Promise<EnrichedMatchTeam> => {
    return (await enrichMatchTeams([rawMatchTeam]))[0];
}

export const getTeamFromRef = async (ref: DocumentReference): Promise<any> => {
    const docSnap = await getDoc(ref);
    if (!docSnap.exists) {
        console.log('No team found with ref:', ref);
        throw new Error(`Team with ref ${ref} not found`);
    }
    return { id: docSnap.id, ...docSnap.data() };
}

// Hook pour récupérer une équipe avec cache
export const useTeam = (id: string) => {
  return useQuery({
    queryKey: ['team', id],
    queryFn: () => getTeamFromId(id),
    enabled: !!id, // Ne s'exécute que si l'ID est défini
  });
};