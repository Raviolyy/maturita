import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    FlatList,
    ViewBase,
    ViewComponent,
    TouchableOpacity, Image, Dimensions, useWindowDimensions, Modal,Animated
} from 'react-native';
import {database, ref, get, query, orderByChild, equalTo} from "../firebaseconfig"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ParamListBase, useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {
    GestureHandlerRootView,
    Gesture,
    GestureDetector,
    PinchGestureHandler, PinchGestureHandlerGestureEvent, PanGestureHandler
} from "react-native-gesture-handler";
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import {
    fitContainer,
    ResumableZoom, ResumableZoomType,
    useImageResolution,
} from 'react-native-zoom-toolkit';

interface suplInterface {
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


const FetchData = () => {
    const [lichyTyden, setlichyTyden]  =  useState<[][][]>([]);
    const [sudyTyden, setsudyTyden]  =  useState<[][][] >([]);
    const [tyden,setTyden] = useState<string>()
    const [trida,setTrida]=useState<string>();
    const [loading,setLoading] = useState(true)
    const [dates,setDates] = useState<string[]>();
    const [datum,setDatum] = useState<Date>()
    const [nenisupl,setNenisupl] = useState<string[]>()
    const [zatmaveni,setZatmaveni] = useState([styles.bezZatmaveni,styles.bezZatmaveni,styles.bezZatmaveni,styles.bezZatmaveni,styles.bezZatmaveni])
    const casy = [
        {hodina:"0", cas: "7:00 - 7:45"},
        {hodina:"1", cas: "7:50 - 8:35"},
        {hodina:"2", cas: "8:45 - 9:30"},
        {hodina:"3", cas: "9:50 - 10:35"},
        {hodina:"4", cas: "10:45 - 11:30"},
        {hodina:"5", cas: "11:40 - 12:25"},
        {hodina:"6", cas: "12:30 - 13:15"},
        {hodina:"7", cas: "13:20 - 14:05"},
        {hodina:"8", cas: "14:10 - 14:55"},
        {hodina:"9", cas: "15:00 - 15:45"},
        {hodina:"10", cas: "15:50 - 16:35"},
        {hodina:"11", cas: "16:40 - 17:25"},
    ]
    const dny = ["pondělí","úterý","středa","čtvrek","pátek"]
    const [suplData, setSuplData] = useState<suplInterface[]>([])
    const [chybiciHodiny, setChybiciHodiny] = useState<any[][]>(Array(5).fill(Array(12).fill(styles.nechybi)))
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    function formatDateToCustomString(dateInput:Date) {
        const date = new Date(dateInput);

        const day = date.getDate(); // Get the day of the month
        const month = date.getMonth() + 1; // Months are 0-indexed

        return `${day}.${month}.`; // Format as DD.MM.
    }
    function formatDateToCustomStringProSupl(dateInput:Date) {
        const date = new Date(dateInput);

        const year = date.getFullYear(); // Get the full year
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, pad with 0
        const day = String(date.getDate()).padStart(2, '0'); // Day of the month, pad with 0

        return `${year}_${month}_${day}`; // Format as YYYY_MM_DD
    }
    function getWeekdaysProSupl(dateInput: string) {
        const date = new Date(dateInput); // Convert input to a Date object
        const day = date.getDay(); // Get the day of the week (0 = Sunday, ..., 6 = Saturday)
        const startOfWeek = new Date(date); // Clone the date for Monday
        const endOfWeek = new Date(date); // Clone the date for Friday

        // Adjust for Sunday
        const offsetToMonday = day === 0 ? 1 : 1 - day;
        startOfWeek.setDate(date.getDate() + offsetToMonday);

        // Adjust for Sunday
        const offsetToFriday = day === 0 ? 5 : 5 - day;
        endOfWeek.setDate(date.getDate() + offsetToFriday);

        // Generate dates from Monday to Friday
        const weekdays = [];
        const current = new Date(startOfWeek);

        while (current <= endOfWeek) {
            weekdays.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return weekdays.map(d => formatDateToCustomStringProSupl(d));
    }
    function getWeekdays(dateInput: string) {
        const date = new Date(dateInput); // Convert input to a Date object
        const day = date.getDay(); // Get the day of the week (0 = Sunday, ..., 6 = Saturday)
        const startOfWeek = new Date(date); // Clone the date for Monday
        const endOfWeek = new Date(date); // Clone the date for Friday

        // Adjust for Sunday
        const offsetToMonday = day === 0 ? 1 : 1 - day;
        startOfWeek.setDate(date.getDate() + offsetToMonday);

        // Adjust for Sunday
        const offsetToFriday = day === 0 ? 5 : 5 - day;
        endOfWeek.setDate(date.getDate() + offsetToFriday);

        // Generate dates from Monday to Friday
        const weekdays = [];
        const current = new Date(startOfWeek);

        while (current <= endOfWeek) {
            weekdays.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return weekdays.map(d => formatDateToCustomString(d));
    }
    function formatDateStringKdyzNeniSupl(dateString:string) {
        // Split the input string by underscore
        const [year, month, day] = dateString.split('_');

        // Convert month and day to numbers and format them
        const formattedMonth = parseInt(month, 10); // Convert to number
        const formattedDay = parseInt(day, 10); // Convert to number

        // Return the formatted string
        return `${formattedDay}.${formattedMonth}.`;
    }
    function getWeekNumber(date: Date): number {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDays = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
    }

    const tableWidth = 1440; // Replace with your actual table width
    const tableHeight = 1400; // Replace with your actual table height

    function isOddOrEvenWeek(date: Date = new Date()): string {
        const weekNumber = getWeekNumber(date);
        return weekNumber % 2 === 0 ? "Sudý týden" : "Lichý týden";
    }

    const suplovani =  async ()=>{
        const neni_supl = []
        setSuplData([])
        const date = datum?datum.toISOString().split('T')[0]:"1.1.";
        const weekdays = getWeekdaysProSupl(date);
        if (!trida) {
            return;
        }

        try {
            let i = 0;
            for (const el of weekdays) {
                const documentsRef = ref(database, `suplovani/${el}`);
                const tridaQuery = query(documentsRef, orderByChild('trida'));
                const queryProChybejiciTridy = query(documentsRef, orderByChild('label'),equalTo(trida));

                const denJeUlozen = await get(ref(database,`suplovani/${el}`)).then((snapshot)=>{
                    const newZatmaveni = zatmaveni
                    snapshot.exists()? newZatmaveni[i] = styles.bezZatmaveni: newZatmaveni[i] = styles.zatmaveni;
                    setZatmaveni(newZatmaveni);

                })
                //nevim proc ale musi to tu byt, jinak se nezatmavy po prvim prepnuti tydnu dny, ktery nejsou v databazi
                denJeUlozen !=null? neni_supl.push(formatDateStringKdyzNeniSupl(el)):null;

                const snapshot = await get(tridaQuery);
                if (snapshot.exists()) {
                    const promises:any = [];

                    snapshot.forEach((dateSnapshot) => {

                        // když je v suplovani pro ucebny vic trid na jednu ucebnu, je to lepsi jak to resit v functions
                        const data = dateSnapshot.val();
                        if (data.trida && data.trida.includes(trida)) {
                            promises.push(
                                Promise.resolve(data)
                            );
                        }
                    });
                    const results:suplInterface[] = await Promise.all(promises);
                    setSuplData((prevData) => [...prevData, ...results]);
                }

                const snap = await get(queryProChybejiciTridy)
                if (snap.exists()){
                    const data = snap.val();
                    const numbers: number[] = Object.values(data)
                        .map((item: any) => item.numbers) // Extract `numbers` array
                        .flat();

                    //toto uz funguje z nejakeho duvodu tomu pomohlo json
                    const styly = JSON.parse(JSON.stringify(chybiciHodiny));
                    for (let j = numbers[0]; j <= numbers[numbers.length-1]; j++) {
                        styly[i][j] = styles.chybi
                    }
                    setChybiciHodiny(styly);
                }

                i++;
            }

        } catch (error) {
            console.error('Error fetching documents:', error);
        }finally {
            setNenisupl(neni_supl)
        }
    }

    const getTrida = async () => {
        try {
            const value = await AsyncStorage.getItem('trida');
            if (value !== null) {
                setTrida(value)
            }
        } catch (e) {
            console.error('Failed to retrieve data', e);
        }
    };

    const getOfflineData = async () => {
        try {
            const lichyOffline = await AsyncStorage.getItem("lichy");
            const sudyOffline = await AsyncStorage.getItem("sudy");

            if (!lichyOffline || !sudyOffline) {
                const fetchedDataSudy: any[] = [];
                const fetchedDataLichy: any[] = [];

                for (let i = 0; i < 5; i++) {
                    const snapshot = await get(ref(database, `/rozvrh/${trida}/${i}`));
                    if (snapshot.exists()) {
                        fetchedDataLichy.push(snapshot.val());
                    }
                }
                for (let i = 5; i < 10; i++) {
                    const snapshot = await get(ref(database, `/rozvrh/${trida}/${i}`));
                    if (snapshot.exists()) {
                        fetchedDataSudy.push(snapshot.val());
                    }
                }

                // Save data to AsyncStorage
                await AsyncStorage.setItem("lichy", JSON.stringify(fetchedDataLichy));
                await AsyncStorage.setItem("sudy", JSON.stringify(fetchedDataSudy));

                setsudyTyden(fetchedDataSudy);
                setlichyTyden(fetchedDataLichy);
            } else {
                // Parse and set state from AsyncStorage
                setsudyTyden(JSON.parse(sudyOffline));
                setlichyTyden(JSON.parse(lichyOffline));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        setDatum(new Date())

    }, []);

    useEffect(() => {
        let date;
        if (datum){
             date = datum.toISOString().split('T')[0];

        }else{
            date = new Date().toISOString().split('T')[0];
        }
        const weekdays = getWeekdays(date);
        setDates(weekdays)

        setTyden(isOddOrEvenWeek(datum))
        getTrida().then(getOfflineData).then(suplovani).then(()=>setLoading(false))
        navigation.setOptions({
            title:trida
        })
    }, [trida,datum]);


    if (loading){return null}


    return (
<View style={{flex:1}}>
        <View style={styles.tlacitka}>
            <TouchableOpacity onPress={() => {
                if (datum) {
                    const nextWeek = new Date(datum);
                    nextWeek.setDate(datum.getDate() - 7);
                    setDatum(nextWeek);
                }
            }}>
                <View style={styles.back}>
                    <Image source={require("../assets/doleva.png")} style={{ width: 40, height: 40,  marginLeft: 10 }} />
                    <Text style={styles.backText}>...{dates ? dates[0] : null}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                if (datum) {
                    const nextWeek = new Date(datum);
                    nextWeek.setDate(datum.getDate() + 7);
                    setDatum(nextWeek);
                }
            }}>
                <View style={styles.back}>
                    <Text style={styles.backText}>{dates ? dates[4] : null}...</Text>
                    <Image source={require("../assets/doprava.png")} style={{ width: 40, height: 40, marginRight: 10, }} />
                </View>
            </TouchableOpacity>
        </View>

                    <ReactNativeZoomableView maxZoom={3} // Allow zooming in up to 3x
                                             minZoom={0.3} // Allow zooming out to 50%
                                             initialZoom={0.65} // Default zoom level
                                             bindToBorders={true} // Allow panning beyond borders
                                             contentWidth={tableWidth} // Needed for correct calculations
                                             contentHeight={tableHeight} style={{
                                                 flex:1,
                                                flexDirection: 'row',
                                                width:tableWidth ,
                                                height:tableHeight  }}
                                             animatePin={true}>

                        <View style={[styles.sideColumn]}>
                            <Text style={styles.sideText}>{tyden}</Text>
                        </View>

                        <View style={styles.rozvrh}>

                            {(tyden == "Sudý týden" ? sudyTyden : lichyTyden).map((den, denIndex) => (
                                <View key={denIndex} style={zatmaveni[denIndex]}>

                                    <View style={styles.dnyContainer}>
                                        <Text style={styles.dny}>{dny[denIndex]}</Text>
                                        {dates ? <Text style={styles.dny}>{dates[denIndex]}</Text> : null}
                                    </View>
                                    {den.map((hodina, hodinaIndex) => (

                                        <View key={hodinaIndex} style={chybiciHodiny[denIndex][hodinaIndex]}>

                                            {denIndex === 0 ?
                                                <View style={{ alignItems: 'center', borderWidth: 1,}}>
                                                    <Text>{casy[hodinaIndex].hodina}</Text>
                                                    <Text>{casy[hodinaIndex].cas}</Text>
                                                </View>
                                                : null
                                            }

                                            {hodina.map((skupina, skupinaIndex) => {
                                                const nalezenyPrvek = suplData.find(
                                                    (el) => {
                                                        return el.chybejici === skupina[4] && el.hodina === hodinaIndex.toString() && el.ucebna === skupina[2] && el.den === (dates ? dates[denIndex] : "1.1.")
                                                    }
                                                );
                                                return (
                                                    <View key={skupinaIndex} style={styles.skupina}>
                                                        {nalezenyPrvek != undefined && nalezenyPrvek.poznamka == "odpadá" || nalezenyPrvek?.zastupujici == "....." ?
                                                            <View>
                                                                <Text style={[styles.parta]}>{skupina[3]}</Text>
                                                                <Text style={[styles.hodinaStyl]}>{skupina[0]}</Text>
                                                                <Text style={styles.odpada}>odpadá</Text>
                                                            </View>
                                                            :
                                                            <View>
                                                                <View style={styles.horniRadek}>
                                                                    {nalezenyPrvek != undefined ?
                                                                        nalezenyPrvek.poznamka != "" ? <Text style={styles.poznamka}>{nalezenyPrvek.poznamka}</Text> : null
                                                                        : <Text></Text>}
                                                                    <Text style={[styles.parta]}>{skupina[3]}</Text>
                                                                </View>

                                                                <Text style={[styles.hodinaStyl]}>{skupina[0]}</Text>

                                                                <View style={[styles.spodniRadek]}>
                                                                    {nalezenyPrvek != undefined ?
                                                                        nalezenyPrvek.zastupujici !== "" ? <Text style={styles.zastupujiciUcitel}>{nalezenyPrvek.zastupujici}</Text> : <Text style={styles.ucitel}>{skupina[1]}</Text>
                                                                        : <Text style={styles.ucitel}>{skupina[1]}</Text>}
                                                                    {nalezenyPrvek != undefined ?
                                                                        nalezenyPrvek.nahradni_ucebna ? <Text style={styles.suplovanaTrida}>{nalezenyPrvek.nahradni_ucebna}</Text> : <Text style={styles.trida}>{skupina[2]}</Text>
                                                                        : <Text style={styles.trida}>{skupina[2]}</Text>}
                                                                </View>
                                                            </View>}
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </ReactNativeZoomableView>
</View>
    );
};

export default FetchData;
const styles = StyleSheet.create({
    sideColumn: {
        backgroundColor: '#4A628A',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical:30,
        height:"100%"
    },
    back:{
        flexDirection:"row",

    },
    backText:{
        fontSize:20,
        color:"#000000"

    },
    sideText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    rozvrh:{
        flex:1,
        height:1200,
    },
    tlacitka:{
        width:"100%",
        flexDirection:"row",
        justifyContent:'space-between',
        alignSelf:"flex-start",

    },
    dnyContainer:{
        justifyContent:"center",
        borderWidth:1,
        backgroundColor:"#fff"
    },
    dny:{
        textAlign:"center",
        width:70
    },

    den:{
        flex:1,
        flexDirection:"row",
        minHeight:240
    },
    skupina:{
        width:102,
        minHeight:50,
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },

    horniRadek: {
        flexDirection:"row",
        justifyContent:"space-between",
        width:"95%",
        minHeight:10
    },
    poznamka:{
        fontWeight:"bold",
        color:"red",
        fontSize: 8,
        flexShrink:1,
    },
    parta:{
        fontSize: 8,
        justifyContent:"flex-end"
    },

    hodinaStyl:{
        fontSize: 12,
        fontWeight:"bold",
        textAlign:"center",
        minHeight:15
    },

    spodniRadek: {
        flexDirection:"row",
        justifyContent: 'space-between',
        width:"95%",
        alignItems:"center",
        minHeight:10
    },
    ucitel:{
        fontSize: 8,
    },
    trida:{
        fontSize: 8,
    },
    zastupujiciUcitel:{
        fontWeight:"bold",
        color:"red",
        fontSize: 8,
    },
    suplovanaTrida:{
        fontWeight:"bold",
        color:"red",
        fontSize: 8,
        flexShrink:1,
    },
    odpada: {
        backgroundColor:"red",
        fontSize:10,
        padding:3,
        fontWeight:"bold",
        color:"white"
    },





    zatmaveni:{
        backgroundColor:"rgba(179, 215, 220, 0.9)",
        flex:1,
        flexDirection:"row",
        minHeight:200
    },
    bezZatmaveni:{
        flex:1,
        flexDirection:"row",
        minHeight:200
    },
    nechybi:{
        borderWidth:1
    },
    chybi:{
        borderWidth:1,
        backgroundColor:"rgba(154,5,5,0.7)"
    }
});
