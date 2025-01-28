import {
  StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from "react";
import Trida from './src/Trida';
import VyberTrid from "./src/VyberTrid";
import VyberVyucujicich from "./src/VyberVyucujicich";
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Vyucujici from "./src/Vyucujici";
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';


const Stack = createNativeStackNavigator();
const TabTop = createMaterialTopTabNavigator();

const TabulkyVyber = () => (
    <TabTop.Navigator>
        <TabTop.Screen name={"Třídy"} component={VyberTrid} />
        <TabTop.Screen name={"Vyučující"} component={VyberVyucujicich} />
    </TabTop.Navigator>
);

const Tab = createBottomTabNavigator();




export default function App() {

  const [initialRoute,setInitialroute] = useState<string>("Vyběr");
  const [isLoading, setIsLoading] = useState(true);
  const [trida,setTrida] = useState<string>()
  const [ucitel,setUcitel] = useState<string>()

    const TabulkyRozvrh = () => (
        <Tab.Navigator>
            <Tab.Screen name={"Třída"} component={Trida} options={{
                tabBarIcon:()=>(<Entypo name="circle" size={15} color="black" />),
                headerShown: false,
                title:trida,
            }}
            />
            <Tab.Screen name={"Učitel"} component={Vyucujici} options={{
                tabBarIcon:()=>(<Entypo name="circle" size={15} color="black" />),
                headerShown: false,
                title:ucitel,
            }}  />
        </Tab.Navigator>
    );

  useEffect(() => {
    const getTrida = async () => {
      try {
          const ucitel = await AsyncStorage.getItem('ucitel');
          setUcitel(ucitel ? ucitel : undefined);

          const trida = await AsyncStorage.getItem('trida');
          setTrida(trida ? trida : undefined);

          if (trida || ucitel) {
              setInitialroute("Rozvrh");
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
          <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerStyle: {} }}>
              <Stack.Screen name={"Vyběr"} component={TabulkyVyber}
                            options={({ navigation }) => ({
                  headerRight: () => (
                      <Text></Text>

                  ),
                  headerLeft: () => (
                      <TouchableOpacity onPress={() => navigation.goBack()}>
                          <AntDesign name="arrowleft" size={24} color="black" />
                      </TouchableOpacity>                  ),
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontWeight: "bold" },
              })}
              />
              <Stack.Screen
                  name={`Rozvrh`}
                  component={TabulkyRozvrh}
                  options={({ navigation }) => ({
                      headerRight: () => (
                          <TouchableOpacity onPress={() => navigation.navigate("Vyběr")}>
                              <AntDesign name="arrowright" size={24} color="black" />
                          </TouchableOpacity>
                      ),
                      headerLeft: () => (
                          <Text></Text>
                      ),
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontWeight: "bold" },
                  })}
              />
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
