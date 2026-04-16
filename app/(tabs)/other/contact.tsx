import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';


export default function ContactPage() {
    const handlePress = (url: string) => {
        Linking.openURL(url);
    };

    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={styles.container} contentInset={{ bottom: insets.bottom +50}}>
            <View style={styles.header}>
                <Text style={styles.title}>Contact / Réseaux sociaux</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Téléphone</Text>
                
                <TouchableOpacity 
                    style={styles.contactItem}
                    onPress={() => {
                        Alert.alert(
                            'Actions',
                            'Choisissez une action',
                            [
                                {
                                    text: 'Copier le numéro',
                                    onPress: () => {
                                        Clipboard.setString('+33632004156');
                                        Alert.alert('Copié', 'Le numéro a été copié dans le presse-papiers');
                                    }
                                },
                                {
                                    text: 'Envoyer un SMS',
                                    onPress: () => {
                                        handlePress('sms:+33632004156');
                                    }
                                },
                                {
                                    text: 'Appeler',
                                    onPress: () => {
                                        handlePress('tel:++33632004156');
                                    }
                                },
                                {
                                    text: 'Annuler',
                                    style: 'cancel'
                                }
                            ]
                        );
                    }}
                >
                    <Ionicons name="call" size={24} color="#007AFF" />
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Nélia FEDELE</Text>
                        <Text style={styles.contactValue}>+33 6 32 00 41 56</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.contactItem}
                    onPress={() => {
                        Alert.alert(
                            'Actions',
                            'Choisissez une action',
                            [
                                {
                                    text: 'Copier le numéro',
                                    onPress: () => {
                                        Clipboard.setString('33781264134');
                                        Alert.alert('Copié', 'Le numéro a été copié dans le presse-papiers');
                                    }
                                },
                                {
                                    text: 'Envoyer un SMS',
                                    onPress: () => {
                                        handlePress('sms:+33781264134');
                                    }
                                },
                                {
                                    text: 'Appeler',
                                    onPress: () => {
                                        handlePress('tel:+33781264134');
                                    }
                                },
                                {
                                    text: 'Annuler',
                                    style: 'cancel'
                                }
                            ]
                        );
                    }}
                >
                    <Ionicons name="call" size={24} color="#007AFF" />
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Hippolyte RAYMOND</Text>
                        <Text style={styles.contactValue}>+33 7 81 26 41 34</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Réseaux sociaux</Text>

                <TouchableOpacity 
                    style={styles.contactItem}
                    onPress={() => handlePress('https://www.instagram.com/atlanticup_bzh')}
                >
                    <Ionicons name="logo-instagram" size={24} color="#E4405F" />
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Instagram Atlanticup</Text>
                        <Text style={styles.contactValue}>@atlanticup_bzh</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.contactItem}
                    onPress={() => handlePress('https://www.instagram.com/bds_imt_atlantique/')}
                >
                    <Ionicons name="logo-instagram" size={24} color="#E4405F" />
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Instagram BDS IMT Atlantique Brest</Text>
                        <Text style={styles.contactValue}>@bds_imt_atlantique</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.contactItem}
                    onPress={() => handlePress('https://www.linkedin.com/company/bureau-des-sports-imt-atlantique')}
                >
                    <Ionicons name="logo-linkedin" size={24} color="#0A66C2" />
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>LinkedIn BDS IMT Atlantique Brest</Text>
                        <Text style={styles.contactValue}>Bureau des Sports - IMT Atlantique Brest</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Addresse</Text>
                
                <TouchableOpacity 
                    style={styles.contactItem}
                    onPress={() => {
                        Alert.alert(
                            'Actions',
                            'Choisissez une action',
                            [
                                {
                                    text: "Copier l'adresse",
                                    onPress: () => {
                                        Clipboard.setString('');
                                        Alert.alert('Copié', "L'adresse a été copiée dans le presse-papiers");
                                    }
                                },
                                {
                                    text: 'Voir sur la carte',
                                    onPress: () => {
                                        handlePress('https://maps.app.goo.gl/QSf2nTDEDcPbjPSJ7');
                                    }
                                },
                                {
                                    text: 'Annuler',
                                    style: 'cancel'
                                }
                            ]
                        );
                    }}
                >
                    <Ionicons name="location" size={24} color="#007AFF" />
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>IMT Atlantique Brest</Text>
                        <Text style={styles.contactValue}>655 Av. du Technopôle{"\n"}29280 Plouzané</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        backgroundColor: '#fff',
        marginTop: 20,
        paddingVertical: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    contactInfo: {
        marginLeft: 15,
        flex: 1,
    },
    contactLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
    },
});