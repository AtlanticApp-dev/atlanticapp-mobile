import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView, RefreshControl, Dimensions, Alert } from 'react-native';
import { Menu, Button } from 'react-native-paper';
import { getSportFromId } from '@/src/api/services/firestore/sportsService';
import { getUserFromUid } from '@/src/api/services/firestore/usersService';
import { getMatchFromId, updateRankedMatchRanking } from '@/src/api/services/firestore/matchService';
import { getTeamFromId } from '@/src/api/services/firestore/teamsService';
import { getDelegationFromId } from '@/src/api/services/firestore/delegationService';
import { getPlaceFromId } from '@/src/api/services/firestore/placeService';
import auth from '@react-native-firebase/auth';
import ScreenLoader from '@/src/components/ScreenLoader';
import { useLocalSearchParams, useRouter} from 'expo-router';
import { getCategoryFromSportIdAndId } from '@/src/api/services/firestore/categoryService';
import { translatePhase, translateStatus } from '@/src/utils/matchMetadataTranslator';
import { atlanticupUpdateMatchStatus } from '@/src/api/services/atlanticupBackendFunctions';
import { FlatList } from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';

interface Props {
}

interface Match {
    id: string;
    kind: string;
    sport_id: string;
    start_time: any;
    status: string;
    teams: Array<{ id: string; delegation: { color: string; image: string; title: string }; description: string }>;
    title: string;
    description: string;
    category : string;
    place_id : string | null;
}

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

