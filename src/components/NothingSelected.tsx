import {Button, Text, View} from "react-native";
import React from "react";

interface NothingSelectedProps {
    navigation: any,
    screenName:string,
    showText:string
}

const NothingSelected: React.FC<NothingSelectedProps> = ({navigation, screenName,showText}) => {
    return(
        <View style={{flex:1, alignItems:'center', justifyContent:"center"}}>
            <Text style={{fontSize:30}}>{showText}</Text>
            <Button title={"Přejít na výběr"} onPress={()=>navigation.navigate("Výběr",{screen:screenName})}/>

        </View>
    )
}

export default NothingSelected;