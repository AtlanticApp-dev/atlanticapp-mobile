import auth from '@react-native-firebase/auth';
import { getUserFromUid, updateUser } from '../firestore/usersService';
import { setLocalFavoriteDelegation } from '../storage/favoriteDelegationService';
import { setLocalSupportedSports } from '../storage/supportedSportsService';
import { exportFcmToken, removeFcmToken, subscribeToDelegation, subscribeToSports } from '../messaging/fcmService';

export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    await exportFcmToken();
    await updateUser(userCredential.user.uid, { last_login: new Date() });

    const userData = await getUserFromUid(userCredential.user.uid);

    const followed_sports = userData.followed_sports;
    const supported_delegation = userData.supported_delegation;
    await setLocalFavoriteDelegation(supported_delegation);
    await subscribeToDelegation(supported_delegation);
    
    await setLocalSupportedSports(followed_sports);
    await subscribeToSports(followed_sports);

    return userCredential.user.uid;
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
}

export const logOut = async() => {
  await removeFcmToken();
  await auth().signOut();
}