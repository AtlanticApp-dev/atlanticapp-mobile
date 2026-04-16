import { doc, getDoc, getFirestore } from "@react-native-firebase/firestore";

const db = getFirestore();

export const getOtherFromId = async (id: string) => {
    const docRef = doc(db, 'others', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists) {
        console.log('No other found with id:', id);
        throw new Error(`Other with id ${id} not found`);
    }

    return docSnap.data();
}