import {ReactNativeZoomableView} from "@openspacelabs/react-native-zoomable-view";
import {Text, View} from "react-native";
import React from "react";
interface ZoomableScheduleViewProps {
    tableWidth: number;
    tableHeight: number;
    weekType: string;
    evenWeek: any[];
    oddWeek: any[];
    darkeningStyles: any;
    daysOfWeek: string[];
    availableDates?: string[];
    missingPeriods?: any;
    timeSlots: any[];
    substitutionData: any[];
    styles: any;
    children: React.ReactNode;

}

const ZoomableScheduleView: React.FC<ZoomableScheduleViewProps> = ({
                                                                       tableWidth,
                                                                       tableHeight,
                                                                       weekType,
                                                                       evenWeek,
                                                                       oddWeek,
                                                                       darkeningStyles,
                                                                       daysOfWeek,
                                                                       availableDates,
                                                                       missingPeriods,
                                                                       timeSlots,
                                                                       styles,
                                                                       children

                                                                   }) => {
    return (
        <ReactNativeZoomableView
            maxZoom={3}
            minZoom={0.3}
            bindToBorders={true}
            contentWidth={tableWidth}
            contentHeight={tableHeight}
            style={{ flex: 1, flexDirection: 'row', width: tableWidth, height: tableHeight }}
            animatePin={true}
        >
            <View style={[styles.sideColumn]}>
                <Text style={styles.sideText}>{weekType}</Text>
            </View>

            <View style={styles.rozvrh}>
                {(weekType === 'Sudý týden' ? evenWeek : oddWeek).map((den, denIndex) => (
                    <View key={denIndex} style={darkeningStyles[denIndex]}>
                        <View style={styles.dnyContainer}>
                            <Text style={styles.dny}>{daysOfWeek[denIndex]}</Text>
                            {availableDates ? <Text style={styles.dny}>{availableDates[denIndex]}</Text> : null}
                        </View>

                        {den.map((hour:any[], hourIndex:number) => (
                            <View key={hourIndex} style={missingPeriods ? missingPeriods[denIndex][hourIndex] : styles.nechybi}>
                                {denIndex === 0 ? (
                                    <View style={{ alignItems: 'center', borderWidth: 1, backgroundColor: '#ffffff' }}>
                                        <Text>{timeSlots[hourIndex].hodina}</Text>
                                        <Text>{timeSlots[hourIndex].cas}</Text>
                                    </View>
                                ) : null}

                                {children}
                                {/*{hour.map((parts, partsIndex) => {*/}
                                {/*    const find = substitutionData.find(*/}
                                {/*        (el) => el.hodina === hourIndex.toString() && el.den === (availableDates ? availableDates[denIndex] : '')*/}
                                {/*    );*/}

                                {/*    return (*/}
                                {/*        <View*/}
                                {/*            key={partsIndex}*/}
                                {/*            style={parts[0] === '-' && find ? styles.skupinaNovaHodina : styles.skupina}*/}
                                {/*        >*/}
                                {/*            {find?.poznamka === 'odpadá' || find?.zastupujici === '.....' ? (*/}
                                {/*                <View>*/}
                                {/*                    <Text style={[styles.parta]}>{parts[3]}</Text>*/}
                                {/*                    <Text style={[styles.hodinaStyl]}>{parts[0]}</Text>*/}
                                {/*                    <Text style={styles.odpada}>odpadá</Text>*/}
                                {/*                </View>*/}
                                {/*            ) : (*/}
                                {/*                <View>*/}
                                {/*                    <View style={styles.horniRadek}>*/}
                                {/*                        <Text style={find?.poznamka ? styles.poznamka : styles.parta}>*/}
                                {/*                            {find?.poznamka || '-'}*/}
                                {/*                        </Text>*/}
                                {/*                        <Text style={find ? styles.suplovanaTrida : styles.parta}>*/}
                                {/*                            {find?.trida || parts[3]}*/}
                                {/*                        </Text>*/}
                                {/*                    </View>*/}

                                {/*                    <View style={{ alignItems: 'center' }}>*/}
                                {/*                        <Text style={find ? styles.odpada : styles.hodinaStyl}>*/}
                                {/*                            {find?.predmet || parts[0]}*/}
                                {/*                        </Text>*/}
                                {/*                    </View>*/}

                                {/*                    <View style={styles.spodniRadek}>*/}
                                {/*                        <Text style={find?.zastupujici ? styles.zastupujiciUcitel : styles.teacher}>*/}
                                {/*                            {find?.zastupujici || parts[1]}*/}
                                {/*                        </Text>*/}
                                {/*                        <Text style={find?.nahradni_ucebna ? styles.suplovanaTrida : styles.trida}>*/}
                                {/*                            {find?.nahradni_ucebna || parts[2]}*/}
                                {/*                        </Text>*/}
                                {/*                    </View>*/}
                                {/*                </View>*/}
                                {/*            )}*/}
                                {/*        </View>*/}
                                {/*    );*/}
                                {/*})}*/}
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </ReactNativeZoomableView>
    );
};
export default ZoomableScheduleView;