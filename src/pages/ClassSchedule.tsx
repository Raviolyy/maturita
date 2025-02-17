import React, {useEffect} from 'react';
import {View, Text,} from 'react-native';

import {database, ref, get, query, orderByChild, equalTo} from "../../firebaseconfig"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

import styles from "../styles/styles";
import { getWeekdaysProSupl} from "../utils/weekUtils";

import useSchedule from "../hooks/UseSchedule";
import UseMainHook from "../hooks/UseMainHook";

import NothingSelected from "../components/NothingSelected";
import LoadingIndicator from "../components/LoadingIndicator";
import DateNavigationButtons from "../components/DateNavigationButtons";
import {SubstituteInterface} from "../utils/SubstituteInterface";


const ClassSchedule = () => {
    const {
        oddWeek,
        evenWeek,
        setEvenWeek,
        setOddWeek,
        weekType,
        setWeekType,
        isLoading,
        setIsLoading,
        availableDates,
        setAvailableDates,
        selectedDate,
        setSelectedDate,
        substitutionData,
        setSubstitutionData,
        selection,
        setSelection,
        darkeningStyles,
        setDarkeningStyles,
        missingPeriods,
        setMissingPeriods,
        navigation,
        tableWidth,
        tableHeight,
        timeSlots,
        daysOfWeek,
    } = useSchedule();


    const fetchSubstituteData =  async ()=>{
        setSubstitutionData([])
        const date = selectedDate?selectedDate.toISOString().split('T')[0]:"1.1.";
        const weekdays = getWeekdaysProSupl(date);

        if (!selection) {
            return;
        }

        try {
            const newDarkeningStyle = [...darkeningStyles];
            const newMissingPeriods = Array(5).fill(Array(12).fill(styles.nechybi));
            for (let i = 0; i < weekdays.length; i++) {
                const el = weekdays[i];
                const documentsRef = ref(database, `suplovani/${el}`);
                const queryForMissingClasses = query(documentsRef, orderByChild('label'), equalTo(selection));

                await get(documentsRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        newDarkeningStyle[i] = styles.bezZatmaveni;
                    } else {
                        newDarkeningStyle[i] = styles.zatmaveni;
                    }
                });

                const querySubstituteData = query(documentsRef, orderByChild('trida'), equalTo(selection));
                const snapshot = await get(querySubstituteData);
                if (snapshot.exists()) {
                    const promises: any = [];
                    snapshot.forEach((dateSnapshot) => {
                        promises.push(
                            Promise.resolve(dateSnapshot.val())
                        );
                    });
                    const results: SubstituteInterface[] = await Promise.all(promises);
                    setSubstitutionData((prevData) => [...prevData, ...results]);
                }

                const snap = await get(queryForMissingClasses);
                if (snap.exists()) {
                    const data = snap.val();
                    const numbers: number[] = Object.values(data)
                        .map((item: any) => item.numbers)
                        .flat();

                    newMissingPeriods[i] = newMissingPeriods[i].map((hodina:object, hodinaIndex:number) =>
                        numbers.includes(hodinaIndex) ? styles.chybi : styles.nechybi
                    );
                }
            }
            setMissingPeriods(newMissingPeriods);
            setDarkeningStyles(newDarkeningStyle);

        }catch (error) {
            console.error('Error fetching documents:', error);
        }
    }

    const getGrade = async () => {
        try {
            const value = await AsyncStorage.getItem('class');
            if (value !== null) {
                setSelection(value)
            }
        } catch (e) {
            console.error('Failed to retrieve data', e);
        }
    };

    const getOfflineData = async () => {
        try {
            const oddWeekStorage = await AsyncStorage.getItem("oddClassWeek");
            const evenWeekStorage = await AsyncStorage.getItem("evenClassWeek");

            if (!oddWeekStorage || !evenWeekStorage) {
                const fetchedDataEven: any[] = [];
                const fetchedDataOdd: any[] = [];

                for (let i = 0; i < 5; i++) {
                    const snapshot = await get(ref(database, `/rozvrh/${selection}/${i}`));
                    if (snapshot.exists()) {
                        fetchedDataOdd.push(snapshot.val());
                    }
                }
                for (let i = 5; i < 10; i++) {
                    const snapshot = await get(ref(database, `/rozvrh/${selection}/${i}`));
                    if (snapshot.exists()) {
                        fetchedDataEven.push(snapshot.val());
                    }
                }

                await AsyncStorage.setItem("oddClassWeek", JSON.stringify(fetchedDataOdd));
                await AsyncStorage.setItem("evenClassWeek", JSON.stringify(fetchedDataEven));

                setEvenWeek(fetchedDataEven);
                setOddWeek(fetchedDataOdd);
            } else {
                setEvenWeek(JSON.parse(evenWeekStorage));
                setOddWeek(JSON.parse(oddWeekStorage));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        setSelectedDate(new Date())
    }, []);

    UseMainHook(navigation, selectedDate, selection, setAvailableDates, setWeekType, setIsLoading,getGrade,getOfflineData,fetchSubstituteData,);

    if (!selection){
        return (
            <NothingSelected navigation={navigation} screenName={"Třídy"} showText={"Vyberte třídu"}/>
        )
    }
    if (isLoading){
        return (
            <LoadingIndicator isLoading={isLoading}/>
        )
    }

    return (
        <View style={{flex:1, backgroundColor:"#fff"}}>
            <DateNavigationButtons
                selectedDate={selectedDate||null}
                setSelectedDate={setSelectedDate}
                availableDates={availableDates||null}
                setIsLoading={setIsLoading}
                fetchSubstituteData={fetchSubstituteData}
            />
                    <ReactNativeZoomableView maxZoom={3}
                                             minZoom={0.3}
                                             bindToBorders={true}
                                             initialOffsetY={250}
                                             initialOffsetX={500}
                                             contentWidth={tableWidth}
                                             contentHeight={tableHeight} style={{
                                                 flex:8,
                                                flexDirection: 'row',
                                                width:tableWidth ,
                                                height:tableHeight  }}
                                             animatePin={true}
                    >
                        <View style={[styles.sideColumn]}>
                            <Text style={styles.sideText}>{weekType}</Text>
                        </View>

                        <View style={styles.rozvrh}>

                            {(weekType == "Sudý týden" ? evenWeek : oddWeek).map((den, denIndex) => (
                                <View key={denIndex} style={darkeningStyles[denIndex]}>

                                    <View style={styles.dnyContainer}>
                                        <Text style={styles.dny}>{daysOfWeek[denIndex]}</Text>
                                        {availableDates ? <Text style={styles.dny}>{availableDates[denIndex]}</Text> : null}
                                    </View>
                                    {den.map((hour, hourIndex) => (

                                        <View key={hourIndex} style={missingPeriods? missingPeriods[denIndex][hourIndex]:styles.nechybi}>

                                            {denIndex === 0 ?
                                                <View style={{ alignItems: 'center', borderWidth: 1, backgroundColor:"#ffffff"}}>
                                                    <Text>{timeSlots[hourIndex].hodina}</Text>
                                                    <Text>{timeSlots[hourIndex].cas}</Text>
                                                </View>
                                                : null
                                            }

                                            {hour.map((part, partIndex) => {
                                                const find = substitutionData.find(
                                                    (el) => {
                                                        return el.chybejici === part[4] && el.hodina === hourIndex.toString() && el.ucebna === part[2] && el.den === (availableDates ? availableDates[denIndex] : "1.1.")
                                                    }
                                                );
                                                return (
                                                    <View key={partIndex} style={styles.skupina}>
                                                        {find != undefined && find.poznamka == "odpadá" || find?.zastupujici == "....." ?
                                                            <View>
                                                                <Text style={[styles.parta]}>{part[3]}</Text>
                                                                <Text style={[styles.hodinaStyl]}>{part[0]}</Text>
                                                                <Text style={styles.odpada}>odpadá</Text>
                                                            </View>
                                                            :
                                                            <View>
                                                                <View style={styles.horniRadek}>
                                                                    {find != undefined ?
                                                                        find.poznamka != "" ? <Text style={styles.poznamka}>{find.poznamka}</Text> : null
                                                                        : <Text></Text>}
                                                                    <Text style={[styles.parta]}>{part[3]}</Text>
                                                                </View>

                                                                <Text style={[styles.hodinaStyl]}>{part[0]}</Text>

                                                                <View style={[styles.spodniRadek]}>
                                                                    {find != undefined ?
                                                                        find.zastupujici !== "" ? <Text style={styles.zastupujiciUcitel}>{find.zastupujici}</Text>
                                                                            : <Text style={styles.teacher}>{part[1]}</Text>
                                                                        : <Text style={styles.teacher}>{part[1]}</Text>}
                                                                    {find != undefined ?
                                                                        find.nahradni_ucebna ? <Text style={styles.suplovanaTrida}>{find.nahradni_ucebna}</Text>
                                                                            : <Text style={styles.trida}>{part[2]}</Text>
                                                                        : <Text style={styles.trida}>{part[2]}</Text>}
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

export default ClassSchedule;
