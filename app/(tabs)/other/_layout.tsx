import { Stack } from 'expo-router';

export default function RootLayout() {

  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, title:"Autre"}} />
        <Stack.Screen name="announcements" options={{ headerTitle:"Annonces", title:"Annnonces"}}/>
        <Stack.Screen name="contact" options={{ headerTitle:"Contact"}}/>
        <Stack.Screen name="rules" options={{ headerTitle:"Règles"}}/>
        <Stack.Screen name="lunch" options={{ headerTitle:"Repas - Horaires et prix"}}/>
        <Stack.Screen name="about" options={{ headerTitle:"À propos"}}/>
      </Stack>
  );
}
