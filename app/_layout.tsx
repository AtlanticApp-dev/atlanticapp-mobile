import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { checkNotificationPermission, getFcmToken, saveFcmToken } from '@/src/api/services/messaging/fcmService';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('🔔 Notification reçue en foreground :', remoteMessage);
      if (remoteMessage.notification && remoteMessage.notification.title) {
        Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
        //TODO: gérer les actions de la notification (ex: redirection vers un match ou un événement) en fonction des données reçues dans remoteMessage.data, ou afficher un message personnalisé
      }
      else{
        Alert.alert('Notification reçue', 'Vous avez reçu une notification sans titre ni corps.');
      }
    });

    const unsubscribeTokenRefresh = messaging().onTokenRefresh(newToken => {
      //TODO: utiliser le vrai uid de l'utilisateur actuellement connecté
      saveFcmToken('', newToken);
    })

    messaging().subscribeToTopic('allUsers')
      .then(() => console.log('Abonné au topic allUsers !'))
      .catch(error => console.error('Erreur d\'abonnement au topic allUsers:', error));

    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log('Message opened from the background!', remoteMessage);
      //TODO: gérer la redirection vers un match ou un événement en fonction des données reçues dans remoteMessage.data
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open', remoteMessage);
          //TODO: gérer la redirection vers un match ou un événement en fonction des données reçues dans remoteMessage.data
        }
      });

    checkNotificationPermission();
    //TODO: utiliser le vrai uid de l'utilisateur actuellement connecté
    getFcmToken('');

    return () => {
      unsubscribe();
      unsubscribeTokenRefresh();
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
 
  if (!loaded) {
    return null;
  }

  

  return (
    <SafeAreaProvider>
      <PaperProvider>
      <GestureHandlerRootView>
        <Stack
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="matches" options={{ headerTitle : "Détails du match", headerBackTitle : "Retour"}}/>
          <Stack.Screen name="events" options={{ headerTitle : "Détails de l'événement", headerBackTitle : "Retour"}}/>
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="auth" options={{ headerTitle : "Authentification", headerBackTitle : "Retour"}} />
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}