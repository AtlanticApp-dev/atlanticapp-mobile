import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import { getUserFromUid, updateUser } from '../firestore/usersService';
import { getAllRawSports } from '../firestore/sportsService';
import { getAllDelegations } from '../firestore/delegationService';
import { Platform } from 'react-native';

export const saveFcmToken = async (uid: string, fcmToken: string): Promise<void> => {
  return;  
  await firestore().collection('users').doc(uid).set({
        fcmToken,
        createdAt: firestore.FieldValue.serverTimestamp()
    }, { merge: true });
};

export const getFcmToken = async (uid: string) => {
  if (Platform.OS === 'ios') {
    await messaging().registerDeviceForRemoteMessages();
  }

  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  await saveFcmToken(uid, token);
  return token;
}

export const checkNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission enabled');
  } else {
    console.log('Notification permission NOT enabled');
  }
}

export const exportFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  const currentUser = auth().currentUser;
  try {
    const fcmTokensList = (await getUserFromUid(currentUser.uid)).fcm_tokens;
    if (!fcmTokensList.includes(fcmToken)) {
      fcmTokensList.push(fcmToken);
      await updateUser(currentUser.uid, { fcm_tokens: fcmTokensList });
    }
  } catch (error) {
    console.error('Error exporting FCM token:', error);
  }
  console.log('FCM token exported:', fcmToken);
  return fcmToken;
}

export const removeFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  const currentUser = auth().currentUser;
  try {
    const fcmTokensList = (await getUserFromUid(currentUser.uid)).fcm_tokens;
    if (fcmTokensList.includes(fcmToken)) {
      fcmTokensList.splice(fcmTokensList.indexOf(fcmToken), 1);
      await updateUser(currentUser.uid, { fcm_tokens: fcmTokensList });
    }
  } catch (error) {
    console.error('Error removing FCM token:', error);
  }
  console.log('FCM token removed:', fcmToken);
  return fcmToken;
}

export const subscribeToDelegation = async (delegationId: string | null) => {
  try {
    const delegationsList = await getAllDelegations();
    await Promise.all(delegationsList.map(delegation => messaging().unsubscribeFromTopic(delegation.id)));
    await messaging().subscribeToTopic(`${delegationId}`);
  } catch (error) {
    console.error('Error subscribing to delegations:', error);
  }
}

export const subscribeToSports = async (sportsId: string[]) => {
  try {
    const sportsList = await getAllRawSports();
    await Promise.all(sportsList.map(sport => messaging().unsubscribeFromTopic(sport.id)));
    await Promise.all(sportsId.map(id => messaging().subscribeToTopic(`${id}`)));
  } catch (error) {
    console.error('Error subscribing to sports:', error);
  }
}
