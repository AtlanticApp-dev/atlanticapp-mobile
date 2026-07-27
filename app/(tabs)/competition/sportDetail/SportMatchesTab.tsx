import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Modal, FlatList, Pressable, ScrollView } from 'react-native';
import { getMatchesFromSportIdAndCategory, getMatchesFromSportIdAndCategoryIdAndPhaseId, useAllFinalPhaseMatches } from '@/src/api/services/firestore/matchService';
import { useGroups } from '@/src/api/services/firestore/rankingService';
import EventCard from '@/src/components/Event/EventCard';
import { buildTournamentBracket, BracketMatch } from '@/src/components/TournamentBracket';
import TournamentBracket from '@/src/components/TournamentBracket/TournamentBracket';
import { translatePhase } from '@/src/utils/matchMetadataTranslator';
import { router } from 'expo-router';

const ITEMS_PER_PAGE = 10;

interface SportMatchesTabProps {
    sport_id: any;
    category_id: any;
}

const SportMatchesTab: React.FC<SportMatchesTabProps> = ({sport_id, category_id}) => {
    const [matches, setMatches] = useState<any[]>([]);
    const [allAvailablePhases, setAllAvailablePhases] = useState<Set<string>>(new Set());
    const [refreshing, setRefreshing] = useState(false);
    const [lastDoc, setLastDoc] = useState<any | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [showBracket, setShowBracket] = useState(false);
    const [bracket, setBracket] = useState<any>(null);

    // Récupérer tous les groupes pour cette compétition
    const { data: groups = [] } = useGroups(sport_id, category_id);
    
    // Récupérer tous les matchs des phases finales avec React Query
    const { data: allFinalMatches = [], isLoading: loadingBracket } = useAllFinalPhaseMatches(sport_id, category_id);

    // Déterminer quelles phases ont réellement des matchs
    // Mettre à jour quand tous les matchs sont chargés (pas de phase sélectionnée) ou quand sport/category change
    useEffect(() => {
        if (matches.length > 0 && selectedPhaseId === null) {
            const phase_ids = new Set<string>();
            matches.forEach((match) => {
                const phase_id = match.phase || match.phase_id;
                if (phase_id) {
                    phase_ids.add(phase_id);
                }
            });
            setAllAvailablePhases(phase_ids);
        }
    }, [matches, selectedPhaseId, sport_id, category_id]);

    // Liste des phases possibles - filtrée pour n'inclure que celles qui ont des matchs
    // Toujours inclure 'Toutes les phases'
    const allPhases = [
        { id: null, label: 'Toutes les phases' },
        ...(allAvailablePhases.has('gs') ? [{ id: 'gs', label: 'Phase de groupes' }] : []),
        ...(allAvailablePhases.has('16f') ? [{ id: '16f', label: 'Seizième de finale' }] : []),
        ...(allAvailablePhases.has('8f') ? [{ id: '8f', label: 'Huitième de finale' }] : []),
        ...(allAvailablePhases.has('4f') ? [{ id: '4f', label: 'Quart de finale' }] : []),
        ...(allAvailablePhases.has('2f') ? [{ id: '2f', label: 'Demi-finale' }] : []),
        ...(allAvailablePhases.has('3f') ? [{ id: '3f', label: 'Match pour la 3ème place' }] : []),
        ...(allAvailablePhases.has('f') ? [{ id: 'f', label: 'Finale' }] : []),
        ...(allAvailablePhases.has('q') ? [{ id: 'q', label: 'Qualifications' }] : []),
        ...(allAvailablePhases.has('p') ? [{ id: 'p', label: 'Matchs de placement' }] : []),
        ...(allAvailablePhases.has('c') ? [{ id: 'c', label: 'Consolante' }] : [])
    ];

    useEffect(() => {
        fetchMatches(sport_id);
    }, []);

    const fetchMatches = async (sport_id: string, phase_id?: string | null) => {
        setRefreshing(true);
        setLastDoc(null);
        setHasMore(true);
        
        try {
            let result;
            if (phase_id) {
                result = await getMatchesFromSportIdAndCategoryIdAndPhaseId({
                    sportId: sport_id,
                    categoryId: category_id,
                    phaseId: phase_id,
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

    const handlePhaseSelect = (phase_id: string | null) => {
        setSelectedPhaseId(phase_id);
        setModalVisible(false);
        setShowBracket(false); // Réinitialiser la vue bracket quand on change de phase
        fetchMatches(sport_id, phase_id);
    };

    /**
     * Met à jour l'affichage du bracket
     * Avec React Query, les données sont déjà fetchées automatiquement
     */
    const toggleBracketView = () => {
        if (showBracket) {
            setShowBracket(false);
        } else {
            // Construire le bracket avec les matchs déjà fetchés par React Query
            const bracketData = buildTournamentBracket(allFinalMatches);
            setBracket(bracketData);
            setShowBracket(true);
        }
    };

    const turnIntoSectionList = (matches: any[]) => {
        let sectionList: { title: string; data: any[] }[] = [];
        
        // Si la phase sélectionnée est 'gs', on regroupe par group_id
        if (selectedPhaseId === 'gs') {
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
                const phase_id = match.phase_id;

                if (!sections[phase_id]) {
                    sections[phase_id] = [];
                }

                sections[phase_id].push(match);
            });

            // Trier par phase, puis trier les matches dans chaque phase par start_time
            Object.keys(sections).sort().forEach((phase_id) => {
                const sortedMatches = sections[phase_id].sort((a, b) => 
                    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
                );
                sectionList.push({
                    title: phase_id,
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
            if (selectedPhaseId) {
                result = await getMatchesFromSportIdAndCategoryIdAndPhaseId({
                    sportId: sport_id,
                    categoryId: category_id,
                    phaseId: selectedPhaseId,
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
    const selectedPhaseLabel = allPhases.find(p => p.id === selectedPhaseId)?.label || 'Toutes les phases';

    return (
        <View style={styles.container}>
            {/* Header avec dropdown et bouton bracket */}
            <View style={styles.headerContainer}>
                <View style={styles.dropdownContainer}>
                    <TouchableOpacity 
                        style={styles.dropdownButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.dropdownButtonText}>{selectedPhaseLabel}</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Bouton pour basculer entre liste et arbre */}
                <TouchableOpacity
                    style={[styles.bracketButton, loadingBracket && styles.bracketButtonDisabled]}
                    onPress={toggleBracketView}
                    disabled={loadingBracket}
                >
                    <Text style={styles.bracketButtonText}>
                        {loadingBracket ? 'Chargement...' : showBracket ? 'Vue Liste' : 'Vue Arbre'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Affichage conditionnel : Bracket ou Liste */}
            {showBracket ? (
                <TournamentBracket 
                    allMatches={allFinalMatches}
                    onMatchPress={(match: BracketMatch) => {
                        router.push(`/matches/head_to_head/${match.id}`);
                    }}
                />
            ) : (
                <SectionList
                    onRefresh={() => fetchMatches(sport_id, selectedPhaseId)}
                    refreshing={refreshing}
                    style={{ width: '100%'}}
                    sections={sectionListData}
                    onEndReached={loadMoreEvents}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item }) => (
                        <EventCard event={item} />
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={{ padding: 10, backgroundColor: 'rgba(240, 240, 240, 0.75)'}}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                                {selectedPhaseId === 'gs' ? title : translatePhase(title)}
                            </Text>
                        </View>
                    )}
                />
            )}

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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        justifyContent: 'space-between',
    },
    dropdownContainer: {
        flex: 1,
        marginRight: 10,
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
    bracketButton: {
        backgroundColor: '#4287f5',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    bracketButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    bracketButtonDisabled: {
        backgroundColor: '#cccccc',
        opacity: 0.7,
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
