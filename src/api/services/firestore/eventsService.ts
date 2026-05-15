import { getFirestore, collection, getDocs, query, limit, orderBy, startAfter, where } from "@react-native-firebase/firestore";
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const db = getFirestore();

const PAGE_SIZE = 10;

type FetchEventsParams = {
    lastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot | null;
    selectedSchool: string | null;
    blackList: string[] | null;
    placeId : string | null;
};

export const fetchNextPage = async ({ lastDoc = null, selectedSchool = null, blackList = [], placeId = null}: FetchEventsParams) => {

    let qMatches = query(
        collection(db, "matches"),
    );

    if (blackList && blackList.length > 0) {
        qMatches = query(
            qMatches, 
            where("status", "not-in", blackList),
            orderBy("status")
        );
    }

    qMatches = query(
        qMatches,
        orderBy("start_time", "asc")
    );

    if (lastDoc) {
        qMatches = query(qMatches, startAfter(lastDoc));
    }

    if (placeId) {
        qMatches = query(qMatches, where("place_id", "==", placeId));
    }

    if (selectedSchool) {
        qMatches = query(qMatches, where("delegations_id", "array-contains", selectedSchool));
    }

    // Toujours limiter la pagination
    qMatches = query(qMatches, limit(PAGE_SIZE));

    const snap = await getDocs(qMatches);

    const docsMap = new Map();

    const newLastDoc = snap.docs[snap.docs.length - 1];

    snap.docs.forEach((doc) => {
        if (!docsMap.has(doc.id)) {
        docsMap.set(doc.id, {
            ...doc.data(),
            id: doc.id,
            start_time: (doc.data().start_time as any)?.toDate?.() ?? null
        });
        }
    });

    const mergedDocs = Array.from(docsMap.values());

    mergedDocs.sort(
        (a, b) => a.start_time?.getTime?.() - b.start_time?.getTime?.()
    );

    return {
        docs: mergedDocs,
        lastDoc: newLastDoc
    };
};