import { Stack } from 'expo-router';

export default function RootLayout() {

  return (
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false, title: 'Compétition'}} 
        />
        <Stack.Screen 
          name="sportDetail/[sport_id]" 
          options={({ route }) => ({
          title: route.params?.name + " - " + route.params?.categoryName || 'Titre',
          })}
        />
        <Stack.Screen
          name="generalRankingScreen"
          options={{
            title: 'Classement Général',
          }}
        />
      </Stack>
  );
}
