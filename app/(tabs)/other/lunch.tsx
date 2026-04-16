import { getOtherFromId } from '@/src/api/services/firestore/othersService';
import { getPlaceFromId } from '@/src/api/services/firestore/placeService';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import Markdown from 'react-native-markdown-display';

const LunchScreen: React.FC = () => {
    const router = useRouter();
    const [activeFetches, setActiveFetches] = useState(0);
    const [message, setMessage] = useState("");
    const [placeId, setPlaceId] = useState(null);
    const [place, setPlace] = useState("Voir sur la carte");

    const fetchLunchData = async () => {
        setActiveFetches(prev => prev + 1);
        try {
            const data = await getOtherFromId('lunch');
            setMessage(data.message || "Aucun message disponible.");
            setPlaceId(data.place_id || null);
        } catch (error) {
            console.error("Error fetching lunch data:", error);
            setMessage("Erreur lors du chargement des données.");
        } finally {
            setActiveFetches(prev => prev - 1);
        }
    };

    const fetchPlaceData = async (id: string) => {
        setActiveFetches(prev => prev + 1);
        
        try {
            const place = await getPlaceFromId(id);
            if (place && place.title) {
                setPlace(place.title);
            }
        } catch (error) {
            console.error("Error fetching place data:", error);
        } finally {
            setActiveFetches(prev => prev - 1);
        }
    };


    useEffect(() => {
        fetchLunchData();
    }, []);

    useEffect(() => {
        if (placeId) {
            fetchPlaceData(placeId);
        }
    }, [placeId]);

    const redirectToMap = () => {
        if (placeId){
            router.navigate(`/map?location=${placeId}`);
        }
        else{
            console.warn('Lieu introuvable');
        }
    };

    if (activeFetches > 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Repas</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.subtitle}>Chargement...</Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Repas</Text>

                <View style={styles.section}> 
                    <Markdown>
                        {message}
                    </Markdown>
                </View>
                <View style={{ alignItems: 'center'}}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#3495eb', padding: 15, borderRadius: 20 }} onPress={redirectToMap}>
                        <Image source={require('@/assets/images/icons/locate-outline.png')} style={{ width: 25, height: 25, tintColor: 'white' }} />
                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}>{placeId == null ? "Voir sur la carte" : place} </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },
    header: {
        padding: 20,
        paddingTop: 60,
    },
    section: {
        marginBottom: 20,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default LunchScreen;
