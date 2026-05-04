import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Modal, TouchableOpacity, ScrollView, RefreshControl, Dimensions, TextInput, Alert } from 'react-native';
import { Menu, Button } from 'react-native-paper';
import { atlanticupUpdateMatchStatus } from '@/src/api/services/atlanticupBackendFunctions';
import { getSportFromId } from '@/src/api/services/firestore/sportsService';
import { getUserFromUid } from '@/src/api/services/firestore/usersService';
import { getMatchFromId, updateHeadToHeadMatchScore } from '@/src/api/services/firestore/matchService';
import { getTeamFromId } from '@/src/api/services/firestore/teamsService';
import { getDelegationFromId } from '@/src/api/services/firestore/delegationService';
import { getPlaceFromId } from '@/src/api/services/firestore/placeService';
import auth from '@react-native-firebase/auth';
import ScreenLoader from '@/src/components/ScreenLoader';
import { useLocalSearchParams, useRouter} from 'expo-router';
import { EnrichedMatch } from '@/types/enrichedModels';
import { getCategoryFromSportIdAndId } from '@/src/api/services/firestore/categoryService';
import { translatePhase, translateStatus } from '@/src/utils/matchMetadataTranslator';

const width = Dimensions.get('window').width;


interface Team{
    id : string;
    category: string;
    delegation_id: string;
    description: string;
    sport: string;
}

interface Delegation {
    id: string;
    title: string;
    color: string;
    image: string;
}

