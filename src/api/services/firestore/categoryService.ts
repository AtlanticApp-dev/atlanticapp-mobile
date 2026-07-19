import { collection, getDoc, doc, getDocs, getFirestore} from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';

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

// Hook personnalisé pour la catégorie
export const useCategory = (sport_id: string, category_id: string) => {
  return useQuery({
    queryKey: ['category', sport_id, category_id],
    queryFn: () => getCategoryFromSportIdAndId(sport_id, category_id),
    enabled: !!sport_id && !!category_id, // Ne s'exécute que si sport_id et category_id sont définis
  });
};