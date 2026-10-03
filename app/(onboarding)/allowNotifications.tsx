import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkNotificationPermission } from '@/src/api/services/messaging/fcmService';

const AllowNotifications = () => {
    const router = useRouter();

    const handleContinue = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        checkNotificationPermission();
        router.replace('/(tabs)/calendar');
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.replace('/(tabs)/calendar');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Autoriser l'envoi de notifications</Text>
                <Text style={styles.description}>
                    Autorise les notifications pour recevoir des rappels importants, des mises à jour et des alertes concernant les événements sportifs.
                </Text>
                
                <TouchableOpacity 
                    style={styles.primaryButton} 
                    onPress={handleContinue}
                >
                    <Text style={styles.primaryButtonText}>
                        {'Activer les notifications'}
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.secondaryButton} 
                    onPress={handleSkip}
                >
                    <Text style={styles.secondaryButtonText}>Pas maintenant</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        color: '#666',
    },
    primaryButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AllowNotifications;