const MatchPage: React.FC = () => {
    const router = useRouter();
    const match_id = useLocalSearchParams().id;
    const [match, setMatch] = useState<EnrichedMatch | null>(null);
    const [activeFetches, setActiveFetches] = useState(0);
    const [sport, setSport] = useState<any | null>(null);
    const [team1, setTeam1] = useState<Team | null>(null);
    const [team2, setTeam2] = useState<Team | null>(null);
    const [delegation1, setDelegation1] = useState<Delegation | null>(null);
    const [delegation2, setDelegation2] = useState<Delegation | null>(null);
    const [location, setLocation] = useState<any | null>(null);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [dropDownMenuVisible, setDropDownMenuVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [hasNecessaryPermissions, setHasNecessaryPermissions] = useState(false);

    const [team1UpdatedScore, setTeam1UpdatedScore] = useState<number | number[] | null>(null);
    const [team2UpdatedScore, setTeam2UpdatedScore] = useState<number | number[] | null>(null);

    const checkPermissions = async () => {
        const currentUser = auth().currentUser;
        if (currentUser) {
            const userData = await getUserFromUid(currentUser.uid);
            if (userData) {
                const role = userData.role;
                if (role == 'admin') {
                    setHasNecessaryPermissions(true);
                } else if (role == 'responsable') {
                    const sport_permissions = userData.sport_permissions || [];
                    setHasNecessaryPermissions(sport_permissions.includes(sport.id));
                } else {
                    setHasNecessaryPermissions(false);
                }
            } else {
                setHasNecessaryPermissions(false);
            }
        }
    };

    const submitArrayScore = (scoreString: string | null) : number[] | null => {
        if (!scoreString) return [0];
        const scoreArray = scoreString.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 0);
        return scoreArray.length > 0 ? scoreArray : [0];
    };

    const submitArrayScores = async () => {
        try {
            const team1Scores = submitArrayScore(team1UpdatedScore ? team1UpdatedScore.toString() : null);
            const team2Scores = submitArrayScore(team2UpdatedScore ? team2UpdatedScore.toString() : null);
            if (team1Scores.length != team2Scores.length) {
                Alert.alert('Erreur', "Les deux équipes doivent avoir le même nombre de sets.");
                return;
            }
            setTeam1UpdatedScore(team1Scores as number[]);
            setTeam2UpdatedScore(team2Scores as number[]);
            try {
                await updateHeadToHeadMatchScore(match.id, match.sport_id, team1Scores, team2Scores);
                fetchMatch(match_id);
            } catch (error) {
                console.error('Error updating score:', error);
                Alert.alert('Erreur', "Une erreur est survenue lors de la mise à jour du score.");
            }
            closeModal();
        } catch (error) {
            console.error('Error submitting array scores:', error);
        }
    }

    const updateScore = async () => {
        try {
            await updateHeadToHeadMatchScore(match.id, match.sport_id, team1UpdatedScore, team2UpdatedScore);
            fetchMatch(match_id);
        } catch (error) {
            console.error('Error updating score:', error);
            Alert.alert('Erreur', "Une erreur est survenue lors de la mise à jour du score.");
        }
        closeModal();
    };

    const fetchSport = async (sport_id: string | null) => {
        setActiveFetches(prev => prev + 1);
        sport_id ? await getSportFromId(sport_id).then(sport => {setSport(sport); setActiveFetches(prev => prev - 1)}) : (setSport(null), setActiveFetches(prev => prev - 1));
    };

    const fetchMatch = async (match_id : string | null) => {
        setActiveFetches(prev => prev + 1);
        match_id ? await getMatchFromId(match_id).then(newMatch => {setMatch(newMatch); setActiveFetches(prev => prev - 1)}) : (setMatch(null), setActiveFetches(prev => prev - 1));
    };

    const fetchTeams = async (team1_id : string | null, team2_id : string | null) => {
        setActiveFetches(prev => prev + 2);
        team1_id ? await getTeamFromId(team1_id).then(newTeam1 => {setTeam1(newTeam1); setActiveFetches(prev => prev - 1)}) : (setTeam1(null), setActiveFetches(prev => prev - 1));
        team2_id ? await getTeamFromId(team2_id).then(newTeam2 => {setTeam2(newTeam2); setActiveFetches(prev => prev - 1)}) : (setTeam2(null), setActiveFetches(prev => prev - 1));
    }

    const fetchDelegations = async (delegation1_id : string, delegation2_id : string) => {
        setActiveFetches(prev => prev + 2);
        getDelegationFromId(delegation1_id).then(delegation => {setDelegation1(delegation); setActiveFetches(prev => prev - 1)});
        getDelegationFromId(delegation2_id).then(delegation => {setDelegation2(delegation); setActiveFetches(prev => prev - 1)});
    }

    const fetchLocation = async (place_id : string | null) => {
        setActiveFetches(prev => prev + 1);
        place_id ? await getPlaceFromId(place_id).then(location => {setLocation(location); setActiveFetches(prev => prev - 1)}) : (setLocation(null), setActiveFetches(prev => prev - 1));
    };

    const onRefresh = useCallback(() => {
        checkPermissions();
        fetchMatch(match_id);
    }, []);

    useEffect(() => {
        checkPermissions();
        fetchMatch(match_id);
    }, []);

    useEffect(() => {
        setTeam1UpdatedScore(match?.teams[0]?.score as number || 0);
        setTeam2UpdatedScore(match?.teams[1]?.score as number || 0);
    }, [match]);

    useEffect(() => {
    }, [activeFetches]);

    useEffect(() => {
        if (match){
            setCategoryId(match.category_id);
            fetchTeams(match.teams[0].id, match.teams[1].id);
            fetchLocation(match.place_id);
            fetchSport(match.sport_id);
        }
    }, [match]);

    useEffect(() => {
        if (team1 && team2) {
            fetchDelegations(team1.delegation_id, team2.delegation_id);
        }
    }, [team1, team2]);

    useEffect(() => {
        const fetchCategory = async () => {
            if (sport && categoryId) {
                const category = await getCategoryFromSportIdAndId(sport.id, categoryId);
                if (category) {
                    setCategoryName(category.description);
                } else {
                    setCategoryName(null);
                }
            } else {
                setCategoryName(null);
            }
        };
        
        fetchCategory();
        checkPermissions();
    }, [categoryId, sport]);


    const openDropDownMenu = () => {
        setDropDownMenuVisible(true);
    };

    const closeDropDownMenu = () => {
        setDropDownMenuVisible(false);
    };

    const openModal = () => {
        setUpdateModalVisible(true);
    };

    const closeModal = () => {
        setUpdateModalVisible(false);
    };

    const updateMatchStatus = async (newStatus: string) => {
        try {
            await atlanticupUpdateMatchStatus(match_id, newStatus);
        } catch (error) {
            console.error("Error updating match status:", error);
        }
        fetchMatch(match_id);
    };

    const redirectToMap = () => {
        if (location){
            router.navigate(`/map?location=${location.id}`);
        }
        else{
            console.warn('Lieu introuvable');
        }
    };

    const redirectToSport = () => {
        if (sport){
            router.navigate(`/competition`);
            setTimeout(() => {
                router.navigate(`/competition/sportDetail/${sport.id}?name=${sport.title}&categoryName=${categoryName}&categoryId=${categoryId}`);
            }, 50);
        }
        else{
            console.warn('Sport introuvable');
        }
    }

    const renderScore = (score: number | array) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {Array.isArray(score) ? (
                    score.map((s:number, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'black', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 5, marginHorizontal: 2 }}>
                            <Text style={{ fontSize: 24, color: 'white' }}>{s}</Text>
                        </View>
                    ))
                ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'black', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 5, marginHorizontal: 2 }}>
                        <Text style={{ fontSize: 24, color: 'white' }}>{score}</Text>
                    </View>
                )}
            </View>
        );
    };

    const renderNumberScoreModal = () => (
        <View style={styles.modal_background}>
            <View style={styles.modal_content}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Modifier le score</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{ flex: 1, fontSize: 16 }}>Score équipe 1:</Text>
                    <TouchableOpacity 
                        style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 5 }}
                        onPress={() => setTeam1UpdatedScore(Math.max(0, (team1UpdatedScore || 0) - 1))}
                    >
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 15, fontSize: 18, fontWeight: 'bold' }}>
                        {team1UpdatedScore || 0}
                    </Text>
                    <TouchableOpacity 
                        style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 5 }}
                        onPress={() => setTeam1UpdatedScore((team1UpdatedScore || 0) + 1)}
                    >
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ flex: 1, fontSize: 16 }}>Score équipe 2:</Text>
                    <TouchableOpacity 
                        style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 5 }}
                        onPress={() => setTeam2UpdatedScore(Math.max(0, (team2UpdatedScore || 0) - 1))}
                    >
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 15, fontSize: 18, fontWeight: 'bold' }}>
                        {team2UpdatedScore || 0}
                    </Text>
                    <TouchableOpacity 
                        style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 5 }}
                        onPress={() => setTeam2UpdatedScore((team2UpdatedScore || 0) + 1)}
                    >
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+</Text>
                    </TouchableOpacity>
                </View>
                <Button mode="contained" onPress={updateScore} style={{ marginBottom: 10 }}>
                    Valider
                </Button>
                <Button onPress={closeModal}>Annuler</Button>
            </View>
        </View>
    );

    const renderArrayScoreModal = () => (
        <View style={styles.modal_background}>
            <View style={styles.modal_content}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Modifier le score</Text>
            
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Équipe 1: {delegation1?.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <TextInput
                style={{ 
                    flex: 1, 
                    borderWidth: 1, 
                    borderColor: '#ccc', 
                    borderRadius: 5, 
                    padding: 10, 
                    fontSize: 16,
                    textAlign: 'center'
                }}
                placeholder="Ex: 21,19,21"
                value={team1UpdatedScore ? team1UpdatedScore.toString() : ''}
                onChangeText={(text) => setTeam1UpdatedScore(text)}
                multiline
                />
            </View>

            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Équipe 2: {delegation2?.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TextInput
                style={{ 
                    flex: 1, 
                    borderWidth: 1, 
                    borderColor: '#ccc', 
                    borderRadius: 5, 
                    padding: 10, 
                    fontSize: 16,
                    textAlign: 'center'
                }}
                placeholder="Ex: 18,21,19"
                value={team2UpdatedScore ? team2UpdatedScore.toString() : ''}
                onChangeText={(text) => setTeam2UpdatedScore(text)}
                multiline
                />
            </View>

            <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 15 }}>
                Séparez les scores par des virgules (ex: 21,19,21)
            </Text>

            <Button mode="contained" onPress={submitArrayScores} style={{ marginBottom: 10 }}>
                Valider
            </Button>
            <Button onPress={closeModal}>Annuler</Button>
            </View>
        </View>
    );

    const matchStatus = (() => {
        if (match) {
            return translateStatus(match.status);
        } else {
            return "Inconnu";
        }
    })();

    const phase = (() => {
        if (match){
            return translatePhase(match.phase);
        } else {    
            return "Inconnu";
        }
    })();

    if (activeFetches>0 || !match || !team1 || !team2 || !delegation1 || !delegation2) {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <View style={styles.screen_loader_container}>
                    <ScreenLoader/>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flex: 1, width: width }} scrollEnabled={false} refreshControl={<RefreshControl refreshing={activeFetches>0} onRefresh={onRefresh} />}>
                <View style={styles.upper_container}>
                    <View style={{ position: 'absolute', top: -30, left: -30, opacity: 0.1, transform: [{ rotate: '-30deg' }] }}>
                        <Image source={{ uri: delegation1.image }} style={{ width: 250, height: 250 }} />
                    </View>
                    <View style={{ position: 'absolute', bottom: -30, right: -50, opacity: 0.1, transform: [{ rotate: '-30deg' }] }}>
                        <Image source={{ uri: delegation2.image }} style={{ width: 250, height: 250 }} />
                    </View>

                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center', margin: 10 }}>{translatePhase(match.phase)}</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginBottom: 30 }}>{match.description}</Text>
                    </View>

                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <View style={{ margin: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{delegation1.title} {delegation1.description}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                        </View>
                    </View>

                    <View style={{ margin: 5, alignItems: 'flex-start' }}>
                        {match && renderScore(match.teams[0].score)}
                    </View>

                    {hasNecessaryPermissions ?
                        <Menu
                            visible={dropDownMenuVisible}
                            onDismiss={closeDropDownMenu}
                            anchor={<Button onPress={openDropDownMenu}>{matchStatus}</Button>}
                        >
                            <Menu.Item onPress={() => { updateMatchStatus("completed"); closeDropDownMenu(); }} title="Terminé" />
                            <Menu.Item onPress={() => { updateMatchStatus("live"); closeDropDownMenu(); }} title="En cours" />
                            <Menu.Item onPress={() => { updateMatchStatus("incoming"); closeDropDownMenu(); }} title="À venir" />
                            <Menu.Item onPress={() => { updateMatchStatus("cancelled"); closeDropDownMenu(); }} title="Annulé" />
                        </Menu>
                        :
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, borderRadius: 3 }}>
                            <Text style={{ fontSize: 12, color: 'black' }}>{matchStatus}</Text>
                        </View>
                    }

                    <View style={{ margin: 5, alignItems: 'flex-start' }}>
                        {match && renderScore(match.teams[1].score)}
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                        </View>

                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <View style={{ margin: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{delegation2.title} {delegation2.description}</Text>
                            </View>
                        </View>
                    </View>

                </View>
                <View style={styles.lower_container}>
                    {sport &&
                        <TouchableOpacity style={{ padding: 10, margin: 10, borderRadius: 15, backgroundColor: '#76b9f5' }} onPress={redirectToSport}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>Plus sur la section {sport.title} - {categoryName}</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#3495eb', padding: 15, borderRadius: 20 }} onPress={redirectToMap}>
                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}>{location == null ? "Voir sur la carte" : location.title} </Text>
                        <Image source={require('@/assets/images/icons/locate-outline.png')} style={{ width: 25, height: 25, tintColor: 'white' }} />
                    </TouchableOpacity>
                    {hasNecessaryPermissions ?
                        <TouchableOpacity style={{ backgroundColor: '#0269c4', margin: 10, padding: 10, borderRadius: 20 }} onPress={openModal}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>Modifier le score</Text>
                        </TouchableOpacity>
                        : null}
                </View>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={updateModalVisible}
                onRequestClose={closeModal}
            >
                {sport.scoring_type == 'array' ? renderArrayScoreModal() : renderNumberScoreModal()}
                {/*<View style={styles.modal_background}>
                    <View style={styles.modal_content}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Modifier le score</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ flex: 1, fontSize: 16 }}>Score équipe 1:</Text>
                        <TouchableOpacity 
                            style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 5 }}
                            onPress={() => setTeam1UpdatedScore(Math.max(0, (team1UpdatedScore || 0) - 1))}
                        >
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 15, fontSize: 18, fontWeight: 'bold' }}>
                            {team1UpdatedScore || 0}
                        </Text>
                        <TouchableOpacity 
                            style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 5 }}
                            onPress={() => setTeam1UpdatedScore((team1UpdatedScore || 0) + 1)}
                        >
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{ flex: 1, fontSize: 16 }}>Score équipe 2:</Text>
                        <TouchableOpacity 
                            style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 5 }}
                            onPress={() => setTeam2UpdatedScore(Math.max(0, (team2UpdatedScore || 0) - 1))}
                        >
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 15, fontSize: 18, fontWeight: 'bold' }}>
                            {team2UpdatedScore || 0}
                        </Text>
                        <TouchableOpacity 
                            style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 5 }}
                            onPress={() => setTeam2UpdatedScore((team2UpdatedScore || 0) + 1)}
                        >
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Button mode="contained" onPress={updateScore} style={{ marginBottom: 10 }}>
                        Valider
                    </Button>
                    <Button onPress={closeModal}>Annuler</Button>
                    </View>
                </View>*/}
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    upper_container: {
        flex: 6,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lower_container: {
        flex: 4,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal_background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    modal_content: {
        width: '80%',
        padding: 20,
        borderRadius: 15,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    screen_loader_container: {
        height:250,
        width:250,
    },
});

export default MatchPage;
