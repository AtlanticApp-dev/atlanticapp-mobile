import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Dimensions, Pressable, Image, Platform} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getAllPlaces } from '@/src/api/services/firestore/placeService';
import { router } from 'expo-router';
import Carousel, {ICarouselInstance} from "react-native-reanimated-carousel"
import { getSportFromId } from '@/src/api/services/firestore/sportsService';
import { useLocalSearchParams } from 'expo-router';
import AnimatedMarker from '@/src/components/Map/AnimatedMarker';

const { width: SCREEN_W } = Dimensions.get('window');

const AtlanticupMapScreen: React.FC<any> = () => {
    const mapRef = useRef<MapView>(null);
    const { location } = useLocalSearchParams();
    const [places, setPlaces] = useState<any[]>([]);
    const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
    const carouselRef = useRef<ICarouselInstance>(null);
    
    const fetchPlacesWithSports = async () => {
        const placesData = await getAllPlaces();
        const placesWithSports = await Promise.all(
            placesData.map(async (place: any) => {
                const sports = await Promise.all((place.sports_id_list || []).map(getSportFromId));
                const sportImages = sports.map((sport: any) => sport?.image).filter(Boolean);
                return { ...place, sportImages };
            })
        );

        setPlaces(placesWithSports);
        if (placesWithSports.length > 0) {
            setSelectedMarkerId(placesWithSports[0].id);
        }
    };

    useEffect(() => {
        fetchPlacesWithSports();
    }, []);

    useEffect(() => {
        if (places.length > 0 && location) {
            const index = places.findIndex(p => p.id === location);
            if (index !== -1) {
            carouselRef.current?.scrollTo({ index, animated: false });
            setTimeout(() => onSnapToItem(index), 100);
            }
        }
    }, [places, location]);

    const goToPlaceDetail = (placeId: string) => {
        router.push(`/map/placeDetail?placeId=${placeId}`);
    };

    const onSnapToItem = (index: number) => {
        const place = places[index];
        if (place && place.position?.latitude && place.position?.longitude && mapRef.current) {
            mapRef.current.animateToRegion({
            latitude: place.position.latitude,
            longitude: place.position.longitude,
            latitudeDelta: 0.006,
            longitudeDelta: 0.006,
            }, 350);
            setSelectedMarkerId(place.id);
        }
    };

    const onMarkerPress = (location) => {
        const index = places.findIndex((loc) => loc.id === location.id);
        if (index !== -1) {
            carouselRef.current?.scrollTo({index : index, animated: true});
            onSnapToItem(index);
        }
    };

    const renderCarouselItem = ({ item }: { item: any }) => (
    <View style={styles.carouselItemContainer}>
        <View style={styles.carouselItem}>
        <Text style={styles.carouselItemTitle} numberOfLines={1}>{item.title}</Text>

        <View style={styles.carouselItemImageContainer}>
            {item.sportImages.map((image: string, index: number) => (
                <View key={index} >
                    <Image key={index} source={{ uri: image }} style={styles.carouselItemImage} />
                </View>
            ))}
        </View>

        <Pressable style={styles.detailButton} onPress={() => goToPlaceDetail(item.id)}>
            <Text style={styles.detailButtonText}>Voir détails</Text>
        </Pressable>
        </View>
    </View>
    );

    return (
        <View style={styles.container}>
        <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
            latitude: 48.358616,
            longitude: -4.571361,
            latitudeDelta: 0.006,
            longitudeDelta: 0.006,
            }}
            customMapStyle={[{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }]}
        >
            {places.map(loc => (
                Platform.OS === 'ios' ? (
                    <Marker 
                    key={loc.id} 
                    coordinate={{ latitude: loc.position.latitude, longitude: loc.position.longitude }} 
                    onPress={() => onMarkerPress(loc)}
                    zIndex={selectedMarkerId === loc.id ? 1 : 0}
                    anchor={{ x: 0.5, y: 0.5 }} // Centrer le marqueur
                >
                    <AnimatedMarker
                        loc={loc}
                        isFocused={loc.id === selectedMarkerId}
                    />
                </Marker>
                ) : (
                <Marker
                    key={loc.id + (selectedMarkerId === loc.id ? '_focused' : '')}
                    coordinate={{
                        latitude: loc.position.latitude,
                        longitude: loc.position.longitude,
                    }}
                    onPress={() => onMarkerPress(loc)}
                    zIndex={selectedMarkerId === loc.id ? 1 : 0}
                    pinColor={selectedMarkerId === loc.id ? 'blue' : 'red'}
                />
            )))}
        </MapView>

            <View style={styles.carouselContainer}>
                <Carousel
                    ref={carouselRef}
                    width={SCREEN_W}
                    height={150}
                    data={places}
                    renderItem={renderCarouselItem}
                    onSnapToItem={onSnapToItem}
                    mode="parallax"
                    modeConfig={{
                        parallaxScrollingScale: 1,
                        parallaxAdjacentItemScale: 0.8,
                    }}
                    loop={false}
                    style={{ alignSelf: 'center' }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    cardContainer: {
        position: 'absolute',
        bottom: 20,
        width: SCREEN_W,
        alignItems: 'center',
    },
    card: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    carouselContainer: {
        position: 'absolute',
        bottom: 150,
        width: SCREEN_W,        
        height: 100,
    },
    carouselItemContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselItem: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: SCREEN_W * 0.8,
        flex:1
    },
    carouselItemTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    carouselItemImageContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    carouselItemImage: {
        width: 40,
        height: 40,
        marginHorizontal: 5,
        tintColor: 'black',
    },
    detailButton: {
        marginTop: 10,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    detailButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    imageContainer:{
        backgroundColor:'rgba(255,255,255,0.5)',
        borderRadius:25,
        padding:3,
    },
    focusedImageContainer:{
        backgroundColor:'rgba(66, 80, 190, 0.75)',
        borderRadius:25,
        padding:3,
    },
    image:{
        height:40,
        width:40,
    }
});

export default AtlanticupMapScreen;