import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, {useEffect, useState} from "react";
import { database, ref, onValue } from '../../firebaseconfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoadingIndicator from "../components/LoadingIndicator";

function ClassSelection() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [grade,setGrade] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const savingData = async (title: string) => {
        try {
            await AsyncStorage.setItem("class", title);
            await AsyncStorage.removeItem("oddClassWeek");
            await AsyncStorage.removeItem("evenClassWeek");

            navigation.navigate("Rozvrh", { screen: "Třída" });
        } catch (error) {
            console.error("Error while saving data", error);
        }
    };

    async function getClasses() {
        const getClassesFromStorage = await AsyncStorage.getItem("classSelection");
        if (getClassesFromStorage == undefined) {
            const documentsRef = ref(database, 'tridy');
            onValue(documentsRef, (snapshot) => {
                const data: string[] = [];
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    data.push(childData);
                });
                setGrade([...data])
                AsyncStorage.setItem("classSelection", JSON.stringify(data));
            },{onlyOnce:true});
        } else {
             setGrade(JSON.parse(getClassesFromStorage));
        }
    }

    useEffect(() => {
        setIsLoading(true);

        getClasses().then(() => {
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return <LoadingIndicator isLoading={isLoading} />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={grade}
                renderItem={({ item }: { item: string }) => (
                    <View style={styles.item}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => savingData(item)}>
                            <Text style={styles.text}>{item}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#263238",
    },
    item: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 30,
        alignItems: "stretch",
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        padding: 20,
    },
});

export default ClassSelection;
