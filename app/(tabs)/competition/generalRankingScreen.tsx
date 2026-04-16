import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl, Image, Dimensions } from 'react-native';
import { getGeneralRanking } from '@/src/api/services/firestore/rankingService';
import { getAllDelegations } from '@/src/api/services/firestore/delegationService';
import { FlatList } from 'react-native-gesture-handler';
import { Delegation, RawGeneralRanking, GeneralRanking} from '@/types/models';

const width = Dimensions.get('window').width;

const DelegationItem: React.FC<{ item: Delegation, index: number }> = ({ item, index }) => {
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
    const color = getColor(index);

    return (
        <View style={styles.item_container}>  
            <View style={{flexDirection:'row', alignItems:'center', height:'100%'}}>     
                <View style={{backgroundColor:color, width:5, height:'100%', marginRight:10}} />
                <Text style={styles.delegation_title}>{item.title}</Text>
            </View>
            <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
        </View>
    );
};

const GeneralRankingScreen: React.FC = () => {
    const [rawRanking, setRawRanking] = useState<RawGeneralRanking>();
    const [formattedRanking, setFormattedRanking] = useState<GeneralRanking>();
    const [ranking, setRanking] = useState<Delegation[]>([]);
    const [delegations, setDelegations] = useState<Delegation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchDelegations = useCallback(async () => {
        const delegations = await getAllDelegations();
        setDelegations(delegations);
        return delegations;
    }, []);

    const createFormattedRanking = (rawRanking: RawGeneralRanking, delegations: Delegation[]) : GeneralRanking => {
        const formatted: GeneralRanking = {
            show_ranking : rawRanking.show_ranking,
            last_update : rawRanking.last_update,
            delegations_ranking: rawRanking.delegations_ranking.map(entry => {
                const delegation = delegations.find(deg => deg.id === entry);
                return {
                    id : entry,
                    title: delegation ? delegation.title : 'Unknown',
                    image: delegation ? delegation.image : '',
                } as Delegation;
            }),
        };
        return formatted;
    };

    const fetchRawRanking = useCallback(async () => {
        const ranking = await getGeneralRanking();
        setRawRanking(ranking);
        return ranking;
    }, []);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [ranking, delegations] = await Promise.all([
                fetchRawRanking(),
                fetchDelegations()
            ]);
            if (ranking && delegations) {
                const formatted = createFormattedRanking(ranking, delegations);
                setFormattedRanking(formatted);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchRawRanking, fetchDelegations]);

    useEffect(() => {
        fetchAll();
    }, []);

    if (loading) {
        return <View style={styles.container}><Text style={styles.title}>Chargement...</Text></View>;
    }

    if (!formattedRanking?.show_ranking) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAll} />}>
                    <View style={styles.title_container}>
                        <Text style={styles.title}>Aucun classement disponible pour le moment</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAll} />}>
                <View style={styles.title_container}>
                    <Text style={styles.title}>Classement Général</Text>
                </View>
                <FlatList
                    data={formattedRanking.delegations_ranking}
                    renderItem={({ item, index}) => <DelegationItem item={item} index={index}/>}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    contentContainerStyle={{ flex: 1 }}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    title: {
        fontSize: 20,
    },
    item_container: {
        flex: 1,
        alignItems: 'center',
        margin: 10,
        width: width * 0.9,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    delegation_title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default GeneralRankingScreen;