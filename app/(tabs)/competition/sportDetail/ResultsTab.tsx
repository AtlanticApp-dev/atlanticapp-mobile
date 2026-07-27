import React from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { useFinalRanking, useGroups } from '@/src/api/services/firestore/rankingService';
import GroupRanking from '@/src/components/Competition/GroupRanking';
import FinalRanking from '@/src/components/Competition/FinalRanking';
import { useCategory } from '@/src/api/services/firestore/categoryService';

interface ResultsTabProps {
    sport_id: any;
    category_id: any;
}

const ResultsTab: React.FC<ResultsTabProps> = ({sport_id, category_id}) => {

    const {
        data: category,
    } = useCategory(sport_id, category_id);

    const {
        data: groups,
        isLoading: isGroupsLoading,
    } = useGroups(sport_id, category_id);

    const {
        data: finalRanking,
        isLoading: isFinalRankingLoading,
    } = useFinalRanking(sport_id, category_id);


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
                refreshControl={<RefreshControl refreshing={isGroupsLoading || isFinalRankingLoading}/>}
            >
                {groups?.map((group, index) => (
                    renderGroup(group, index)
                ))}
                {finalRanking && category?.show_ranking ? renderFinalRanking(finalRanking) :
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
