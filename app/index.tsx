import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = "true";
      //const seen = await AsyncStorage.getItem('hasSeenOnboarding');
      if (!seen || seen === 'false') {
        router.replace('/(onboarding)');
      } else {
        router.replace('/(tabs)/calendar');
      }
    };

    // Décale la redirection pour laisser le RootLayout s'initialiser
    const t = setTimeout(() => {
      checkOnboarding();
    }, 0);

    return () => clearTimeout(t);
  }, [router]);

  return null;
};
