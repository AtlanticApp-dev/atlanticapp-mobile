import { useCategory } from '@/src/api/services/firestore/categoryService';
import { useSport } from '@/src/api/services/firestore/sportsService';
import React, { useCallback } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView, Linking, Alert, Button } from 'react-native';

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

    const {
        data: category,
        isLoading: isCategoryLoading,
        error: categoryError
    } = useCategory(sport_id, category_id);

    const {
        data: sport,
        isLoading: isSportLoading,
        error: sportError
    } = useSport(sport_id);

    const renderRulesUrlButton = () => {
        if (!category || !sport || !category.rules_url) return null;

        return (
            <OpenURLButton url={category.rules_url}>
                {`Règlement ${sport.title} - ${category.description}`}
            </OpenURLButton>
        );
    };
    
    return (
        <View style={styles.main_container}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={isCategoryLoading || isSportLoading}/>}
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
