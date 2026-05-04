import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchNextPage } from '@/src/api/services/firestore/eventsService';
import EventCard from '@/src/components/Event/EventCard';
import { getPlaceFromId } from '@/src/api/services/firestore/placeService';

const ITEMS_PER_PAGE = 10;

const PlaceDetail: React.FC<any> = () => {
  const route = useRoute();
  const { placeId } = route.params as { placeId: string };
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [place, setPlace] = useState<any>(null);
  const [descriptionTextExpanded, setDescriptionTextExpanded] = useState(false);

  const blackList = ['completed', 'cancelled'];

    const loadEvents = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const { docs, lastDoc: newLastDoc } = await fetchNextPage({ lastDoc, selectedSchool: null, blackList, placeId });
            setEvents(prev => [...prev, ...docs]);
            setLastDoc(newLastDoc);
            if (docs.length < ITEMS_PER_PAGE) setHasMore(false);
        } finally { 
            setLoading(false); 
        }
    };

    const onRefresh = () => {
        setEvents([]);
        setLastDoc(null);
        setHasMore(true);
        loadEvents();
    };

    const loadPlace = async () => {
      try {
        const placeData = await getPlaceFromId(placeId);
        setPlace(placeData);
      } catch (error) {
        console.error("Error loading place:", error);
      }
    };

    useEffect(() => {
        loadPlace();
        loadEvents();
    }, [placeId]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.placeTitle}>{place?.title}</Text>
                {place?.description && (
                    <View style={styles.descriptionContainer}>
                        <ScrollView contentInsetAdjustmentBehavior='automatic'>
                            <Pressable onPress={() => setDescriptionTextExpanded(!descriptionTextExpanded)}>
                                <Text
                                    style={[styles.description, !descriptionTextExpanded && styles.descriptionCollapsed]}
                                    numberOfLines={descriptionTextExpanded ? undefined : 3}
                                >
                                    {place.description}
                                </Text>
                            </Pressable>
                        </ScrollView>
                        {place.description.length > 50 && (
                            <Text
                                style={styles.expandButton}
                                onPress={() => setDescriptionTextExpanded(!descriptionTextExpanded)}
                            >
                                {descriptionTextExpanded ? 'Voir moins' : 'Voir plus'}
                            </Text>
                        )}
                    </View>
                )}
            </View>

            <FlatList
                data={events}
                renderItem={({ item }) => <EventCard event={item} />}
                keyExtractor={(item, idx) => idx.toString()}
                contentContainerStyle={{ padding: 10 }}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
                onEndReached={loadEvents}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={() => 
                    <View style={{ padding: 20, alignItems:'center' }}>
                        <Text>Aucun événement</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: 'white' 
    },
    header: { 
    },
    placeTitle: { 
        alignSelf: 'center',
        fontSize: 24, 
        fontWeight: 'bold', 
        padding: 20 
    },
    descriptionContainer: { 
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    description: { 
        fontSize: 16, 
    },
    descriptionCollapsed: {
        overflow: 'hidden',
    },
    expandButton: {
        color: 'blue',
        marginTop: 5,
    },
});

export default PlaceDetail;