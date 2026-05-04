import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { getMatchesFromSportIdAndCategory } from '@/src/api/services/firestore/matchService';
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

    useEffect(() => {
        fetchMatches(sport_id);
    }, []);

    const fetchMatches = async (sport_id: string) => {
        setRefreshing(true);
        const {matches, lastDoc : newLastDoc} = await getMatchesFromSportIdAndCategory({
            sportId: sport_id,
            categoryId: category_id,
            lastDoc: null
        });
        setMatches(matches);
        setLastDoc(newLastDoc);
        setRefreshing(false);
    };

    const turnIntoSectionList = (matches: any[]) => {
        let sectionList: { title: string; data: any[] }[] = [];
        let sections: { [key: string]: any[] } = {};

        matches.forEach((match) => {
            const phase = match.phase;

            if (!sections[phase]) {
                sections[phase] = [];
            }

            sections[phase].push(match);
        });

        Object.keys(sections).forEach((phase) => {
            sectionList.push({
                title: phase,
                data: sections[phase]
            });
        });

        return sectionList;
    };

    const loadMoreEvents = async () => {
        if (refreshing || !hasMore) return;
        setRefreshing(true);

        try {
            const { matches: docs, lastDoc: newLastDoc } = await getMatchesFromSportIdAndCategory({
                lastDoc,
                sportId: sport_id,
                categoryId: category_id,
            });


            setMatches(prev => [...prev, ...docs]);
            setLastDoc(newLastDoc);
            if (docs.length < ITEMS_PER_PAGE) setHasMore(false);
            } catch (err) {
                console.error('Erreur chargement événements:', err);
            }
        setRefreshing(false);
    };

    const sectionListData = turnIntoSectionList(matches);

    return (
        <View style={styles.container}>
            <SectionList
                onRefresh={() => fetchMatches(sport_id)}
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
                            {translatePhase(title)}
                            {/*title === 'gs' ? 'Phase de groupes' :
                                title === 'f' ? 'Finale' :
                                    title === '2f' ? 'Demi-finale' :
                                        title === '3f' ? 'Match pour la 3ème place' :
                                            title === '4f' ? 'Quarts de finale' :
                                                title === '8f' ? 'Huitièmes de finale' :
                                                    title === '16f' ? 'Seizièmes de finale' :
                                                        title === 'c' ? 'Consolante' :
                                                            title === 'p' ? 'Matchs de placement' : title*/}
                        </Text>
                    </View>
                )}
            />
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
});

export default SportMatchesTab;
