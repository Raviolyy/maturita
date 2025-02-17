import React, {useEffect} from 'react';
import {Text, View} from 'react-native';

import {database, equalTo, get, orderByChild, query, ref} from "../../firebaseconfig"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';

import {getWeekdaysProSupl} from "../utils/weekUtils";
import {SubstituteInterface} from "../utils/SubstituteInterface";
import styles from "../styles/styles";

import LoadingIndicator from "../components/LoadingIndicator";
import DateNavigationButtons from "../components/DateNavigationButtons";
import NothingSelected from "../components/NothingSelected";

import UseMainHook from "../hooks/UseMainHook";
import useSchedule from "../hooks/UseSchedule";

const TeachersSchedule = () => {
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
        daysOfWeek
    } = useSchedule();

    function extractLastName(input:string) {
        if(input=== "Bes    MRes Ondřej Beneš O."){
            return "Beneš O."
        }else{
            const sanitizedInput = input.substring(4).trim();

            const parts = sanitizedInput.split(/\s+/);

            const filteredParts = parts.filter(word => !word.includes('.'));

            return filteredParts.length > 1 ? filteredParts[1] : "";
        }

    }

    const fetchSubstituteData =  async ()=>{
        setSubstitutionData([])
        let surrName;
        const date = selectedDate?selectedDate.toISOString().split('T')[0]:"1.1.";
        const weekdays = getWeekdaysProSupl(date);
        
        if (!selection) {
            return;
        }else {
            surrName = extractLastName(selection)
        }

        try {
            const newDarkeningStyle = [...darkeningStyles];
            const newMissingPeriods = Array(5).fill(Array(12).fill(styles.nechybi)); 
            for (let i = 0; i < weekdays.length; i++) {
                const el = weekdays[i];
                const documentsRef = ref(database, `suplovani/${el}`);
                const queryForMissingTeachers = query(documentsRef, orderByChild('label'), equalTo(surrName));

                await get(documentsRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        newDarkeningStyle[i] = styles.bezZatmaveni;
                    } else {
                        newDarkeningStyle[i] = styles.zatmaveni;
                    }
                });

                const queryForSubstituteTeacher = query(documentsRef, orderByChild('zastupujici'), equalTo(surrName));
                const snapshot = await get(queryForSubstituteTeacher);
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

                const queryForMissingTeachersInSubstitution = query(documentsRef, orderByChild('chybejici'), equalTo(surrName));
                const snapshotMissingTeachers = await get(queryForMissingTeachersInSubstitution );
                if (snapshotMissingTeachers.exists()) {
                    const promises: any = [];
                    snapshotMissingTeachers.forEach((dateSnapshot) => {
                        promises.push(
                            Promise.resolve(dateSnapshot.val())
                        );
                    });
                    const results: SubstituteInterface[] = await Promise.all(promises);
                    setSubstitutionData((prevData) => [...prevData, ...results]);
                }

                const snap = await get(queryForMissingTeachers);
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
            setDarkeningStyles(newDarkeningStyle)
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }

    const getTeacher = async () => {
        try {
            const value = await AsyncStorage.getItem('teacher');
            if (value !== null) {
                setSelection(value);
            }
        } catch (e) {
            console.error('Failed to retrieve data', e);
        }
    };

    const getOfflineData = async () => {
        try {
            const oddWeekStorage = await AsyncStorage.getItem("oddTeacherWeek");
            const evenWeekStorage = await AsyncStorage.getItem("evenTeacherWeek");

            if (!oddWeekStorage || !evenWeekStorage) {
                const fetchedDataEven: any[] = [];
                const fetchedDataOdd: any[] = [];

                for (let i = 0; i < 5; i++) {
                    const snapshot = await get(ref(database, `/rozvrh/${selection?.substring(0,3)}/${i}`));
                    if (snapshot.exists()) {
                        fetchedDataOdd.push(snapshot.val());
                    }
                }
                for (let i = 5; i < 10; i++) {
                    const snapshot = await get(ref(database, `/rozvrh/${selection?.substring(0,3)}/${i}`));
                    if (snapshot.exists()) {
                        fetchedDataEven.push(snapshot.val());
                    }
                }

                await AsyncStorage.setItem("oddTeacherWeek", JSON.stringify(fetchedDataOdd));
                await AsyncStorage.setItem("evenTeacherWeek", JSON.stringify(fetchedDataEven));

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

    UseMainHook(navigation, selectedDate, selection, setAvailableDates, setWeekType, setIsLoading, getTeacher, getOfflineData, fetchSubstituteData);

    if (!selection){
        return (
            <NothingSelected navigation={navigation} screenName={"Vyučující"} showText={"Vyberte učitele"}/>
        )
    }
    if(isLoading){
        return (
            <LoadingIndicator isLoading={isLoading}/>
        )

    }



    return (
        <View style={{flex:1, backgroundColor:"#fff"}} >
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
                                     contentWidth={1440}
                                     contentHeight={1200}
                                     style={{
                                        flex:1,
                                        flexDirection: 'row',
                                        width:tableWidth ,
                                        height:tableHeight
                                        }}
                                     animatePin={true}>

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

                                    {hour.map((parts, partsIndex) => {
                                        const find = substitutionData.find(
                                            (el) => {
                                                return el.hodina === hourIndex.toString() && el.den === (availableDates ? availableDates[denIndex] : "")
                                            }
                                        );
                                        return (
                                            <View key={partsIndex}
                                                  style={parts[0]==="-"&&find?styles.skupinaNovaHodina:styles.skupina}>

                                                {find != undefined && find.poznamka == "odpadá" || find?.zastupujici == "....." ?
                                                    <View>
                                                        <Text style={[styles.parta]}>{parts[3]}</Text>
                                                        <Text style={[styles.hodinaStyl]}>{parts[0]}</Text>
                                                        <Text style={styles.odpada}>odpadá</Text>
                                                    </View>
                                                    :
                                                    <View>
                                                        <View style={styles.horniRadek}>
                                                            {find != undefined ?
                                                                find.poznamka != "" ? <Text style={styles.poznamka}>{find.poznamka}</Text> : <Text style={styles.parta}>-</Text>
                                                                : <Text style={styles.parta}>-</Text>}
                                                            {find != undefined ?
                                                            <Text style={[styles.suplovanaTrida]}>{find.trida}</Text>: <Text style={[styles.parta]}>{parts[3]}</Text>}
                                                        </View>

                                                        <View style={{alignItems:"center"}}>
                                                            {find != undefined ?
                                                                <Text style={styles.odpada}>{find.predmet}</Text>
                                                                : <Text style={[styles.hodinaStyl]}>{parts[0]}</Text>}
                                                        </View>

                                                        <View style={[styles.spodniRadek]}>
                                                            {find != undefined ?
                                                                find.zastupujici !== "" ? <Text style={styles.zastupujiciUcitel}>{find.zastupujici}</Text> : <Text style={styles.teacher}>{parts[1]}</Text>
                                                                : <Text style={styles.teacher}>{parts[1]}</Text>}
                                                            {find != undefined ?
                                                                find.nahradni_ucebna !== "" ? <Text style={styles.suplovanaTrida}>{find.nahradni_ucebna}</Text> : <Text style={styles.suplovanaTrida}>{find.ucebna}</Text>
                                                                : <Text style={styles.trida}>{parts[2]}</Text>}
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

export default TeachersSchedule;

