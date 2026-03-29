import { View, Text, FlatList} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../constants/Colors'
import FormationTemplate from '../components/FormationTemplate'
import { useRoute } from '@react-navigation/native';
import { ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const jsonValue = await AsyncStorage.getItem('userData');
        const user = jsonValue != null ? JSON.parse(jsonValue) : null;
        const [respFormations, respSuivi] = await Promise.all([
                fetch(`${ENDPOINTS.FORMATIONS}?id=${id}`),
                fetch(`${ENDPOINTS.SUIVI}?id=${user?.id}`)
            ]);


        const dataFormation = await respFormations.json();
        const dataSuivi = await respSuivi.json();

        const formationsMarquees = dataFormation.map((f : any) => {
            const estFait = dataSuivi.some((d : any) => d.session.formation.id_formation === f.id_formation);
            return {
                ...f,
                fait: estFait,
            };
        });

        setFormations(formationsMarquees);
        console.log("Formation sélectionnée :", title);
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
                    item.fait ? <FormationTemplate color={Colors.white} colorTitle={Colors.gray} title={item.title} duration={item.duration} numero={item.numero} presentiel={item.presentiel} total={total} image={item.image} id={item.id_formation} fait={item.fait}/> : 
                    <FormationTemplate color={color} colorTitle={colorTitle} title={item.title} duration={item.duration} numero={item.numero} presentiel={item.presentiel} total={total} image={item.image} id={item.id_formation} fait={item.fait} />
                )}

                contentContainerStyle={{ flexGrow: 1 }}

                persistentScrollbar={true}
                bounces={true}
            />
            
            </View>
    )
}

export default Formations