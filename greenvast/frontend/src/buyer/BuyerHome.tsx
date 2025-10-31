import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';

const listings = [
  {
    id: '1',
    crop: 'Tomatoes',
    price: 'KES 80/kg',
    farmer: 'Mary Wanjiku',
    county: 'Nakuru',
    phone: '+254700123456',
    category: 'Vegetables',
  },
  {
    id: '2',
    crop: 'Maize',
    price: 'KES 65/kg',
    farmer: 'Joseph Kiptoo',
    county: 'Kericho',
    phone: '+254701987654',
    category: 'Grains',
  },
  {
    id: '3',
    crop: 'Avocados',
    price: 'KES 120/kg',
    farmer: 'Grace Njeri',
    county: 'Murang\'a',
    phone: '+254702456789',
    category: 'Fruits',
  },
];

const counties = ['All', 'Kericho', 'Nakuru', 'Murang\'a'];
const categories = ['All', 'Vegetables', 'Grains', 'Fruits'];

export default function BuyerHome() {
  const navigation = useNavigation<any>();
  const { t, language, toggleLanguage } = useLanguage();

  const [search, setSearch] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredListings = useMemo(
    () =>
      listings.filter(
        (item) =>
          item.crop.toLowerCase().includes(search.toLowerCase()) &&
          (selectedCounty === 'All' || item.county === selectedCounty) &&
          (selectedCategory === 'All' || item.category === selectedCategory),
      ),
    [search, selectedCounty, selectedCategory],
  );

  const handleCall = (phone: string) => Linking.openURL(`tel:${phone}`);
  const handleSupport = () => Linking.openURL('tel:+254740682018');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{t('buyer.welcome')}</Text>
          <Text style={styles.headerSubtitle}>{selectedCounty}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
            <Text style={styles.languageToggleText}>
              {language === 'en' ? 'SW' : 'EN'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('BuyerProfile')}
          >
            <Ionicons name="person" size={26} color="#2E7D32" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#777" />
          <TextInput
            placeholder={t('buyer.searchPlaceholder')}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.filterRow}>
          {counties.map((county) => (
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
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                selectedCategory === category && styles.filterChipSelected,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === category && styles.filterTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredListings}
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
            <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.phone)}>
              <Ionicons name="call" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      />

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
    alignItems: 'center',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  headerSubtitle: { color: '#C8E6C9', fontSize: 14, marginTop: 4 },
  headerActions: { flexDirection: 'row', gap: 10 },
  languageToggle: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    elevation: 2,
  },
  languageToggleText: { color: '#2E7D32', fontWeight: '700', fontSize: 12 },
  profileButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 999,
    elevation: 3,
  },
  searchSection: { paddingHorizontal: 16, marginTop: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
    height: 45,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: '#333333' },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 1,
  },
  filterChipSelected: { backgroundColor: '#2E7D32' },
  filterText: { color: '#2E7D32', fontWeight: '600' },
  filterTextSelected: { color: '#FFFFFF' },
  listCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  cropTitle: { fontSize: 18, fontWeight: '700', color: '#2E7D32' },
  price: { fontSize: 16, fontWeight: '600', marginVertical: 4 },
  farmerName: { color: '#555555', fontSize: 14 },
  location: { color: '#777777', fontSize: 13 },
  callButton: { backgroundColor: '#2E7D32', padding: 10, borderRadius: 999 },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#2E7D32',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
