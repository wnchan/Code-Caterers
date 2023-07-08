import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, ActivityIndicator, TextInput } from 'react-native-paper';
import { Link } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function PromotionForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();
  const [stall, setStall] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    fetchStallId();
  }, []);

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

  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setErrMsg('');
    if (title === '') {
      setErrMsg('Promotion title cannot be empty');
      return;
    }
    setLoading(true);
    let uploadedImage = null;
    if (image != null) {
      const { data, error } = await supabase.storage.from('PromotionImage').upload(`${new Date().getTime()}`, { uri: image, type: 'jpg', name: 'name.jpg' });

      if (error != null) {
        console.log(error);
        setErrMsg(error.message);
        setLoading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('PromotionImage').getPublicUrl(data.path);
      uploadedImage = publicUrl;
    }
    const { data, error } = await supabase
      .from('promotion')
      .insert({
        image: uploadedImage,
        title: title,
        description: description,
        stall_id: stall.id,
        start_date: startDate,
        end_date: endDate,
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
    router.push('../(StallOwnerHome)/Promotions');
    console.log('Promotion added successfully:', data);
    setTitle('');
    setDescription('');
    

    if (error) {
      console.error('Error inserting menu item:', error.message);
      return;
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Promotions:</Text>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        multiline
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

      <Text style={styles.warning}>Please remember to include both a start and end date.</Text>
      <Button onPress={() => setShowStartDatePicker(true)} style={styles.buttonContainer}>
        <Text style={styles.buttons}>Start Date: {formatDate(startDate)}</Text>
      </Button>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartDatePicker(false);
            if (date) {
              setStartDate(date);
            }
          }}
        />
      )}

      <Button onPress={() => setShowEndDatePicker(true)} style={styles.buttonContainer}>
        <Text style={styles.buttons}>End Date: {formatDate(endDate)}</Text>
      </Button>
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndDatePicker(false);
            if (date) {
              setEndDate(date);
            }
          }}
        />
      )}

      <Button onPress={handleSubmit} style={styles.buttonContainer}>
        <Text style={styles.buttons}>Submit</Text>
      </Button>
      {errMsg !== '' && <Text style={styles.error}>{errMsg}</Text>}
      <Link href="../(StallOwnerHome)/Promotions">
        <Button style={styles.buttonContainer}>
          <Text mode="contained" style={styles.buttons}>
            Discard & Return
          </Text>
        </Button>
      </Link>
      {loading && <ActivityIndicator />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5FA',
    justifyContent: 'flex-start',
    padding: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFECF6',
  },
  error: {
    color: 'red',
    marginTop: 10,
    marginHorizontal: 5,
  },
  buttonContainer: {
    marginHorizontal: 0,
    marginBottom: 10,
    backgroundColor: '#FFECF6',
    borderWidth: 1,
    borderColor: '#FFBBDF',
    color: '#2C0080',
    width: '100%',
  },
  buttons: {
    color: '#2C0080',
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  warning: {
    color: '#FF80AB',
    marginBottom: 10,
  }
});

/*  setEndDate(null);
    setShowClearEndDateButton(false); 
    
    const [showClearEndDateButton, setShowClearEndDateButton] = useState(false);

    {showClearEndDateButton && (
        <Button onPress={() => {
            setEndDate(null);
            setShowClearEndDateButton(false);
        }} style={styles.buttonContainer}>
            <Text style={styles.buttons}>Clear End Date</Text>
        </Button>
    )}
*/