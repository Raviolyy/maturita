import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from "react";
import {database, ref, onValue} from '../firebaseconfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const Item: React.FC<{ title: string; ulozeni: (title: string) => void }> = ({ title, ulozeni }) => (
    <View style={styles.item}>
        <TouchableOpacity style={{flex:1}} onPress={() => ulozeni(title)}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    </View>
);

function VyberTrid() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [tridy, setTridy] = useState<string[]>([]);
    const [trida,setTrida] = useState<string>()


    const ulozeni = async (title: string) => {
        await AsyncStorage.setItem("trida", title);
        await AsyncStorage.removeItem("lichy")
        await AsyncStorage.removeItem("sudy")

        navigation.navigate("Rozvrh");
    };


    useEffect(() => {

        async function ziskaniTrid() {
            const documentsRef = ref(database, 'tridy');
            onValue(
                documentsRef,
                (snapshot) => {
                    const data: string[] = [];
                    snapshot.forEach((childSnapshot) => {
                        const childData = childSnapshot.val();
                        data.push(childData);
                    });
                    setTridy(data);
                },
                { onlyOnce: true }
            );
        }
        trida===undefined ? ziskaniTrid() : navigation.navigate("Rozvrh")
    }, []);


    const renderItem = ({ item }: { item: string }) => <Item title={item} ulozeni={ulozeni} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={tridy}
                renderItem={renderItem}
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
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius:30,
        alignItems:"center",
    },
    title: {
        fontSize: 32,
        fontWeight:"bold"
    },
    text:{
        fontSize: 22,
        fontWeight:"bold"
    }

});


export default VyberTrid
