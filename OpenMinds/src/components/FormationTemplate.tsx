import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors';
import PetitRond from './Rond';
import { useNavigation } from '@react-navigation/native';


interface FormationProps {
    color: string;
    colorTitle: string;
    title: string;
    duration: string;
    numero: number;
    presentiel: boolean;
    total : number;
    image : string;
    id : number;
    axe_title : string;
}

const FormationTemplate = ({color, colorTitle, title, duration, numero, presentiel, total, image, id, axe_title} : FormationProps) => {
    const navigation = useNavigation<any>();
    return (
    <View style={[style.container, { backgroundColor: color}]}>
        <Image source={{ uri: image }} style={style.imageContainer} />
        <View style={style.textContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12, fontWeight: 'bold', color: 'white', backgroundColor: colorTitle, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, textAlign: 'center' }}>{title}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12, color: Colors.grey }}>{axe_title}</Text>
            <View style={style.detailContainer}>
                <Text style={{ fontSize: 12, color: 'black'}}>Durée : {duration}h</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <Text style={{ fontSize: 12, color: 'black'}}>{presentiel ? 'Présentiel' : 'À distance'}</Text>
                    <PetitRond color={presentiel ? Colors.green : Colors.red} height={15} width={15} />
                </View>
            </View>
        </View>
        <View style={style.detail2Container}>
            <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold', backgroundColor: colorTitle, paddingHorizontal : 8, paddingVertical : 2, borderRadius : 10 }}>{numero}/{total}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Formations', { colorTitle, title, duration, numero, presentiel, total, image, id})}>
                <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold', backgroundColor: Colors.primary_blue, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>Rejoindre</Text>
            </TouchableOpacity>
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
        marginHorizontal : 20,
        marginVertical : 10,
        maxHeight: 100,
        elevation: 5,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.grey,
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