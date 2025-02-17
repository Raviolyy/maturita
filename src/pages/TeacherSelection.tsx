import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from "react";
import {database, ref, onValue} from '../../firebaseconfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LoadingIndicator from "../components/LoadingIndicator";

function TeacherSelection() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [teacher,setTeacher] = useState<string[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false)

    const savingData = async (title: string) => {
        await AsyncStorage.setItem("teacher", title);
        await AsyncStorage.removeItem("oddTeacherWeek")
        await AsyncStorage.removeItem("evenTeacherWeek")

        navigation.navigate("Rozvrh",{screen:"Učitel"});
    };

    async function getTeachers() {
        const savedTeacher = await AsyncStorage.getItem("teacherSelection")
        if (savedTeacher == undefined ){
            const documentsRef = ref(database, 'vyucujici');
            onValue(documentsRef, (snapshot) => {
                    const data: string[] = [];
                    snapshot.forEach((childSnapshot) => {
                        const childData = childSnapshot.val();
                        data.push(childData);
                    });
                    setTeacher([...data])
                    AsyncStorage.setItem("teacherSelection", JSON.stringify(data));
                },
                { onlyOnce: true }
            );
        }else{
            setTeacher(JSON.parse(savedTeacher))
        }
    }

    useEffect(() => {
        setIsLoading(true)

        getTeachers().then(()=>{
            setIsLoading(false)
        }).catch(()=>{
            setIsLoading(false)
        })
    }, []);

    if (isLoading){
        return <LoadingIndicator isLoading={isLoading}/>
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={teacher}
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
        backgroundColor:"#263238"
    },
    item: {
        backgroundColor: '#FFFFFF',
        flex:1,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius:30,
        alignItems:"stretch",
    },

    text:{
        fontSize: 18,
        fontWeight:"bold",
        textAlign:"center",
        padding:20

    }

});


export default TeacherSelection
