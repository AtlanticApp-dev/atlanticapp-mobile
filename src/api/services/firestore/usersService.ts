import { getDoc, doc, setDoc, updateDoc, getFirestore} from '@react-native-firebase/firestore';
import { subscribeToDelegation, subscribeToSports } from '../messaging/fcmService';
import auth from '@react-native-firebase/auth';
import { setLocalSupportedSports } from '../storage/supportedSportsService';
import { setLocalFavoriteDelegation } from '../storage/favoriteDelegationService';
interface User {
    uid: string;
    anonymous: boolean;
    fcm_tokens:string[];
    followed_sports: string[];
    supported_delegation: string | null;
    last_login : Date;
    platform: 'android' | 'ios' | 'web';
    email?: string;
    firstName?: string;
    lastName?: string;
    // Add any other user properties you need
}

const db = getFirestore();


/**
 * Get a user document by UID from Firestore
 * @param uid User ID
 * @returns User object or null if not found
 */
export const getUserFromUid = async (uid: string): Promise<User> => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists) {
        console.log('No user found with uid:', uid);
        throw new Error(`User with uid ${uid} not found`);
    }

    return { uid, ...docSnap.data() } as User;
}

/**
 * Create a new user document in Firestore
 * @param user User information
 */
export const createUser = async (user: User): Promise<void> => {
    try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, user);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

/**
 * Update an existing user document in Firestore
 * @param uid User ID
 * @param data Data to update
 */
export const updateUser = async (uid: string, data: Partial<User>): Promise<void> => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, data);
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export const updateUserSupportedTeam = async (teamId: string | null): Promise<void> => {
    try {
        await setLocalFavoriteDelegation(teamId);

        await subscribeToDelegation(teamId);

        const currentUser = auth().currentUser;
        const uid = currentUser?.uid;
        
        if (uid){
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {supported_delegation: teamId});
        }
    } catch (error) {
        console.error('Error updating user supported team:', error);
        throw error;
    }
}

export const updateUserFollowedSports = async (sportsId : string[]): Promise<void> => {
    try {
        await setLocalSupportedSports(sportsId);

        await subscribeToSports(sportsId);
        const currentUser = auth().currentUser;
        const uid = currentUser?.uid;

        if (uid){
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {followed_sports: sportsId});
        }
    } catch (error) {
        console.error('Error updating user followed sports:', error);
        throw error;
    }
}