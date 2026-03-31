import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import { Colors } from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';


interface FormationProps {
    color: string;
    colorTitle: string;
    title: string;
    duration: string;
    total : number;
    image : string;
    id_thematique : number;
    description : string;
    progression : number;
}

const ThematiqueTemplate = ({color, colorTitle, title, duration, total, image, id_thematique, description, progression} : FormationProps) => {
    const navigation = useNavigation<any>();

    return (
    <View style={[style.container, { backgroundColor: progression / total == 1 ? Colors.white : color}]}>
        <Image source={{ uri: image }} style={style.imageContainer} />
        <View style={style.textContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12, fontWeight: 'bold', color: 'white', backgroundColor: progression / total == 1 ? Colors.gray : colorTitle, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, textAlign: 'center' }}>{title}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12, color: Colors.grey }}>{description}</Text>
            <View style={style.detailContainer}>
                <Text style={{ fontSize: 12, color: 'black'}}>Durée : {duration}h</Text>
            </View>
        </View>
        <View style={style.detail2Container}>
            <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold', backgroundColor: progression / total == 1 ? Colors.gray : colorTitle, paddingHorizontal : 8, paddingVertical : 2, borderRadius : 10 }}>{progression}/{total}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Formations', {color, colorTitle, title, total, id : id_thematique, description})}>
                <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold', backgroundColor: progression / total == 1 ? Colors.gray : Colors.primary_blue, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20 }}>{progression !== 0 ? "Continuer" : "Rejoindre"}</Text>
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


export default ThematiqueTemplate