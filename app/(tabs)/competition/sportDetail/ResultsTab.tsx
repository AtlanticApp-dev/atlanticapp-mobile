import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, RefreshControl, ScrollView } from 'react-native';
import { getFinalRankingFromSportIdAndCategoryId, getGroupRankingsBySportIdAndCategory } from '@/src/api/services/firestore/rankingService';
import GroupRanking from '@/src/components/Competition/GroupRanking';
import FinalRanking from '@/src/components/Competition/FinalRanking';
import { getCategoryFromSportIdAndId } from '@/src/api/services/firestore/categoryService';

interface ResultsTabProps {
    sport_id: any;
    category_id: any;
}

const ResultsTab: React.FC<ResultsTabProps> = ({sport_id, category_id}) => {
    const [groups, setGroups] = useState<any[]>([]);
    const [finalRanking, setFinalRanking] = useState<any[]>([]);
    const [category, setCategory] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);

    const fetchRankings = async () => {
        setLoading(true);
        try {
            const groups = await getGroupRankingsBySportIdAndCategory(sport_id, category_id);
            const finalRanking = await getFinalRankingFromSportIdAndCategoryId(sport_id, category_id);
            const category = await getCategoryFromSportIdAndId(sport_id, category_id);
            setGroups(groups);
            setFinalRanking(finalRanking);
            setCategory(category);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching ranking:", error);
        }
    };

    useEffect(() => {
        fetchRankings();
    }, []);

    const renderFinalRanking = (ranking: any[]) => {
        return <FinalRanking rankingData={ranking} />
    };

    const renderGroup = (group: any, index: number) => {
        return (
            <GroupRanking groupData={group} key={index} />
        );
    };
    
    return (
        <View style={styles.main_container}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={loading}/>}
            >
                {groups.map((group, index) => (
                    renderGroup(group, index)
                ))}
                {finalRanking && category.show_ranking ? renderFinalRanking(finalRanking) :
                    <View style={{ alignItems: 'center', height: 80, justifyContent: 'center', padding: 15 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>Classement final à venir...</Text>
                    </View>
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
    item: {
        height: 40,
        width: '100%',
        borderColor: '#888',
        borderWidth: 1,
        justifyContent: 'center',
        padding: 10,
    },
    header: {
        height: 30,
        paddingHorizontal: 15,
        justifyContent: 'center',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
    },
});

export default ResultsTab;
