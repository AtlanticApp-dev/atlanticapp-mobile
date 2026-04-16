import { Stack } from 'expo-router';

export default function MapLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="placeDetail" options={{title: "Détails du lieu", headerBackTitle: "Carte"}} />
    </Stack>
  );
}
