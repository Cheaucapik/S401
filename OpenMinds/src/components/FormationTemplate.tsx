import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors';
import PetitRond from './Rond';


interface FormationProps {
    color: string;
    colorTitle: string;
    title: string;
    duration: string;
    status: string;
    presentiel: boolean;
}

const FormationTemplate = ({color, colorTitle, title, duration, status, presentiel} : FormationProps) => {
  return (
    <View style={[style.container, { backgroundColor: color}]}>
        <Image source={require('../assets/AidePersonnes.png')} style={style.imageContainer} />
        <View style={style.textContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12, fontWeight: 'bold', color: 'white', backgroundColor: colorTitle, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>{title}</Text>
            <Text style={{ fontSize: 12, color: Colors.grey }}>Résumé de la formation</Text>
            <View style={style.detailContainer}>
                <Text style={{ fontSize: 12, color: 'black'}}>Durée : {duration}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <Text style={{ fontSize: 12, color: 'black'}}>{presentiel ? 'Présentiel' : 'À distance'}</Text>
                    <PetitRond color={presentiel ? Colors.green : Colors.red} height={15} width={15} />
                </View>
            </View>
        </View>
        <View style={style.detail2Container}>
            <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold', backgroundColor: colorTitle, paddingHorizontal : 8, paddingVertical : 2, borderRadius : 10 }}>{status}</Text>
            <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold', backgroundColor: Colors.primary_blue, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>Rejoindre</Text>
        </View>
    </View>
  )
}

const style = StyleSheet.create({
    container : {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        padding: 15,
        borderRadius: 15,
        margin : 20,
        maxHeight: 100,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    textContainer: {
        flexDirection: 'column',
        gap: 5,
        width: 160,
    },
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detail2Container: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 5,
        height: "100%",
    },

})


export default FormationTemplate