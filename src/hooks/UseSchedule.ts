import { useState } from 'react';
import {StyleSheet} from "react-native";
import {ParamListBase, useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

interface SubstituteInterface {
    den: string;
    trida: string;
    hodina: string;
    chybejici: string;
    predmet: string;
    ucebna: string;
    nahradni_ucebna: string;
    poznamka: string;
    zastupujici: string;
}


const useSchedule = () => {
    const [oddWeek, setOddWeek] = useState<[][][]>([]);
    const [evenWeek, setEvenWeek] = useState<[][][]>([]);
    const [weekType, setWeekType] = useState<string>();
    const [selection, setSelection] = useState<string>();
    const [isLoading, setIsLoading] = useState(true);
    const [availableDates, setAvailableDates] = useState<string[]>();
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [darkeningStyles, setDarkeningStyles] = useState([
        styles.bezZatmaveni,
        styles.bezZatmaveni,
        styles.bezZatmaveni,
        styles.bezZatmaveni,
        styles.bezZatmaveni,
    ]);
    const timeSlots = [
        { hodina: "0", cas: "7:00 - 7:45" },
        { hodina: "1", cas: "7:50 - 8:35" },
        { hodina: "2", cas: "8:45 - 9:30" },
        { hodina: "3", cas: "9:50 - 10:35" },
        { hodina: "4", cas: "10:45 - 11:30" },
        { hodina: "5", cas: "11:40 - 12:25" },
        { hodina: "6", cas: "12:30 - 13:15" },
        { hodina: "7", cas: "13:20 - 14:05" },
        { hodina: "8", cas: "14:10 - 14:55" },
        { hodina: "9", cas: "15:00 - 15:45" },
        { hodina: "10", cas: "15:50 - 16:35" },
        { hodina: "11", cas: "16:40 - 17:25" },
    ];
    const daysOfWeek = ["pondělí", "úterý", "středa", "čtvrek", "pátek"];
    const [substitutionData, setSubstitutionData] = useState<SubstituteInterface[]>([]);
    const [missingPeriods, setMissingPeriods] = useState<any[]>();
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    const tableWidth = 1440;
    const tableHeight = 1200;

    return {
        oddWeek,
        setOddWeek,
        evenWeek,
        setEvenWeek,
        weekType,
        setWeekType,
        selection,
        setSelection,
        isLoading,
        setIsLoading,
        availableDates,
        setAvailableDates,
        selectedDate,
        setSelectedDate,
        darkeningStyles,
        setDarkeningStyles,
        timeSlots,
        daysOfWeek,
        substitutionData,
        setSubstitutionData,
        missingPeriods,
        setMissingPeriods,
        navigation,
        tableHeight,
        tableWidth,
    };
};
const styles = StyleSheet.create({
    bezZatmaveni:{
        flex:1,
        flexDirection:"row",
        minHeight:200,
    },
})
export default useSchedule;