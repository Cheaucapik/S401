import { View, Text, FlatList} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../constants/Colors'
import FormationTemplate from '../components/FormationTemplate'
import { useRoute } from '@react-navigation/native';

interface FormationsProps {
  title: string;
  colorTitle: string;
  color : string;
  total : number;
  id : number;
  description : string;
}

const Formations = () => {
    const route = useRoute()
    const { color, colorTitle, title, total, id, description} = (route.params as FormationsProps) || {};
    const [formations, setFormations] = useState<any[]>([]);
    const chargerFormations = async () => {
        const response = await fetch('http://192.168.1.32:3000/api/formations?id=' + id);
        const data = await response.json();
        setFormations(data);
    };

    useEffect(() => {
        chargerFormations();
     }, []);

    return (
        <View style={{backgroundColor : Colors.white, flex : 1}}>
            <View style={{padding : 20}}>
                <Text style={{fontSize : 30, fontWeight: 'bold', marginBottom: 20}}>Thématique : {title}</Text>
                <Text style={{fontSize : 16}}>{description}</Text>
            </View>
                <FlatList
                style={{flex : 1}}
                data={formations}
                keyExtractor={(item) => item.id_formation.toString()}
                renderItem={({ item } : { item: any }) => (
                    <FormationTemplate color={color} colorTitle={colorTitle} title={item.title} duration={item.duration} numero={item.numero} presentiel={item.presentiel} total={total} image={item.image} id={item.id_formation} />
                )}

                contentContainerStyle={{ flexGrow: 1 }}

                persistentScrollbar={true}
                bounces={true}
            />
            
            </View>
    )
}

export default Formations