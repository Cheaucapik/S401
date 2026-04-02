import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors';
import ArrowRight from './ArrowRight';
import { useNavigation } from '@react-navigation/native';

interface ProgressionProps {
    title: string;
    id_session: number;
    color: string;
    colorTitle: string;
    image : string;
    date_deb : string,
    date_fin : string;
}

const SessionsTemplateHome = ({ title, id_session, color, colorTitle, image, date_deb, date_fin }: ProgressionProps) => {
  const navigation = useNavigation<any>();

  const acronyme = (title : string) => {
    return title.split(' ').map(word => word[0] + word[1]).join('').toUpperCase();
  }

  const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatHeure = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

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
        </View>
        </ImageBackground> 
        <View style={{width: 200, backgroundColor : color, padding : 10, borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: Colors.gray}}>Axe : {title}</Text>
          <View style={{marginBottom : 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View>
                <Text style={{ fontSize: 12, color: Colors.primary_blue, marginTop: 5  }}>{formatDate(date_deb)}</Text>
                <Text style={{ fontSize: 12, color: Colors.primary_blue, marginTop: 5  }}>{formatHeure(date_deb)}h-{formatHeure(date_fin)}h</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ListeParticipants', {sessionId : id_session})}>
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

export default SessionsTemplateHome