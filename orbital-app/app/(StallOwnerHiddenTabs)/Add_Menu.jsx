import { useState, useEffect } from "react";
import { View, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

/**
 * Component for adding a menu item.
 *
 * @returns {JSX.Element} The JSX element representing the AddMenuPage component.
 */
export default function AddMenuPage() {
  const [name, setName] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const { userId } = useAuth();
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stall, setStall] = useState(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [newDietaryRestriction, setNewDietaryRestriction] = useState('');

  useEffect(() => {
    fetchStallId();
  }, []);

  /**
   * Fetches the stall ID associated with the logged-in user.
   */
  const fetchStallId = async () => {
    try {
      const { data, error } = await supabase
        .from('stall')
        .select('id')
        .eq('owner_id', userId)
        .single();

      if (error) {
        console.error('Error fetching stall ID:', error.message);
        return;
      }

      setStall(data);
    } catch (error) {
      console.error('Error fetching stall ID:', error.message);
    }
  };

  /**
   * Handles adding an image from the device's image library.
   */
  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  /**
   * Handles the submission of the menu item form.
   */
  const handleSubmit = async () => {
    setErrMsg('');
    if (name === '') {
      setErrMsg('Dish name cannot be empty')
      return;
    }
    setLoading(true);
    let uploadedImage = null;
    if (image != null) {
      const { data, error } = await supabase.storage.from('MenuImage').upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });

      if (error != null) {
        console.log(error);
        setErrMsg(error.message)
        setLoading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('MenuImage').getPublicUrl(data.path);
      uploadedImage = publicUrl;
    }
    console.log(stall);
    const { data, error } = await supabase
      .from('menu')
      .insert({
        name: name,
        image: uploadedImage,
        description: description,
        price: parseFloat(price),
        stall_id: stall.id,
        dietary_restrictions: dietaryRestrictions,
      })
      .select()
      .single();

    if (error != null) {
      setLoading(false);
      console.log(error);
      setErrMsg(error.message);
      return;
    }

    setLoading(false);
    router.push('../(StallOwnerHome)/Menu');
    console.log('Menu item inserted successfully:', data);
    setName('');
    setDescription('');
    setPrice('');

    if (error) {
      console.error('Error inserting menu item:', error.message);
      return;
    }
  };

  /**
   * Handles adding a dietary restriction.
   */
  const handleAddDietaryRestriction = () => {
    if (newDietaryRestriction !== '') {
      if (newDietaryRestriction.trim() === '') return;

      const normalizedRestriction = newDietaryRestriction.trim().toUpperCase();

      // Check for duplicate restrictions
      if (dietaryRestrictions.includes(normalizedRestriction)) {
        setErrMsg('This restriction has already been added.');
        return;
      }

      // Check for "halal" and "vegetarian" restrictions
      const restrictedRestrictions = ['HALAL', 'VEGETARIAN'];
      if (restrictedRestrictions.includes(normalizedRestriction)) {
        setErrMsg('Adding HALAL or VEGETARIAN as a restriction is not allowed.');
        return;
      }

      const updatedRestrictions = [...dietaryRestrictions, normalizedRestriction];
      setDietaryRestrictions(updatedRestrictions);
      setNewDietaryRestriction('');
    }
  };

  /**
   * Handles removing a dietary restriction.
   *
   * @param {number} index - The index of the dietary restriction to be removed.
   */
  const handleRemoveDietaryRestriction = (index) => {
    const updatedDietaryRestrictions = [...dietaryRestrictions];
    updatedDietaryRestrictions.splice(index, 1);
    setDietaryRestrictions(updatedDietaryRestrictions);
  };

  /**
   * Handles the input change in the Dietary Restrictions TextInput.
   * @param {string} text - The input text value.
   */
  const handleInputChange = (text) => {
    setNewDietaryRestriction(text);
    setErrMsg(''); // Clear the error message when text changes
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Add Menu:</Text>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Button style={styles.buttonContainer} onPress={handleAddImage}>
          <Text style={styles.buttons}>Add Image</Text>
        </Button>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.input}
        />
        <TextInput
          label="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <Text style={styles.warning}>Note: Do not put halal and vegetarian as dietary restrictions</Text>
        <Text style={styles.warning2}>Currently, we only take into account fish, shellfish, lamb, beef, pork, chicken, eggs, diary, gluten, soy, peanuts.</Text>
        <TextInput
          label="Dietary Restrictions"
          value={newDietaryRestriction}
          onChangeText={handleInputChange}
          style={styles.input}
        />
        <View style={styles.dietaryRestrictionsContainer}>
          {dietaryRestrictions.map((restriction, index) => (
            <View key={index} style={styles.dietaryRestrictionItem}>
              <Text style={styles.dietaryRestrictionText}>{restriction}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveDietaryRestriction(index)}
                style={styles.removeDietaryRestrictionButton}
              >
                <Text style={styles.removeDietaryRestrictionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Button onPress={handleAddDietaryRestriction} style={styles.buttonContainer}>
          <Text style={styles.buttons}>Add Dietary Restriction</Text>
        </Button>

        <Button onPress={handleSubmit} style={styles.buttonContainer}>
          <Text style={styles.buttons}>Submit</Text>
        </Button>
        {errMsg !== '' && <Text style={styles.warning}>{errMsg}</Text>}
        {loading && <ActivityIndicator style={styles.indicator} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    backgroundColor: '#FFF5FA',
    flex: 1,
    paddingHorizontal: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFECF6',
  },
  buttons: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginHorizontal: 5,
    marginBottom: 10,
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
    marginTop: 5,
  },
  dietaryRestrictionsContainer: {
    marginBottom: 7,
  },
  dietaryRestrictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 15,
    backgroundColor: '#FFECF6',
    height: 40,
  },
  dietaryRestrictionText: {
    fontSize: 15,
    color: 'black',
  },
  removeDietaryRestrictionButton: {
    backgroundColor: 'transparent',
  },
  removeDietaryRestrictionText: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  warning: {
    color: 'red',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  warning2: {
    color: 'red',
    marginBottom: 15,
    marginHorizontal: 5,
  },
  indicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
  },
});
