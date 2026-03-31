import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors';
import ArrowRight from './ArrowRight';
import { useNavigation } from '@react-navigation/native';

interface ProgressionProps {
    title: string;
    total: number;
    idThematique: number;
    progression: number;
    color: string;
    colorTitle: string;
    description : string;
    image : string;
}

const ProgressionTemplate = ({ title, total, idThematique, progression, color, colorTitle, description, image }: ProgressionProps) => {
  const navigation = useNavigation<any>();

  const acronyme = (title : string) => {
    return title.split(' ').map(word => word[0] + word[1]).join('').toUpperCase();
  }

  return (
    <View style={{margin: 20}}>
        <ImageBackground 
          source={{ uri: image }}
          resizeMode="cover"
          style={{ width: 200, height: 150}}
          imageStyle={{ 
            borderTopRightRadius: 10, 
            borderTopLeftRadius: 10 
          }}
        >
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
          <View style={[style.infoContainer, { backgroundColor: color }]}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: colorTitle}}>{acronyme(title)}</Text>
          </View>
          <View style={[style.infoContainer, { backgroundColor: colorTitle }]}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white'}}>{progression}/{total}</Text>
          </View>
        </View>
        </ImageBackground> 
        <View style={{width: 200, backgroundColor : color, padding : 10, borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: Colors.gray}}>Axe : {title}</Text>
          <View style={{marginBottom : 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{ fontSize: 12, color: Colors.primary_blue, marginTop: 5  }}>Progression en cours</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Formations', {color: color, colorTitle: colorTitle, title: title, total: total, id : idThematique, description : description})}>
              <View style={{backgroundColor: colorTitle, padding: 5, borderRadius: 20}}>
                <ArrowRight />
              </View>
            </TouchableOpacity>
          </View>
        </View>       
    </View>
  )
}

const style = StyleSheet.create({
  infoContainer: {
    borderRadius : 20, paddingHorizontal : 10, alignSelf: 'flex-start', margin: 10
  },
})

export default ProgressionTemplate