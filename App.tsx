import { TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from "react";

import GradeComponent from './src/pages/ClassSchedule';
import TeacherComponent from "./src/pages/TeachersSchedule";

import ClassSelection from "./src/pages/ClassSelection";
import TeachersSelection from "./src/pages/TeacherSelection";

import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';


const Stack = createNativeStackNavigator();
const TabTop = createMaterialTopTabNavigator();

const TabsForSelection = () => (
    <TabTop.Navigator>
        <TabTop.Screen name={"Třídy"} component={ClassSelection} />
        <TabTop.Screen name={"Vyučující"} component={TeachersSelection} />
    </TabTop.Navigator>
);

const Tab = createBottomTabNavigator();

function App() {

  const [initialRoute,setInitialRoute] = useState<string>("Výběr");
  const [isLoading, setIsLoading] = useState(true);
  const [grade,setGrade] = useState<string>()
  const [teacher,setTeacher] = useState<string>()

    const TabsForSchedule = () => (
        <Tab.Navigator>
            <Tab.Screen name={"Třída"} component={GradeComponent} options={{
                tabBarIcon:()=>(<Entypo name="circle" size={15} color="black" />),
                headerShown: false,
                title:grade,
            }}
            />

            <Tab.Screen name={"Učitel"} component={TeacherComponent} options={{
                tabBarIcon:()=>(<Entypo name="circle" size={15} color="black" />),
                headerShown: false,
                title:teacher,
            }}
            />
        </Tab.Navigator>
    );

  useEffect(() => {
    const getSelectionFromStorage = async () => {
      try {
          const teacher = await AsyncStorage.getItem('teacher');
          setTeacher(teacher !=undefined ? teacher : undefined);

          const grade = await AsyncStorage.getItem('class');
          setGrade(grade !=undefined ? grade : undefined);

          if (grade || teacher) {
              setInitialRoute("Rozvrh");
          }

      } catch (e) {
          console.error('Failed to retrieve data', e);
      }
    };
    getSelectionFromStorage().then(()=>{
        setIsLoading(false)
    })
  }, []);

    const handleGoBack = useCallback((navigation:any) => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate("Výběr");
        }
    }, []);

  if (isLoading){
    return null;
  }

  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute}>
              <Stack.Screen
                  name={"Výběr"}
                  component={TabsForSelection}
                  options={() => ({
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontWeight: "bold" },
                  })}
              />

              <Stack.Screen
                  name={`Rozvrh`}
                  component={TabsForSchedule}
                  options={({ navigation }) => ({
                      headerRight: () => <></>,
                      headerLeft: () => (
                          <TouchableOpacity onPress={() => handleGoBack(navigation)}>
                              <AntDesign name="arrowleft" size={24} color="#007AFF" />
                          </TouchableOpacity>
                      ),
                      headerTitleAlign: "center",
                      headerTitleStyle: { fontWeight: "bold" },
                  })}
              />
          </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;
