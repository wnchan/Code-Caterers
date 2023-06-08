import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useIsFocused } from '@react-navigation/native';

export default function PromotionPage() {
    const [menuItems, setMenuItems] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        fetchMenuItems();
    }, [isFocused]);

    const fetchMenuItems = async () => {
        try {
            const { data, error } = await supabase.from('Promotion').select('*');
            if (error) {
                console.error('Error fetching promotion details:', error.message);
                return;
            }
            setMenuItems(data);
        } catch (error) {
            console.error('Error fetching promotion details:', error.message);
        }
    };

    const renderMenuItem = ({ item }) => (
        <View style={styles.promotion}>
            <Image source={{ uri: item.image }} style={styles.promotionImage} />
            <View style={styles.promotionDetails}>
                <Text style={styles.promotionTitle}>{item.title}</Text>
                <Text style={styles.promotionDescription}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Recent Promotions & Deals:</Text>
            <FlatList
                data={menuItems}
                renderItem={renderMenuItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.promotionList}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        backgroundColor: '#FFF5FA',
        flex: 1,
        marginHorizontal: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    promotionList: {
        paddingBottom: 20,
    },
    promotion: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    promotionImage: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    promotionDetails: {
        flex: 1,
    },
    promotionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    promotionDescription: {
        marginBottom: 5,
    },
});