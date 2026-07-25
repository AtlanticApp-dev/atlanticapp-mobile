import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { getMatchesFromSportIdAndCategory, getMatchesFromSportIdAndCategoryIdAndPhaseId } from '@/src/api/services/firestore/matchService';
import { useGroups } from '@/src/api/services/firestore/rankingService';
import EventCard from '@/src/components/Event/EventCard';
import { translatePhase } from '@/src/utils/matchMetadataTranslator';

const ITEMS_PER_PAGE = 10;

interface SportMatchesTabProps {
    sport_id: any;
    category_id: any;
}

const SportMatchesTab: React.FC<SportMatchesTabProps> = ({sport_id, category_id}) => {
    const [matches, setMatches] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [lastDoc, setLastDoc] = useState<any | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Récupérer tous les groupes pour cette compétition
    const { data: groups = [] } = useGroups(sport_id, category_id);

    // Liste des phases possibles
    const allPhases = [
        { id: null, label: 'Toutes les phases' },
        { id: 'gs', label: 'Phase de groupes' },
        { id: '16f', label: 'Seizième de finale' },
        { id: '8f', label: 'Huitième de finale' },
        { id: '4f', label: 'Quart de finale' },
        { id: '2f', label: 'Demi-finale' },
        { id: '3f', label: 'Match pour la 3ème place' },
        { id: 'f', label: 'Finale' },
        { id: 'q', label: 'Qualifications' },
        { id: 'p', label: 'Matchs de placement' },
        { id: 'c', label: 'Consolante' }
    ];

    useEffect(() => {
        fetchMatches(sport_id);
    }, []);

    const fetchMatches = async (sport_id: string, phase?: string | null) => {
        setRefreshing(true);
        setLastDoc(null);
        setHasMore(true);
        
        try {
            let result;
            if (phase) {
                result = await getMatchesFromSportIdAndCategoryIdAndPhaseId({
                    sportId: sport_id,
                    categoryId: category_id,
                    phaseId: phase,
                    lastDoc: null
                });
            } else {
                result = await getMatchesFromSportIdAndCategory({
                    sportId: sport_id,
                    categoryId: category_id,
                    lastDoc: null
                });
            }
            setMatches(result.matches);
            setLastDoc(result.lastDoc);
        } catch (err) {
            console.error('Erreur lors du fetch des matches:', err);
        }
        setRefreshing(false);
    };

    const handlePhaseSelect = (phase: string | null) => {
        setSelectedPhase(phase);
        setModalVisible(false);
        fetchMatches(sport_id, phase);
    };

    const turnIntoSectionList = (matches: any[]) => {
        let sectionList: { title: string; data: any[] }[] = [];
        
        // Si la phase sélectionnée est 'gs', on regroupe par group_id
        if (selectedPhase === 'gs') {
            const groupsMap: { [key: string]: any[] } = {};
            
            matches.forEach((match) => {
                const groupId = match.group_id || 'sans-nom';
                if (!groupsMap[groupId]) {
                    groupsMap[groupId] = [];
                }
                groupsMap[groupId].push(match);
            });
                        
            // Trier par group_id, puis trier les matches dans chaque groupe par start_time
            Object.keys(groupsMap).sort().forEach((groupId) => {
const sortedMatches = groupsMap[groupId].sort((a, b) => {
    const aTime = a?.start_time ? new Date(a.start_time).getTime() : Number.POSITIVE_INFINITY;
    const bTime = b?.start_time ? new Date(b.start_time).getTime() : Number.POSITIVE_INFINITY;
    return aTime - bTime;
});
                // Utiliser le nom du groupe si disponible, sinon afficher l'ID
                const foundGroup = groups.find((g: any) => g.id === groupId);
                const groupName = foundGroup?.description || `Groupe ${groupId}`;
                sectionList.push({
                    title: groupName,
                    data: sortedMatches
                });
            });
        } else {
            // Regroupement normal par phase
            let sections: { [key: string]: any[] } = {};

            matches.forEach((match) => {
                const phase = match.phase;

                if (!sections[phase]) {
                    sections[phase] = [];
                }

                sections[phase].push(match);
            });

            // Trier par phase, puis trier les matches dans chaque phase par start_time
            Object.keys(sections).sort().forEach((phase) => {
                const sortedMatches = sections[phase].sort((a, b) => 
                    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
                );
                sectionList.push({
                    title: phase,
                    data: sortedMatches
                });
            });
        }

        return sectionList;
    };

    const loadMoreEvents = async () => {
        if (refreshing || !hasMore) return;
        setRefreshing(true);

        try {
            let result;
            if (selectedPhase) {
                result = await getMatchesFromSportIdAndCategoryIdAndPhaseId({
                    sportId: sport_id,
                    categoryId: category_id,
                    phaseId: selectedPhase,
                    lastDoc
                });
            } else {
                result = await getMatchesFromSportIdAndCategory({
                    lastDoc,
                    sportId: sport_id,
                    categoryId: category_id,
                });
            }

            setMatches(prev => [...prev, ...result.matches]);
            setLastDoc(result.lastDoc);
            if (result.matches.length < ITEMS_PER_PAGE) setHasMore(false);
        } catch (err) {
            console.error('Erreur chargement événements:', err);
        }
        setRefreshing(false);
    };

    const sectionListData = turnIntoSectionList(matches);

    // Trouver le label de la phase sélectionnée
    const selectedPhaseLabel = allPhases.find(p => p.id === selectedPhase)?.label || 'Toutes les phases';

    return (
        <View style={styles.container}>
            {/* Dropdown pour sélectionner la phase */}
            <View style={styles.dropdownContainer}>
                <TouchableOpacity 
                    style={styles.dropdownButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.dropdownButtonText}>{selectedPhaseLabel}</Text>
                </TouchableOpacity>
            </View>

            <SectionList
                onRefresh={() => fetchMatches(sport_id, selectedPhase)}
                refreshing={refreshing}
                style={{ width: '100%', padding: 10}}
                sections={sectionListData}
                onEndReached={loadMoreEvents}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                    <EventCard event={item} />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={{ margin: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                            {selectedPhase === 'gs' ? title : translatePhase(title)}
                        </Text>
                    </View>
                )}
            />

            {/* Modal pour le dropdown */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Sélectionner une phase</Text>
                        <FlatList
                            data={allPhases}
                            keyExtractor={(item) => item.id || 'all'}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.phaseItem,
                                        pressed && styles.phaseItemPressed
                                    ]}
                                    onPress={() => handlePhaseSelect(item.id)}
                                >
                                    <Text style={styles.phaseItemText}>{item.label}</Text>
                                </Pressable>
                            )}
                        />
                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Annuler</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    dropdownContainer: {
        width: '100%',
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    dropdownButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        width: '80%',
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 16,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    phaseItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    phaseItemPressed: {
        backgroundColor: '#f0f0f0',
    },
    phaseItemText: {
        fontSize: 16,
        color: '#333',
    },
    cancelButton: {
        padding: 16,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#ff3b30',
        fontWeight: '600',
    },
});

export default SportMatchesTab;
