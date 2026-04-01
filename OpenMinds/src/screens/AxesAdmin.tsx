import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, FlatList} from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loupe from '../components/Loupe'
import MascotteForma from '../components/MascotteForma'
import Account from '../components/Account'
import ThematiqueTemplate from '../components/ThematiqueTemplate'
import { ENDPOINTS } from '../config/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import File from '../components/File'
import Color from '../components/Color'
import Descr from '../components/Descr'


const AxesAdmin = ({navigation}:any) => {
    const insets = useSafeAreaInsets();

    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formations, setFormations] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const chargerThematiques = async () => {
        const user = await AsyncStorage.getItem('userData');
        const userId = user ? JSON.parse(user).id : null;
        const response = await fetch(`${ENDPOINTS.THEMATIQUES}?idBenevole=${userId}`);
        const data = await response.json();
        setFormations(data);
    };

    useEffect(() => {
        chargerThematiques();
     }, []);

    const handleSearch = (query : string) => {
        setSearchQuery(query);
        const newData = formations.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
        setFilteredData(newData);
    }

    const handleLogin = () => {
  
}

    return (
        <View style={{ flex: 1 }}>
            <View>
                <LinearGradient style={styles.container}
                    colors={[Colors.purple, Colors.light_pink]} 
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 0, y: 1 }}
                    >
                    <View style={[{ marginTop: insets.top, marginBottom : 20 }, styles.header]}>
                        <Text style={styles.title}>Axes</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Account />
                        </TouchableOpacity>
                    </View>
                    <MascotteForma style={styles.mascotte} />
                    <View style={styles.searchSection}>
                        <Loupe />
                        <TextInput
                            style={styles.input}
                            autoCapitalize='none'
                            placeholder="Chercher des axes"
                            autoCorrect={false}
                            value={searchQuery}
                            onChangeText={(query) => handleSearch(query)}
                        />
                    </View>
                </LinearGradient>
            </View>

            <View style={{ flex: 3 }}>
                {searchQuery !== '' ? (<FlatList
                data={filteredData}
                keyExtractor={(item) => item.id_thematique.toString()}
                renderItem={({ item } : { item: any }) => (
                    <ThematiqueTemplate color={item.color} colorTitle={item.colorTitle} title={item.title} duration={item.totalDuration} total={item._count.formations} image={item.image} description={item.description} id_thematique={item.id_thematique} progression={item.progression} />
                )}

                contentContainerStyle={{ flexGrow: 1 }}
                
                ListEmptyComponent={
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{ fontSize: 18, color: 'gray' }}>Aucun axe trouvé</Text>
                    </View>
                }

                persistentScrollbar={true}
                bounces={true}
            />) : (
              <>
            
        
              </>
            )}
            {/* ici, tu n'as rien à faire. Ça dit juste que quand on clique ca affiche la modal */}
            <TouchableOpacity onPress={() => setVisible(true)}>
                <Text style={styles.addAxe}>+ Ajouter un axe</Text>
            </TouchableOpacity>
            </View>
            <Modal visible={visible} transparent animationType="slide">


    {/*Ici c'est la modal, c'est une box qui s'ouvre et voici son code*/}
    <View style={styles.modalBackground}>
        <View style={styles.modalBox}>

            <View style={styles.containerModal}>

                {/* premier input */}
                <View style={styles.inputContainer}>
                    <File/>
                    <TextInput 
                        style={styles.inputModal} 
                        placeholder="Nom" 
                        placeholderTextColor="#fff"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Descr/>
                    <TextInput 
                        style={styles.inputModal} 
                        placeholder="Description" 
                        placeholderTextColor="#fff"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Color/>
                    <TextInput 
                        style={styles.inputModal} 
                        placeholder="Couleur" 
                        placeholderTextColor="#fff"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Color/>
                    <TextInput 
                        style={styles.inputModal} 
                        placeholder="Couleur titre" 
                        placeholderTextColor="#fff"
                    />
                </View>
                {/* bouton qui doit enregistrer toutes les données et les ajouter à la BD */}

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>+ Ajouter un axe</Text>
                </TouchableOpacity>

                {/* bouton fermer */}
                <TouchableOpacity onPress={() => setVisible(false)}>
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>Fermer</Text>
                </TouchableOpacity>

            </View>

        </View>
    </View>

</Modal>

        </View>
    
    )
}

const styles = StyleSheet.create({
    container: {
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        paddingBottom: 10,
        marginBottom: 10,
    },

    header : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
    },

    title: { 
        fontSize: 40, 
        fontWeight: 'bold', 
        color: Colors.white 
    },
    mascotte: {
        alignSelf: 'center',
    },

    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
    },

    addAxe : {
        paddingHorizontal : 30,
        paddingVertical : 10,
        backgroundColor : Colors.primary_blue,
        color : Colors.white,
        fontWeight : "bold",
        fontSize : 20,
        borderRadius : 30,
        margin : 60,
        textAlign : "center"
    },

    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    modalBox: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 17,
        padding: 10
    },

    containerModal: {
        padding: 20,
        marginTop: 10
    },

     icone:{
     width: 20, 
     height: 20,
      marginLeft: 5  
    },

    inputModal: {
        flex: 1,
        marginLeft: 10,
        color: 'white',
        fontWeight: 'bold'
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6D6F2',
        borderRadius: 30,
        paddingHorizontal: 15,
        height : 40,
        marginBottom: 20
    },

    input: {
        backgroundColor: Colors.white,
        margin: 5,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        color: '#424242',
    },

    button: {
        backgroundColor: Colors.primary_blue,
        padding: 8,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 7,
        height : 40
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17
    }, 
})

export default AxesAdmin