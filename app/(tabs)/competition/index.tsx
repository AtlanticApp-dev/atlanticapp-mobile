import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, SectionList } from 'react-native';
import { getAllRawSports } from '@/src/api/services/firestore/sportsService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import ScreenLoader from '@/src/components/ScreenLoader';
import SportItem from '@/src/components/Competition/SportItem';
import { getCategoriesFromSportId } from '@/src/api/services/firestore/categoryService';


const width = Dimensions.get('window').width;

type Sport = {
    id: string;
    title: string;
    image: string;
    categories?: any[];
};

const color1 = '#ECC250'

const CompetitionScreen: React.FC<{}> = () => {
    const [sports, setSports] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        refresh();
    }, []);

    const refresh = async () => {
        setLoading(true);
        const sports = await getAllRawSports();
        const enrichedSports = await Promise.all(sports.map(async sport => {
            sport.categories = await getCategoriesFromSportId(sport.id);
            return sport;
        }));
        setSports(enrichedSports);
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{height:200, width:200}}>
                        <ScreenLoader />
                    </View>
                </View>
            ) : (
                <View style={styles.listContainer}>
                    <SectionList
                        sections={[
                            { title: 'Sports', data: sports }
                        ]}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index, section }) => (
                            <SportItem item={item} index={index} totalItems={section.data.length} />
                        )}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                            <TouchableOpacity onPress={() => router.navigate('/competition/generalRankingScreen')}>
                                <Image source={require('@/assets/images/sports/classement_general.jpg')} style={styles.general_ranking_image}/>
                                <View style={styles.general_ranking_container}>
                                    <Text style={styles.last_text} numberOfLines={2}>{'Classement général'.toLocaleUpperCase()}</Text>
                                </View>
                            </TouchableOpacity>
                        }
                        stickySectionHeadersEnabled={true}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        alignSelf: 'center',
        marginTop: 20,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topText: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    listContainer: {
        alignItems: 'center',
        flex: 1,
    },
    sportItemContainer: {
        margin: 5,
        width: '70%',
        height: 120,
        alignItems: 'center',
    },
    image: {
        height: '100%',
        width:'100%',
        overflow: 'hidden',
        opacity: 0.3,
    },
    last_image: {
        width: width / 2 - 20 - 50,
        height: width / 2 - 20 - 50,
    },
    text: {
        fontSize: 26,
        fontWeight: 'bold',
        margin:15,
    },
    last_text: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    general_ranking_container: {
        width: width - 20,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: color1,
    },
    general_ranking_image: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
});

export default CompetitionScreen;
