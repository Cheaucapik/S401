import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal} from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loupe from '../components/Loupe'
import MascotteExplorer from '../components/MascotteExplorer'
import Account from '../components/Account'
import ThematiqueTemplate from '../components/ThematiqueTemplate'
import File from '../components/File'
import Color from '../components/Color'
import Descr from '../components/Descr'

const HomePageAdmin = ({navigation}:any) => {
    const insets = useSafeAreaInsets();

    //variable + fonction pour la modal
    const [visible, setVisible] = useState(false);

    // pour relier chaque input à un state
    //pour preparer pour lien avec BDD
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [couleur, setCouleur] = useState("");
    const [couleurTitre, setCouleurTitre] = useState("");
    
    const [searchQuery, setSearchQuery] = useState('');
    const [formations, setFormations] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const chargerThematiques = async () => {
        const response = await fetch('http://192.168.1.147:3000/api/thematiques');
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

   // Fonction lorsqu'on ajoute un axe
    const handleAxe = async () => {
        try {
            const data = {
            nom,
            description,
            couleur,
            couleurTitre
            }; // A COMPLETER
        } catch (error) {
            console.error("Erreur :", error);
        }
  
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
                        <Text style={styles.title}>Explorer</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Account />
                        </TouchableOpacity>
                    </View>
                    <MascotteExplorer style={styles.mascotte} />
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
                    <ThematiqueTemplate color={item.color} colorTitle={item.colorTitle} title={item.title} duration={item.totalDuration} total={item._count.formations} image={item.image} description={item.description} id_thematique={item.id_thematique} progression={0} />
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
            
                <View>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', margin: 20 }}>Modifier les axes</Text>
                </View>
              </>
            )}
            {/* ici, tu n'as rien à faire. Ça dit juste que quand on clique ca affiche la modal */}
                <TouchableOpacity onPress={() => setVisible(true)}>
                    <Text style={styles.addAxe}>+ Ajouter un axe</Text>
                    </TouchableOpacity>
            {/*Ici c'est la modal, c'est une box qui s'ouvre et voici son code*/}  
    <Modal visible={visible} transparent animationType="slide">

    <View style={styles.modalBackground}>
        <View style={styles.modalBox}>

            <View style={styles.containerModal}>

                {/* premier input */}
                <View style={styles.inputContainer}>
                    <File/>
                    <TextInput 
                        style={styles.inputModal} 
                        placeholder="Nom" 
                         //pour preparer pour lien avec BDD
                        value={nom}
                        onChangeText={setNom}
                        placeholderTextColor="#fff"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Descr/>
                    <TextInput 
                        style={styles.inputModal} 
                        placeholder="Description" 
                        //pour preparer pour lien avec BDD
                        value={description}
                        onChangeText={setDescription}
                        placeholderTextColor="#fff"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Color/>
                    <TextInput 
                        style={styles.inputModal} 
                        placeholder="Couleur" 
                         //pour preparer pour lien avec BDD
                        value={couleur}
                        onChangeText={setCouleur}
                        placeholderTextColor="#fff"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Color/>
                    <TextInput 
                        style={styles.inputModal} 
                        placeholder="Couleur titre" 
                        value={couleurTitre}
                        onChangeText={setCouleurTitre}
                        placeholderTextColor="#fff"
                    />
                </View>

                {/* bouton qui doit enregistrer toutes les données et les ajouter à la BD */}
                
                <TouchableOpacity style={styles.button} onPress={() => handleAxe()}>
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
    title: { fontSize: 40, fontWeight: 'bold', color: Colors.white },
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
    mascotte: {
        alignSelf: 'center',
    },
    header : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
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
        backgroundColor: '#dcb7f9',
        borderRadius: 30,
        paddingHorizontal: 15,
        height : 40,
        marginBottom: 20
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

export default HomePageAdmin