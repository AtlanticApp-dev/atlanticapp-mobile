import { getDelegationFromId } from "@/src/api/services/firestore/delegationService";
import { getTeamFromId } from "@/src/api/services/firestore/teamsService";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const GroupRanking = ({ groupData }) => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const results = [];

            const arrayRanking = Object.entries(groupData.ranking).map(([id, stats]) => ({
                id: id,
                ...stats
            }));

            const sorted = [...arrayRanking].sort((a, b) => a.rank - b.rank);
            for (const entry of sorted) {
                const teamData = await getTeamFromId(entry.id);
                const delegationData = await getDelegationFromId(teamData.delegation_id)

                results.push({
                    rank: entry.rank,
                    name: delegationData.title + (teamData.description ? ` - ${teamData.description}` : ''),
                    points: entry.points,
                    wins: entry.wins,
                    draws: entry.draws,
                    losses: entry.losses,
                    goalsFor: entry.goalsFor,
                    goalsAgainst: entry.goalsAgainst,
                });
            }
            setTeams(results);
        };

        fetchData();
    }, [groupData]);

    const renderItem = (item: any) => (
        <View style={styles.row} key={item.id}>
            <Text style={styles.cell}>{item.rank}</Text>
            <Text style={styles.team} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.cell}>{item.points}</Text>
            <Text style={styles.cell}>{item.wins}</Text>
            <Text style={styles.cell}>{item.draws}</Text>
            <Text style={styles.cell}>{item.losses}</Text>
            <Text style={styles.cell}>{item.goalsFor - item.goalsAgainst}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title} numberOfLines={1}>{groupData.description}</Text>

            <View style={[styles.row, styles.header]}>
                <Text style={styles.headerCell}>#</Text>
                <Text style={styles.headerTeam}>Équipe</Text>
                <Text style={styles.headerCell}>Pts</Text>
                <Text style={styles.headerCell}>V</Text>
                <Text style={styles.headerCell}>N</Text>
                <Text style={styles.headerCell}>D</Text>
                <Text style={styles.headerCell}>+/-</Text>
            </View>

            {teams.map((item, index) => (
                <View key={index}>
                    {renderItem(item)}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        alignItems: "center",
    },
    header: {
        backgroundColor: "#f2f2f2",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    cell: {
        flex: 1,
        textAlign: "center",
    },
    team: {
        flex: 4,
        paddingLeft: 6,
        fontWeight:"bold",
    },
    headerCell: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
    },
    headerTeam: {
        flex: 4,
        fontWeight: "bold",
        textAlign: "left",
        paddingLeft: 6,
    },
});

export default GroupRanking;
