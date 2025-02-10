import React, {useEffect, useState} from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {getPreviousFridayAndNextMonday} from "../utils/weekUtils";

interface DateNavigationButtonsProps {
    selectedDate: Date | null;
    setSelectedDate: (date: Date) => void;
    availableDates: string[] | null;
    setIsLoading: (loading: boolean) => void;
    fetchSubstituteData: () => Promise<void>;
}
interface FridayMonday {
    previousFriday:string,
    nextMonday:string
}

const DateNavigationButtons: React.FC<DateNavigationButtonsProps> = ({
                                                                         selectedDate,
                                                                         setSelectedDate,
                                                                         setIsLoading,
                                                                         fetchSubstituteData,
                                                                     }) => {
    const [fridayMonday,setFridayMonday] = useState<FridayMonday>();

    useEffect(() => {
        const newDate = selectedDate?.toISOString().split('T')[0];
        setFridayMonday(getPreviousFridayAndNextMonday(newDate||""));
    }, [selectedDate]);
    return (
        <View style={styles.tlacitka}>
            <TouchableOpacity
                onPress={() => {
                    if (selectedDate) {
                        const nextWeek = new Date(selectedDate);
                        nextWeek.setDate(selectedDate.getDate() - 7);
                        setSelectedDate(nextWeek);
                    }
                }}
            >
                <View style={styles.back}>
                    <Ionicons name="return-up-back" size={40} color="#007AFF" />

                    <Text style={styles.backText}>... {fridayMonday? fridayMonday.previousFriday:null}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setIsLoading(true);
                    fetchSubstituteData().then(() => setIsLoading(false));
                }}
            >
                <Ionicons name="reload" size={30} color="#007AFF" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    if (selectedDate) {
                        const nextWeek = new Date(selectedDate);
                        nextWeek.setDate(selectedDate.getDate() + 7);
                        setSelectedDate(nextWeek);
                    }
                }}
            >
                <View style={styles.back}>
                    <Text style={styles.backText}>{fridayMonday?fridayMonday.nextMonday:null} ...</Text>
                    <Ionicons name="return-up-forward" size={40} color="#007AFF" />

                </View>
            </TouchableOpacity>
        </View>
    );
};


export default DateNavigationButtons;

const styles = StyleSheet.create({
    back:{
        flexDirection:"row",
        alignItems:"center"
    },
    backText:{
        fontSize:20,
        color:"#000000",
    },

    tlacitka:{
        width:"100%",
        flexDirection:"row",
        justifyContent:'space-between',
        alignSelf:"flex-start",
        alignItems:"center"

    },
});
