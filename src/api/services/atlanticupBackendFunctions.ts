import firestore from "@react-native-firebase/firestore";

const atlanticupUpdateMatchStatus = async (match_id: string, status: string): Promise<void> => {
    try {
        await firestore()
            .collection('matches')
            .doc(match_id)
            .update({
                status: status
            });
    }
    catch (error) {
        console.error("Error updating document: ", error);
    }
}
export {
    atlanticupUpdateMatchStatus,
}
