import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';
import Animated from 'react-native-reanimated';

interface AnimatedMarkerProps {
    loc: {
        id: number;
        latitude: number;
        longitude: number;
        title: string;
    };
    isFocused: boolean;
}

const AndroidAnimatedMarker: React.FC<AnimatedMarkerProps> = ({ loc, isFocused }) => {
    return (
        <Animated.View style={styles.container}>
            <View style={isFocused ? styles.focusedImageContainer : styles.imageContainer}>
                <Image style={styles.image} source={require('@/assets/images/logo-atlanticup-no-background.png')} />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        padding: 5,
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

export default AndroidAnimatedMarker;
