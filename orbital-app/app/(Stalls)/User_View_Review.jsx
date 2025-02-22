import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { AirbnbRating } from 'react-native-ratings';

/**
 * Component for displaying the details of a user's review.
 */
export default function UserViewReviewScreen() {
  const reviewId = useSearchParams();
  const [review, setReview] = useState(null);

  useEffect(() => {
    fetchReviewDetails();
  }, []);

  /**
   * Fetches the details of the review from the database.
   */
  const fetchReviewDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('review')
        .select('*, profile (username, image)')
        .eq('id', reviewId.id)
        .single();

      if (error) {
        console.error('Error fetching review details:', error.message);
        return;
      }
      setReview(data);
    } catch (error) {
      console.error('Error fetching review details:', error.message);
    }
  };

  if (!review) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: review.profile.image }} style={styles.profileImage} />
      <View style={styles.reviewDetails}>
        <Text style={styles.username}>{review.profile.username}</Text>
        <AirbnbRating
          defaultRating={parseFloat(review.rating) || 0}
          size={30}
          isDisabled
          showRating={false}
          minRating={0}
          maxRating={5}
          style={styles.rating}
        />
        <Text style={styles.comment}>{review.review_text}</Text>
        {review.image && <Image source={{ uri: review.image }} style={styles.reviewImage} />}
        <Text>{review.updated_at}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF5FA',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 35,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  reviewDetails: {
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  comment: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  reviewImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
});
