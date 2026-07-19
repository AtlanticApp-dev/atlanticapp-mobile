import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { getTeamFromId, getTeamFromRef } from "@/src/api/services/firestore/teamsService";
import { getDelegationFromId } from "@/src/api/services/firestore/delegationService";

const FinalRanking = ({ rankingData }) => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const results = [];

            const sorted = [...rankingData].sort((a, b) => a.rank - b.rank);
            for (const entry of sorted) {
                const teamData = await getTeamFromId(entry.id);
                const delegationData = await getDelegationFromId(teamData.delegation_id)

                results.push({
                    rank: entry.rank,
                    teamName: delegationData.title + (teamData.description ? ` - ${teamData.description}` : ''),
                    delegationLogo: delegationData.image || null,
                });
            }
            setTeams(results);
        };

        fetchData();
    }, [rankingData]);

    const renderItem = ({ item }) => (
        <View style={styles.row}>
        <Text style={styles.rank}>{item.rank}</Text>
        {item.delegationLogo ? (
            <Image source={{ uri: item.delegationLogo }} style={styles.logo} />
        ) : (
            <View style={styles.logoPlaceholder} />
        )}
        <Text style={styles.team} numberOfLines={1}>{item.teamName}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Classement Final</Text>
        {teams.map((item, index) => (
                <View key={index}>
                    {renderItem({ item })}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    rank: {
        width: 30,
        fontWeight: "bold",
        textAlign: "center",
    },
    logo: {
        width: 40,
        height: 40,
        marginHorizontal: 5,
    },
    logoPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginHorizontal: 8,
        backgroundColor: "#ccc",
    },
    team: {
        fontSize: 18,
        fontWeight:'bold',
    },
});

export default FinalRanking;