const MatchPage: React.FC<Props> = () => {
    const router = useRouter();
    const match_id = useLocalSearchParams().id.toString();
    const [match, setMatch] = useState<Match | null>(null);
    const [activeFetches, setActiveFetches] = useState(0);
    const [hasNecessaryPermissions, setHasNecessaryPermissions] = useState(false);
    const [sport, setSport] = useState<any | null>(null);
    const [teams, setTeams] = useState<Array<Team> | null>(null);
    const [updatedTeams, setUpdatedTeams] = useState<string[]>([]);
    const [delegations, setDelegations] = useState<Array<Delegation> | null>(null);
    const [location, setLocation] = useState<any | null>(null);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [dropDownMenuVisible, setDropDownMenuVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);

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

    const updateRanking = async () => {
        try {
            await updateRankedMatchRanking(match_id, updatedTeams);
            fetchMatch(match_id);
        } catch (error) {
            console.error('Error updating ranking:', error);
            Alert.alert('Erreur', "Une erreur est survenue lors de la mise à jour du classement.");
        }
        closeModal();
    };

    const updateMatchStatus = async (newStatus: string) => {
        try {
            await atlanticupUpdateMatchStatus(match_id, newStatus);
        } catch (error) {
            console.error("Error updating match status:", error);
        }
        fetchMatch(match_id);
    };

    const fetchSport = async (sport_id: string | null) => {
        setActiveFetches(prev => prev + 1);
        sport_id ? await getSportFromId(sport_id).then(sport => {setSport(sport); setActiveFetches(prev => prev - 1)}) : (setSport(null), setActiveFetches(prev => prev - 1));
    };

    const fetchMatch = async (match_id : string | null) => {
        setActiveFetches(prev => prev + 1);
        match_id ? await getMatchFromId(match_id).then(newMatch => {setMatch(newMatch); setActiveFetches(prev => prev - 1)}) : (setMatch(null), setActiveFetches(prev => prev - 1));
    };

    const fetchTeams = async (teamIds: Array<string>) => {
        setActiveFetches(prev => prev + 1);
        const teamsData = await Promise.all(teamIds.map(id => getTeamFromId(id)));
        setTeams(teamsData);
        setActiveFetches(prev => prev - 1);
    };

    const fetchDelegations = async (delegationIds: Array<string>) => {
        setActiveFetches(prev => prev + 1);
        const delegationsData = await Promise.all(delegationIds.map(id => getDelegationFromId(id)));
        setDelegations(delegationsData);
        setActiveFetches(prev => prev - 1);
    };

    const fetchLocation = async (place_id : string | null) => {
        setActiveFetches(prev => prev + 1);
        place_id ? await getPlaceFromId(place_id).then(location => {setLocation(location); setActiveFetches(prev => prev - 1)}) : (setLocation(null), setActiveFetches(prev => prev - 1));
    };

    useEffect(() => {
        checkPermissions();
        fetchMatch(match_id);
    }, []);

    useEffect(() => {
        if (match){
            setCategoryId(match.category_id);
            fetchLocation(match.place_id);
            fetchSport(match.sport_id);
            fetchTeams(match.teams);
        }
    }, [match]);

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

    useEffect(() => {
        if (teams && teams.length > 0) {
            const delegationIds = teams.map(team => team.delegation_id);
            fetchDelegations(delegationIds);
        }
        setUpdatedTeams(teams?.map(team => team.id) || []);
    }, [teams]);

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
    };

    const renderTeam = (team, index:number) => {
        const delegation = delegations?.find(d => d.id === team.delegation_id);
        const getColor = (index:number) => {
            switch (index) {
                case 0:
                    return 'gold';
                case 1:
                    return 'silver';
                case 2:
                    return '#cd7f32';
                default:
                    return 'transparent';
            }
        };
        const color = (match.status == 'completed' || match.status == 'live') ? getColor(index) : 'transparent';

        return (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center'}}>
                <View style={{backgroundColor:color, width:5, height:'100%'}}>

                </View>
                {delegation && 
                    <Image source={{ uri: delegation.image }} style={{ width: 60, height: 60, marginHorizontal:10}} />
                }
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 22 }} numberOfLines={1}>{delegation ? delegation.title : 'Inconnu'}</Text>
                    <Text style={{ fontSize: 14 }} numberOfLines={1}>{team.description}</Text>
                </View>
            </View>
        );
    };

    if (activeFetches>0 || !match || !teams || !delegations) {
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
                <View style={styles.content_container}>
                    <View style={{width:'100%', height:'100%'}}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center', margin: 10 }}>{translatePhase(match.phase)}</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 5}}>{match.description}</Text>
                            {hasNecessaryPermissions ? 
                                (
                                    <Menu
                                        visible={dropDownMenuVisible}
                                        onDismiss={closeDropDownMenu}
                                        anchor={<Button onPress={openDropDownMenu}>{translateStatus(match.status)}</Button>}
                                    >
                                        <Menu.Item onPress={() => { updateMatchStatus("completed"); closeDropDownMenu(); }} title="Terminé" />
                                        <Menu.Item onPress={() => { updateMatchStatus("live"); closeDropDownMenu(); }} title="En cours" />
                                        <Menu.Item onPress={() => { updateMatchStatus("incoming"); closeDropDownMenu(); }} title="À venir" />
                                        <Menu.Item onPress={() => { updateMatchStatus("cancelled"); closeDropDownMenu(); }} title="Annulé" />
                                    </Menu>
                                )
                                :
                                (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, borderRadius: 3 }}>
                                        <Text style={{ fontSize: 12, color: 'black' }}>{translateStatus(match.status)}</Text>
                                    </View>
                                )
                            }

                        <View style={{flex:1}}>
                            <FlatList
                                data={teams}
                                renderItem={({ item, index }) => renderTeam(item, index)}
                                keyExtractor={(item) => item.id.toString()}
                                contentContainerStyle={{flex:1}}
                            />
                        </View>
                    </View>

                </View>
                <View style={styles.option_buttons_container}>
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
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>Modifier le classement</Text>
                        </TouchableOpacity>
                        : null}
                </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={updateModalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modal_background}>
                    <View style={styles.modal_content}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20}}>Modifier le classement</Text>
                        <View style={{flex:1}}>
                        <DraggableFlatList
                            data={teams}
                            renderItem={({ item, drag, isActive, getIndex}) => (
                                <TouchableOpacity
                                    style={[
                                        {
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 10,
                                            marginVertical: 5,
                                            backgroundColor: isActive ? '#e0e0e0' : 'white',
                                            borderRadius: 8,
                                            borderWidth: 1,
                                            width: '100%',
                                            borderColor: '#ccc'
                                        }
                                    ]}
                                    onLongPress={drag}
                                >
                                    <Text style={{ marginRight: 10, fontWeight: 'bold'}}>{getIndex() !== undefined ? getIndex()! + 1 : ''}</Text>
                                    {delegations && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', overflow: 'hidden', width:"90%"}}>
                                            <Image 
                                                source={{ uri: delegations.find(d => d.id === item.delegation_id)?.image }} 
                                                style={{ width: 40, height: 40 }} 
                                            />
                                            <Text style={{ marginLeft: 10, color: '#666' }}>{item.description}</Text>
                                        </View>
                                    )}
                                    <View style={{ position:'absolute', right:10, alignItems: 'flex-end'}}>
                                        <Text style={{ marginLeft: 10, color: '#666' }}>⋮⋮</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id}
                            onDragEnd={({ data }) => setUpdatedTeams(data.map(item => item.id))}
                        />
                    </View>
                    <Button mode="contained" onPress={updateRanking} style={{ marginBottom: 10 }}>
                        Valider
                    </Button>
                    <Button onPress={closeModal}>Annuler</Button>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    content_container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal:30,
        paddingBottom: 100,
        paddingTop:30,
    },
    option_buttons_container: {
        position:'absolute',
        bottom:50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal_background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal_content: {
        height: '60%',
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    screen_loader_container: {
        height:250,
        width:250,
    },
});

export default MatchPage;
