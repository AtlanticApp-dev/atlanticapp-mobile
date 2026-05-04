import { getCategoryFromSportIdAndId } from '@/src/api/services/firestore/categoryService';
import { getSportFromId } from '@/src/api/services/firestore/sportsService';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, RefreshControl, Image, ScrollView, Linking, Alert, Button } from 'react-native';

const width = Dimensions.get('window').width;

interface ResultsTabProps {
    sport_id: any;
    category_id: any;
}

type OpenURLButtonProps = {
  url: string;
  children: string;
};

const OpenURLButton = ({url, children}: OpenURLButtonProps) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

const SportInformationsTab: React.FC<ResultsTabProps> = ({sport_id, category_id}) => {
    const [activeFetches, setActiveFetches] = useState<number>(0);
    const [sport, setSport] = useState<any>(null);
    const [category, setCategory] = useState<any>(null);

    const fetchSport = async () => {
        setActiveFetches(prev => prev + 1);
        const sportData = await getSportFromId(sport_id);
        const category = await getCategoryFromSportIdAndId(sport_id, category_id);
        setSport(sportData);
        setCategory(category);
        setActiveFetches(prev => prev - 1);
    }

    useEffect(() => {
        fetchSport();
    }, [sport_id]);

    const renderRulesUrlButton = () => {
        if (!category || !category.rules_url) return null;

        return (
            <OpenURLButton url={category.rules_url}>
                {`Règlement ${sport.title} - ${category.description}`}
            </OpenURLButton>
        );
    };
    
    return (
        <View style={styles.main_container}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={activeFetches > 0}/>}
            >
                {renderRulesUrlButton()}
                
                
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

export default SportInformationsTab;
