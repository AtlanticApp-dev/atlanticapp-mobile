import { getOtherFromId } from '@/src/api/services/firestore/othersService';
import { Link } from 'expo-router';
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, Linking } from 'react-native';

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

export default function RulesScreen() {
    const [rules, setRules] = React.useState<string[]>(["", ""]);
    const [activeFetches, setActiveFetches] = React.useState<number>(0);

    const fetchRulesData = async () => {
        setActiveFetches(prev => prev + 1);
        try {
            const data = await getOtherFromId('rules');
            setRules(data || []);
        } catch (error) {
            console.error("Error fetching rules data:", error);
        } finally {
            setActiveFetches(prev => prev - 1);
        }
    };

    React.useEffect(() => {
        fetchRulesData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Règles</Text>
                
                <View style={styles.section}>
                    <OpenURLButton url={rules.atlanticup_chart}>
                        {`Charte de l'Atlanticup`}
                    </OpenURLButton>
                </View>

                <View style={styles.section}>
                    <OpenURLButton url={rules.b03_chart}>
                        {`Charte de respect des logements`}
                    </OpenURLButton>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Règlements sportifs</Text>
                    <Text style={styles.ruleText}>
                        Vous pouvez consulter les règlements sportifs dans la section <Text style={{fontWeight: 'bold'}}>Information</Text> de chaque sport, sur la page <Link href="/competition"><Text style={{fontWeight: 'bold'}}>Compétition</Text></Link>.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    ruleText: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 5,
    },
});