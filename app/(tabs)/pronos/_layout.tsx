import { Stack } from 'expo-router';

export default function PronosLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false, title: 'Pronos' }} 
      />
      <Stack.Screen
        name="myBets"
        options={{ title: 'Mes Pronostics' }}
      />
      <Stack.Screen
        name="sportLeaderboard/[sport_id]"
        options={{ title: 'Classement par Sport' }}
      />
    </Stack>
  );
}
