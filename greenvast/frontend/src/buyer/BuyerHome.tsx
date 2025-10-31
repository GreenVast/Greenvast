import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BuyerHome() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock data for available produce listings
  const listings = [
    {
      id: '1',
      crop: 'Tomatoes',
      price: 'KSh 80/kg',
      farmer: 'Mary Wanjiku',
      county: 'Nakuru',
      phone: '+254700123456',
    },
    {
      id: '2',
      crop: 'Maize',
      price: 'KSh 65/kg',
      farmer: 'Joseph Kiptoo',
      county: 'Kericho',
      phone: '+254701987654',
    },
    {
      id: '3',
      crop: 'Avocados',
      price: 'KSh 120/kg',
      farmer: 'Grace Njeri',
      county: 'Murang’a',
      phone: '+254702456789',
    },
  ];

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleSupport = () => {
    Linking.openURL('tel:+254740682018');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Welcome, Buyer</Text>
          <Text style={styles.headerSubtitle}>{selectedCounty}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('BuyerProfile')}
        >
          <Ionicons name="person" size={26} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#777" />
          <TextInput
            placeholder="Search crops or farmers..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Dropdown-like filters (simple chips) */}
        <View style={styles.filterRow}>
          {['All', 'Kericho', 'Nakuru', 'Murang’a'].map((county) => (
            <TouchableOpacity
              key={county}
              style={[
                styles.filterChip,
                selectedCounty === county && styles.filterChipSelected,
              ]}
              onPress={() => setSelectedCounty(county)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCounty === county && styles.filterTextSelected,
                ]}
              >
                {county}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.filterRow}>
          {['All', 'Vegetables', 'Grains', 'Fruits'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterChip,
                selectedCategory === cat && styles.filterChipSelected,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === cat && styles.filterTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Listings */}
      <FlatList
        data={listings.filter(
          (item) =>
            (selectedCounty === 'All' || item.county === selectedCounty) &&
            item.crop.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.listCard}>
            <View>
              <Text style={styles.cropTitle}>{item.crop}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <Text style={styles.farmerName}>Farmer: {item.farmer}</Text>
              <Text style={styles.location}>County: {item.county}</Text>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCall(item.phone)}
            >
              <Ionicons name="call" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Floating Support Button */}
      <TouchableOpacity onPress={handleSupport} style={styles.fab}>
        <Ionicons name="call" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E8F5E9' },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: '700' },
  headerSubtitle: { color: '#E8F5E9', fontSize: 14, marginTop: 4 },
  profileButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 50,
    elevation: 3,
  },
  searchSection: { paddingHorizontal: 16, marginTop: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
    height: 45,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  filterChip: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 1,
  },
  filterChipSelected: {
    backgroundColor: '#2E7D32',
  },
  filterText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  filterTextSelected: {
    color: 'white',
  },
  listCard: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  cropTitle: { fontSize: 18, fontWeight: '700', color: '#2E7D32' },
  price: { fontSize: 16, fontWeight: '600', marginVertical: 2 },
  farmerName: { color: '#555', fontSize: 14 },
  location: { color: '#777', fontSize: 13 },
  callButton: {
    backgroundColor: '#2E7D32',
    padding: 10,
    borderRadius: 50,
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#2E7D32',
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});
