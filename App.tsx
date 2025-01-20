import {
  Button, Image,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import React, {useEffect, useState} from "react";
import FetchData from './src/index';
import VyberTrid from "./src/VyberTrid";
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons"
import {EvilIcons} from "@expo/vector-icons";
import {IonIcon} from "@ionic/react";
const Stack = createNativeStackNavigator();

export default function App() {

  const [initialRoute,setInitialroute] = useState<string>("Vyběr tříd");
  const [isLoading, setIsLoading] = useState(true);
  const [trida,setTrida] = useState<string>()

  useEffect(() => {
    const getTrida = async () => {
      try {
        const value = await AsyncStorage.getItem('trida');
        if (value){
          setTrida(value)
          setInitialroute("Rozvrh")
        }
      } catch (e) {
        console.error('Failed to retrieve data', e);
      }finally {
        setIsLoading(false)
      }
    };
    getTrida()
  }, []);
  if (isLoading){
    return null;
  }

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{headerStyle:{}}}>
          <Stack.Screen name={"Vyběr tříd"} component={VyberTrid}/>
          <Stack.Screen name={`Rozvrh`} component={FetchData} options={({navigation})=>(
              {
                headerLeft:()=>(<Text></Text>),
                headerRight:()=>(
                  <>
                    <TouchableOpacity onPress={()=>navigation.navigate("Vyběr tříd")}>
                      <Image source={require("./assets/arrow.png")} style={{width:20, height:20}} />
                    </TouchableOpacity>
                  </>
            ),headerTitleAlign:"center", headerTitleStyle:{fontWeight:"bold"},}
          )
          }/>
        </Stack.Navigator>
      </NavigationContainer>


  );
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#e5e3e3',
    flex:1,
    justifyContent:'center',
    alignItems:"center"
  },
});
