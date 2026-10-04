import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList, Image, Dimensions, Alert} from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import SchoolPicker from '@/src/components/SchoolPicker';
import { getAllDelegations } from '@/src/api/services/firestore/delegationService';
import { updateUserSupportedTeam } from '@/src/api/services/firestore/usersService';

const width = Dimensions.get('window').width;

interface PreferencesProps {
    // Add your props here
}

const Preferences: React.FC<PreferencesProps> = () => {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSchoolID, setSelectedSchoolID] = useState<string | null>(null);
    const [selectedSchoolName, setSelectedSchoolName] = useState<string | null>(null);
    const [selectedSchoolImage, setSelectedSchoolImage] = useState<string | null>(null);
    const [selectedSchoolColor, setSelectedSchoolColor] = useState<string | null>(null);
    const [delegations, setDelegations] = useState<any[]>([]);
    const [loadingDelegations, setLoadingDelegations] = useState(true);
    const [loadingUser, setLoadingUser] = useState(false);

    const fetchDelegations = async () => {
        const delegations = await getAllDelegations();
        setDelegations(delegations);
        setLoadingDelegations(false);
    };

    const handleSchoolSelected = async (school_id : string | null) => {
        setLoadingUser(true);
        await updateUserSupportedTeam(school_id);
        setLoadingUser(false);
    }

    const nextStep = async () => {
        //TODO : enregistrer les préférences de l'utilisateur dans Firestore (école, sports, etc.) avant de passer à l'étape suivante        
        router.push('/(onboarding)/preferencesSports');
    };

    const continueOnboarding = async () => {
        if (selectedSchoolID === null || selectedSchoolID === 'null') {
            console.log("No school selected");
            Alert.alert(
                "Vous n'avez pas sélectionné d'école",
                "Êtes-vous sûr de vouloir continuer ?",
                [{ text: "Oui", onPress: nextStep },{ text: "Non", onPress: () => null }],
            );
            return;
        }
        else {
            await handleSchoolSelected(selectedSchoolID);
        }

        nextStep();
    };

    const handleSchoolPickerPress = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    React.useEffect(() => {
        setLoadingDelegations(true);
        fetchDelegations();
    }, []);

    React.useEffect(() => {
        if (selectedSchoolID && !loadingDelegations) {
            const selectedTeam = delegations.find(delegation => delegation.id === selectedSchoolID);
            if (selectedTeam) {
                setSelectedSchoolName(selectedTeam.title);
                setSelectedSchoolImage(selectedTeam.image);
                setSelectedSchoolColor(selectedTeam.color);
            } else {
                setSelectedSchoolName(null);
                setSelectedSchoolImage(null);
                setSelectedSchoolColor(null);
            }
        } else {
            setSelectedSchoolName(null);
            setSelectedSchoolImage(null);
            setSelectedSchoolColor(null);
        }
    }, [selectedSchoolID, loadingDelegations]);

    return (
        <SafeAreaView style={styles.main_container}>
            <View style={styles.title_container}>
                <Text style={styles.title}>De quelle école est-tu le supporter?</Text>
            </View>
            <View style={styles.delegation_selection_container}>
                <TouchableOpacity style={{height:'100%', aspectRatio:1}} onPress={handleSchoolPickerPress}>
                    <View style={{height:'100%', width:'100%'}}>
                        <SchoolPicker selectedSchoolID={selectedSchoolID} selectedSchoolName={selectedSchoolName} selectedSchoolImage={selectedSchoolImage} selectedSchoolColor={selectedSchoolColor} />
                    </View>
                    <Text style={{alignSelf:'center', fontSize:20, fontWeight:'bold'}}>{selectedSchoolName ? selectedSchoolName : 'Choisir une école'}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttons_container}>        
                <Button mode="contained" onPress={() => router.back()}>
                    Revenir en arrière
                </Button>    
                <Button mode="contained" onPress={continueOnboarding} loading={loadingUser}>
                    Suivant
                </Button>
            </View>

            {/* Add your preferences UI components here */}
            <Modal 
                visible={modalVisible}
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modal_container}>
                    <View style={styles.modal_list_container}>
                            <FlatList
                                numColumns={2}
                                data={delegations}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center'}}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => { setSelectedSchoolID(item.id); setModalVisible(false); AsyncStorage.setItem("atlanticup_team", item.id); }} style={styles.delegation_card}>
                                        <Image source={{ uri: item.image }} style={styles.delegation_card_image} />
                                        <Text style={styles.delegation_card_text}>{item.title}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <Button mode="contained" onPress={() => {setSelectedSchoolID(null); setModalVisible(false); AsyncStorage.setItem("atlanticup_team", 'null')}} style={{ marginTop: 20 }}>
                                Passer
                            </Button>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title_container: {
        flex:1,
        marginBottom: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    delegation_selection_container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,

    },
    buttons_container: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal:20,
    },
    modal_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    modal_list_container: {
        width: '100%',
        maxHeight: '80%',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    delegation_card: {
        width: width*0.3,
        aspectRatio: 1,
        margin: 10,
        marginVertical: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    delegation_card_image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 20,
        marginBottom: 10,
    },
    delegation_card_text: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 5,
    },
});

export default Preferences;