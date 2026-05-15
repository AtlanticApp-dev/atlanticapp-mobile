import React from 'react';
import { Stack } from 'expo-router';

const AuthLayout: React.FC = () => {
    return (
        <Stack screenOptions={{headerShown : false}}>
            <Stack.Screen name="connexion" options={{}}/>
            <Stack.Screen name="resetPassword" options={{}}/>
        </Stack>
    );
};

export default AuthLayout;