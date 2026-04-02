import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList,  Modal } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ArrowLeftPurple from '../components/ArrowLeftPurple'
import File from '../components/File'
import Descr from '../components/Descr'
import Trash from '../components/Trash'
import Modalite from '../components/Modalite'
import { Picker } from '@react-native-picker/picker';

const AxesModifications = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  //Pour les modals
    const [isModifyVisible, setModifyVisible] = useState(false);
    const [isAddFormationVisible, setAddFormationVisible] = useState(false);  
    // pour relier chaque input à un state
    //pour preparer pour lien avec BDD
    const [nomForm, setNomForm] = useState("");
    const [descriptionForm, setDescriptionForm] = useState("");
    const [ModaliteForm, setModaliteForm] = useState("");

    
    const data = [1, 2, 3, 4, 5, 6];

    // Fonction lorsqu'on ajoute un axe
    const handleFormation = async () => {
        try {
            const data = {
            nomForm,
            descriptionForm,
           
            }; // A COMPLETER
        } catch (error) {
            console.error("Erreur :", error);
        }
    }

    const handleSupp = () => {

    }

  const FormationCard = () => {
    return (
      <View style={styles.card}>
        

        {/* template sttique */}
        <View style={styles.circle} />

        {/* une template encore*/}
        <View>
          <Text style={styles.badge}>Titre de la formation</Text>
          <Text style={styles.desc}>Résumé de la formation</Text>

          <Text style={styles.info}>
            Durée : 10h    Présentiel
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleSupp()}>
        <Trash size={25} style={{ marginLeft: 70 }} />
        </TouchableOpacity>
    </View>
    )
  }

  return (

    <View style={styles.container}>
        <View style={[{marginTop:insets.top}, styles.header]}>
        <View style={styles.sideContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeftPurple />
          </TouchableOpacity>
        </View>

        <View style={styles.centerContainer}>
          <Text style={styles.title}>Axes</Text>
        </View>
      </View>

      {/* TITRE */}
      <Text style={styles.titleAxe}>
        Axe : Nom axe
      </Text>

      {/* LISTE */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => <FormationCard />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* BOUTON pour ajouter une formation qui va ouvrir une modal (jsp box) */}
      <TouchableOpacity style={styles.addButton }onPress={() => setAddFormationVisible(true)}>
        <Text style={styles.addButtonText}>+ Ajouter une formation</Text>
      </TouchableOpacity>

      {/*Ici c'est la modal pour ajouter une formation, c'est une box qui s'ouvre et voici son code*/}  
        <Modal visible={isAddFormationVisible} transparent animationType="slide">

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
                                    value={nomForm}
                                    onChangeText={setNomForm}
                                    placeholderTextColor="#fff"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Descr/>
                                <TextInput 
                                    style={styles.inputModal} 
                                    placeholder="Description" 
                                    //pour preparer pour lien avec BDD
                                    value={descriptionForm}
                                    onChangeText={setDescriptionForm}
                                    placeholderTextColor="#fff"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                            <Modalite/>
                            <Picker
                                selectedValue={ModaliteForm}
                                onValueChange={(itemValue) => setModaliteForm(itemValue)}
                                style={{ flex: 1, color: 'white' }}
                                dropdownIconColor="white"
                            >
                                <Picker.Item label="Présentiel" style={{color : Colors.pink, margin : 0}} value="presentiel" />
                                <Picker.Item label="Distanciel" style={{color : Colors.pink, margin : 0}} value="distanciel" />
                            </Picker>
                        </View>
                
                            {/* bouton qui doit enregistrer toutes les données et les ajouter à la BD */}
                            
                            <TouchableOpacity style={styles.button} onPress={() => handleFormation()}>
                                <Text style={styles.buttonText}>+ Ajouter une formation</Text>
                            </TouchableOpacity>


                            {/* bouton fermer */}
                            <TouchableOpacity onPress={() => setAddFormationVisible(false)}>
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
    flex: 1,
    backgroundColor: '#F2F2F2'
  },
  header : {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
    },
    arrowLeft: {
      alignItems: 'center',
      },
    sideContainer: {
      flex: 1,
      alignItems: 'flex-start',
  },
    centerContainer: {
      flex: 5
    },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    color : Colors.primary_blue,
  },
    titleAxe : {
        fontSize: 25,
    fontWeight: 'bold',
    margin: 15,
    color : Colors.black,
    },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6D6F2',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 20,
    padding: 15
  },

  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    marginRight: 10
  },

  badge: {
    backgroundColor: '#BFA2E6',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 12
  },

  desc: {
    color: '#666',
    fontSize: 12
  },

  info: {
    marginTop: 5,
    fontSize: 12
  },

  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    backgroundColor: Colors.primary_blue,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center'
  },

  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
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
        height : 35,
        marginBottom: 18
    },
    button: {
        backgroundColor: Colors.primary_blue,
        padding: 6,
        borderRadius: 30,
        alignItems: 'center',
        height : 33,
        marginLeft : 50,
        marginRight : 50
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13
    }, 

})

export default AxesModifications