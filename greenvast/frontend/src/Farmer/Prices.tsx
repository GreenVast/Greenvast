import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const mockPrices = [
  { id: '1', crop: 'Maize', price: 'KES 80/kg', location: 'Nakuru' },
  { id: '2', crop: 'Tomatoes', price: 'KES 120/kg', location: 'Kiambu' },
  { id: '3', crop: 'Potatoes', price: 'KES 95/kg', location: 'Nyandarua' },
  { id: '4', crop: 'Avocados', price: 'KES 150/kg', location: 'Murang’a' },
];

export default function Prices() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Market Prices</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      <FlatList
        data={mockPrices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.crop}>{item.crop}</Text>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E8F5E9' },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  crop: { fontSize: 18, fontWeight: '700', color: '#2E7D32' },
  price: { fontSize: 16, color: '#444', marginTop: 4 },
  location: { fontSize: 14, color: '#777', marginTop: 2 },
});
