import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from "react";
import {database, ref, onValue} from '../firebaseconfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';



function VyberVyucujicich() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const [vyucujici, setVyucujici] = useState<string[]>([]);
    const [ucitel,setUcitel] = useState<string>()

    const Item: React.FC<{ title: string; ulozeni: (title: string) => void }> = ({ title, ulozeni }) => (
        <View style={styles.item}>
            <TouchableOpacity style={{flex:1}} onPress={() => ulozeni(title)}>
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }: { item: string }) => <Item title={item} ulozeni={ulozeni} />;

    const ulozeni = async (title: string) => {
        await AsyncStorage.setItem("ucitel", title);
        await AsyncStorage.removeItem("lichyVyucujici")
        await AsyncStorage.removeItem("sudyVyucujici")

        navigation.navigate("Rozvrh",{screen:"Učitel"});
    };

    async function ziskaniVyucujich() {
        kontorla_pro_vyber_tird().then(async ()=>{
            const documentsRef = ref(database, 'vyucujici');
            onValue(
                documentsRef,
                (snapshot) => {
                    const data: string[] = [];
                    snapshot.forEach((childSnapshot) => {
                        const childData = childSnapshot.val();
                        data.push(childData);
                    });
                    setVyucujici(data);
                },
                { onlyOnce: true }
            );
            await AsyncStorage.setItem("vyberVyucujicich", JSON.stringify(vyucujici));
        })

    }

    async function kontorla_pro_vyber_tird(){
        const vyucujici_z_uloziste = await AsyncStorage.getItem("vyberVyucujicich")
        if (!vyucujici_z_uloziste){
            await ziskaniVyucujich()
        }else{
            setVyucujici(JSON.parse(vyucujici_z_uloziste))
        }
    }
    useEffect(() => {
        ucitel===undefined ? ziskaniVyucujich() : navigation.navigate("Rozvrh",{screen:"Učitel"});
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={vyucujici}
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


export default VyberVyucujicich
