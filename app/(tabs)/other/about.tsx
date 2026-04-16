import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import { getOtherFromId } from '@/src/api/services/firestore/othersService';
import Markdown from 'react-native-markdown-display';


const AboutPage: React.FC = () => {
    const [message, setMessage] = React.useState("Chargement...");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getOtherFromId('about');
                console.log('data : ', data);
                setMessage(data.message || "Aucun message disponible.");
            } catch (error) {
                console.error("Error fetching about data:", error);
                setMessage("Erreur lors du chargement des données.");
            }
        };

        fetchData();
    }, []);

    const handlePress = (url: string) => {
        Linking.openURL(url);
    };

    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Markdown>
                    {message}
                </Markdown>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        backgroundColor: '#fff',
        marginTop: 20,
        paddingVertical: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    contactInfo: {
        marginLeft: 15,
        flex: 1,
    },
    contactLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
    },
});

export default AboutPage;