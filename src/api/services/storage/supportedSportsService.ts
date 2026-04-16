import AsyncStorage from "@react-native-async-storage/async-storage";

export const getLocalSupportedSports = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem("followed_sports");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error getting local supported sports:", error);
    return [];
  }
};

export const setLocalSupportedSports = async (sports: string[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(sports);
    await AsyncStorage.setItem("followed_sports", jsonValue);
  } catch (error) {
    console.error("Error setting local supported sports:", error);
  }
};
