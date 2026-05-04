import React from 'react';
import { StyleSheet } from 'react-native';
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