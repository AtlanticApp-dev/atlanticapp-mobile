import AsyncStorage from "@react-native-async-storage/async-storage";

export const getLocalFavoriteDelegation = async (): Promise<string | null> => {
  try {
    const delegation = await AsyncStorage.getItem("supported_delegation");
    return delegation;
  } catch (error) {
    console.error("Error getting local supported sports:", error);
    return null;
  }
};

export const setLocalFavoriteDelegation = async (delegation: string | null): Promise<void> => {
  try {
    if (delegation === null) {
      await AsyncStorage.removeItem("supported_delegation");
      return;
    }
    await AsyncStorage.setItem("supported_delegation", delegation);
  } catch (error) {
    console.error("Error setting local supported sports:", error);
  }
};
