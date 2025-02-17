import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    sideColumn: {
        backgroundColor: '#4A628A',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 30,
        height: 1200,
    },
    sideText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tlacitka: {
        width:"100%",
        flexDirection:"row",
        justifyContent:'space-between',
        alignSelf:"flex-start",
        alignItems:"center"
    },
    back: {
        margin:5,
        flexDirection: "row",
        alignItems: "center",
    },
    backText: {
        fontSize: 20,
        color: '#007AFF',
    },
    rozvrh: {
        flex: 1,
        height: 1200,
    },
    dnyContainer: {
        justifyContent: "center",
        borderWidth: 1,
        backgroundColor: "#fff",
    },
    dny: {
        textAlign: "center",
        width: 70,
    },
    den: {
        flex: 1,
        flexDirection: "row",
        minHeight: 240,
    },
    skupina: {
        width: 102,
        minHeight: 50,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    horniRadek: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "95%",
        minHeight: 10,
    },
    poznamka: {
        fontWeight: "bold",
        color: "red",
        fontSize: 8,
        flexShrink: 1,
    },
    parta: {
        fontSize: 8,
        justifyContent: "flex-end",
    },
    hodinaStyl: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
        minHeight: 15,
    },
    spodniRadek: {
        flexDirection: "row",
        justifyContent: 'space-between',
        width: "95%",
        alignItems: "center",
        minHeight: 10,
    },
    teacher: {
        fontSize: 8,
    },
    trida: {
        fontSize: 8,
    },
    zastupujiciUcitel: {
        fontWeight: "bold",
        color: "red",
        fontSize: 8,
    },
    suplovanaTrida: {
        fontWeight: "bold",
        color: "red",
        fontSize: 8,
        flexShrink: 1,
    },
    odpada: {
        backgroundColor: "red",
        fontSize: 10,
        padding: 3,
        fontWeight: "bold",
        color: "white",
    },
    zatmaveni: {
        backgroundColor: "rgba(0,0,0,0.58)",
        flex: 1,
        flexDirection: "row",
        minHeight: 200,
    },
    bezZatmaveni: {
        flex: 1,
        flexDirection: "row",
        minHeight: 200,
    },
    nechybi: {
        borderWidth: 1,
    },
    chybi: {
        borderWidth: 1,
        backgroundColor: "rgba(204,102,102,0.8)",
    },
        skupinaNovaHodina:{
        width:102,
        minHeight:50,
        flex:1,
        backgroundColor:"#fcb500",
        justifyContent:"center",
        alignItems:"center"
    },
});

export default styles;