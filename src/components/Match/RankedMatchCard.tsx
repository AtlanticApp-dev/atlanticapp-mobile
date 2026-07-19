import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { usePlace } from '@/src/api/services/firestore/placeService';
import { useSport } from '@/src/api/services/firestore/sportsService';
import { translatePhase, translateStatus } from '@/src/utils/matchMetadataTranslator';
import { useCategory } from '@/src/api/services/firestore/categoryService';


interface Match {
    id: string;
    kind: string;
    category_id: string;
    sport_id: string;
    start_time: Date;
    status: string;
    title: string;
    description: string;
    place_id: string;
}

interface Sport {
    id: string;
    image: string;
    title: string;
    categories : any[];
}

interface MatchCardProps {
    match: Match;
}

const RankedMatchCard: React.FC<MatchCardProps> = ({ match }) => {

    const {
        data: category,
        isLoading: isCategoryLoading,
        error: categoryError,
    } = useCategory(match.sport_id, match.category_id);

    const {
        data: place,
        isLoading: isPlaceLoading,
        error: placeError,
    } = usePlace(match.place_id);

    const {
        data: sport,
        isLoading: isSportLoading,
        error: sportError,
    } = useSport(match.sport_id);

    const getDayOfWeek = (date: Date): string => {
        const days = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
        return days[(new Date(date)).getDay()];
    };

    if (!isCategoryLoading && !isPlaceLoading && !isSportLoading && category && place && sport) {
        return (
            <TouchableOpacity style={styles.container} onPress={() => router.push(`/matches/ranked/${match.id}`)} onLongPress={() => null}>
                <View style={styles.header}>
                    <Text style={styles.dateTime}>{getDayOfWeek(match.start_time)} {(new Date(match.start_time)).getHours()}:{(new Date(match.start_time)).getMinutes().toString().padStart(2, "0")}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={{ uri: sport?.image }} style={styles.sportImage} />
                        <Text style={styles.categoryDescription}>{category?.description}</Text>
                    </View>
                    <Text style={[styles.status, 
                        match.status === 'live' ? styles.liveStatus : 
                        match.status === 'completed' ? styles.completedStatus : 
                        match.status === 'incoming' ? styles.incomingStatus :
                        match.status === 'cancelled' ? styles.cancelledStatus :
                        styles.incomingStatus]}>
                        {translateStatus(match.status).toUpperCase()}
                    </Text>
                </View>
                        
                <View style={styles.content_container}>
                    <Text style={styles.title} numberOfLines={1}>{sport?.title}</Text>
                    <Text style={styles.title} numberOfLines={1}>{translatePhase(match.phase)}</Text>
                </View>
                
                <Text style={styles.venue}>{place?.title}</Text>
            </TouchableOpacity>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.dateTime}>Chargement...</Text>
                <Text style={[styles.status, styles.incomingStatus]}>
                    Chargement...
                </Text>
            </View>
            <Text style={styles.venue}>Chargement...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minHeight: 220,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sportImage: {
        width: 40,
        height: 40,
        tintColor: '#000',
        marginRight: 5,
    },
    content_container: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#444',
        marginBottom: 8,
    },
    dateTime: {
        fontSize: 14,
        color: '#666',
    },
    status: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        height: 24,
    },
    liveStatus: {
        backgroundColor: '#FF4D4F',
        color: '#FFFFFF',
    },
    completedStatus: {
        backgroundColor: '#52C41A',
        color: '#FFFFFF',
    },
    incomingStatus: {
        backgroundColor: '#1890FF',
        color: '#FFFFFF',
    },
    cancelledStatus: {
        backgroundColor: '#FF4D4F',
        color: '#FFFFFF',
    },
    venue: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
    categoryDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default RankedMatchCard;