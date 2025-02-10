import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {database, get, ref} from "../../firebaseconfig";

const useScheduleData = (path: string) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cachedData = await AsyncStorage.getItem(path);
                if (cachedData) {
                    setData(JSON.parse(cachedData));
                } else {
                    const snapshot = await get(ref(database, path));
                    if (snapshot.exists()) {
                        await AsyncStorage.setItem(path, JSON.stringify(snapshot.val()));
                        setData(snapshot.val());
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [path]);

    return { data, loading };
};

export default useScheduleData;