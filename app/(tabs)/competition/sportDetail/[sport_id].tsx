import React, { useState } from 'react';
import { Dimensions, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useLocalSearchParams } from 'expo-router';

import ResultsTab from './ResultsTab';
import SportMatchesTab from './SportMatchesTab';
import SportInformationsTab from './SportInformationTab';

const SportDetailScreen: React.FC = () => {
    const { sport_id, categoryId} = useLocalSearchParams();

    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const handleIndexChange = (index: number) => {
        setIndex(index);
    }
    const [routes] = useState<{ key: string; title: string }[]>([
        { key: "rencontres", title: "Rencontres" },
        { key: "rankings", title: "Classements" },
        { key: "informations", title: "Informations" }
    ]);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={SceneMap({
                rencontres: () => <SportMatchesTab sport_id={sport_id} category_id={categoryId}/>,
                rankings: () => <ResultsTab sport_id={sport_id} category_id={categoryId}/>,
                informations: () => <SportInformationsTab sport_id={sport_id} category_id={categoryId}/>
            }
            )}
            onIndexChange={handleIndexChange}
            initialLayout={{width: layout.width}}
            style={{flex: 1}}
        >
        </TabView>
    );
};

export default SportDetailScreen;
