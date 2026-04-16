import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getTeamFromId } from '@/src/api/services/firestore/teamsService';
import { getDelegationFromId } from '@/src/api/services/firestore/delegationService';
import { getPlaceFromId } from '@/src/api/services/firestore/placeService';
import { translateStatus } from '@/src/utils/matchMetadataTranslator';
import { getSportFromId } from '@/src/api/services/firestore/sportsService';
import { getCategoryFromSportIdAndId } from '@/src/api/services/firestore/categoryService';

interface Match {
    id: string;
    kind: string;
    category_id: string;
    sport_id: string;
    start_time: Date;
    status: string;
    team1_id: string;
    team2_id: string;
    team1_score?: number | number[];
    team2_score?: number | number[];
    title: string;
    description: string;
    place_id: string;
}

interface Delegation {
    id : string;
    color: string;
    image: string;
    title: string;
}

interface Sport {
    id: string;
    image: string;
    title: string;
    categories : any[];
}

interface Team {
    id: string;
    category: string;
    delegation_id: string;
    sport : string;
    description: string;
}

interface MatchCardProps {
    match: Match;
}

const HeadToHeadMatchCard: React.FC<MatchCardProps> = ({ match }) => {
    const [team1, setTeam1] = useState<Team | null>(null);
    const [team2, setTeam2] = useState<Team | null>(null);
    const [delegation1, setDelegation1] = useState<Delegation | null>(null);
    const [delegation2, setDelegation2] = useState<Delegation | null>(null);
    const [activeFetches, setActiveFetches] = useState<number>(0);
    const [location, setLocation] = useState<string | null>(null);
    const [sport, setSport] = useState<Sport | null>(null);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (match.teams[0]) {
                setActiveFetches(prev => prev + 1);
                try {
                    const teamData = await getTeamFromId(match.teams[0].id);
                    setTeam1(teamData);
                    const delegationData = await getDelegationFromId(teamData.delegation_id);
                    setDelegation1(delegationData);
                } catch (error) {
                    console.error('Error fetching team1 data:', error);
                } finally {
                    setActiveFetches(prev => prev - 1);
                }
            }
            if (match.teams[1]) {
                setActiveFetches(prev => prev + 1);
                try {
                    const teamData = await getTeamFromId(match.teams[1].id);
                    setTeam2(teamData);
                    const delegationData = await getDelegationFromId(teamData.delegation_id);
                    setDelegation2(delegationData);
                } catch (error) {
                    console.error('Error fetching team2 data:', error);
                } finally {
                    setActiveFetches(prev => prev - 1);
                }
            }
        };
        fetchData();
    }, [match.team1_id, match.team2_id]);

    useEffect(() => {
        const fetchPlace = async () => {
            if (match.place_id) {
                setActiveFetches(prev => prev + 1);
                try {
                    const placeData = await getPlaceFromId(match.place_id);
                    setLocation(placeData.title);
                } catch (error) {
                    console.error('Error fetching place data:', error);
                } finally {
                    setActiveFetches(prev => prev - 1);
                }
            }
        };
        fetchPlace();
    }, [match.place_id]);

    useEffect(() => {
        const fetchSport = async () => {
            if (match.sport_id) {
                setActiveFetches(prev => prev + 1);
                try {
                    const sportData = await getSportFromId(match.sport_id);
                    setSport(sportData);
                } catch (error) {
                    console.error('Error fetching sport data:', error);
                } finally {
                    setActiveFetches(prev => prev - 1);
                }
            }
        };
        fetchSport();
    }, [match.sport_id]);

    useEffect(() => {
        const fetchCategory = async () => {
            if (match.category_id){
                setActiveFetches(prev => prev + 1);
                try {
                    const categoryData = await getCategoryFromSportIdAndId(match.sport_id, match.category_id);
                    setCategory(categoryData);
                } catch (error) {
                    console.error('Error fetching category data:', error);
                } finally {
                    setActiveFetches(prev => prev - 1);
                }
            }
        }
        fetchCategory();
    }, [match.category_id]);

    const getDayOfWeek = (date: Date): string => {
        const days = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
        return days[(new Date(date)).getDay()];
    };

    if (activeFetches == 0){
        return (
            <TouchableOpacity style={styles.container} onPress={() => router.push(`/matches/head_to_head/${match.id}`)} onLongPress={() => null}>
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
                
                <View style={styles.teamsContainer}>
                    <View style={styles.teamInfo}>
                        <Image source={{ uri: delegation1?.image }} style={styles.teamLogo} />
                        <Text style={styles.teamName} numberOfLines={1}>{delegation1?.title} {team1?.description}</Text>
                    </View>
                    
                    <View style={styles.scoreContainer}>
                        <Text style={styles.vsText}>VS</Text>
                    </View>
                    
                    <View style={styles.teamInfo}>
                        <Image source={{ uri: delegation2?.image }} style={styles.teamLogo} />
                        <Text style={styles.teamName} numberOfLines={1}>{delegation2?.title} {team2?.description}</Text>
                    </View>
                </View> 
                
                <Text style={styles.venue}>{location}</Text>
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
            <View style={styles.teamsContainer}>
                <View style={styles.teamInfo}>
                    <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>Chargement...</Text>
                </View>
                <View style={styles.teamInfo}>
                    <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>Chargement...</Text>
                </View>
            </View>
            <Text style={styles.venue}>Chargement...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 10,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        minHeight: 180,
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
    teamsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    teamInfo: {
        flex: 2,
        alignItems: 'center',
    },
    teamLogo: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
        marginBottom: 4,
    },
    teamName: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    scoreContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrayScoreContainer : {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    score: {
        fontSize: 22,
        fontWeight: 'bold',
        marginHorizontal: 4,
    },
    scoreSeparator: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#666',
    },
    vsText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
    },
    venue: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
    categoryDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default HeadToHeadMatchCard;