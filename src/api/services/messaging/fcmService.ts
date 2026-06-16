import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import { getUserFromUid, updateUser } from '../firestore/usersService';
import { getAllRawSports } from '../firestore/sportsService';
import { getAllDelegations } from '../firestore/delegationService';
import { PermissionsAndroid, Platform } from 'react-native';

export const saveFcmToken = async (uid: string, fcmToken: string): Promise<void> => {
  return;
  //TODO: utiliser le vrai uid de l'utilisateur actuellement connecté et l'enregistrer dans la collection users de Firestore
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

export const iOSPermissionRequest = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  } else {
    console.log('Notification permission denied');
  }
}

export const androidPermissionRequest = async () => {
  // Android 13+ (API 33) requires POST_NOTIFICATIONS runtime permission.
  if (Platform.Version < 33) {
    console.log('Notification permission not required on this Android version');
    return;
  }

  //TODO : demander la permission de recevoir des notifications dans l'onboarding une fois créé (déplacer cette ligne dans le bon composant)
  const authStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  const enabled = authStatus === PermissionsAndroid.RESULTS.GRANTED;

  if (enabled) {
    console.log('Notification permission granted');
  } else {
    console.log('Notification permission denied');
  }
}

export const checkNotificationPermission = async () => {
  if (Platform.OS === 'ios') {
    await iOSPermissionRequest();
  } else if (Platform.OS === 'android') {
    await androidPermissionRequest();
  } else {
    console.log('Unsupported platform for notification permissions : ', Platform.OS);
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
