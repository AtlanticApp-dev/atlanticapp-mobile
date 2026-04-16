import { collection, where, getDoc, doc, getDocs, setDoc, updateDoc, getFirestore, query, orderBy} from '@react-native-firebase/firestore';
const db = getFirestore();

export const getCategoryFromSportIdAndId = async (sportId: any, categoryId: string) => {
    const categoryRef = doc(db, 'sports', sportId, 'categories', categoryId);
    const categorySnap = await getDoc(categoryRef);
    return { id: categorySnap.id, ...categorySnap.data() };
};

export const getCategoriesFromSportId = async (sportId: any) => {
    const categoriesRef = collection(db, 'sports', sportId, 'categories');
    const categoriesSnap = await getDocs(categoriesRef);
    return categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};