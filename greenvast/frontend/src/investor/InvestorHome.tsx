import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguage } from '../context/LanguageContext';

const farmers = [
  {
    id: '1',
    name: 'Aisha Omar',
    county: 'Nairobi',
    farmingType: 'Maize',
    value: 'KES 180,000',
    phone: '+254712345678',
    funding: true,
  },
  {
    id: '2',
    name: 'John Mwangi',
    county: 'Kericho',
    farmingType: 'Tomatoes',
    value: 'KES 150,000',
    phone: '+254799888222',
    funding: true,
  },
  {
    id: '3',
    name: 'Grace Wanjiku',
    county: 'Nyeri',
    farmingType: 'Dairy',
    value: 'KES 220,000',
    phone: '+254701234890',
    funding: false,
  },
];

export default function InvestorHome() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { t, language, toggleLanguage } = useLanguage();

  const [search, setSearch] = useState('');
  const [county, setCounty] = useState('');
  const [farmingType, setFarmingType] = useState('');

  const filteredFarmers = useMemo(
    () =>
      farmers.filter(
        (farmer) =>
          farmer.funding &&
          (search === '' || farmer.name.toLowerCase().includes(search.toLowerCase())) &&
          (county === '' || farmer.county === county) &&
          (farmingType === '' || farmer.farmingType === farmingType),
      ),
    [search, county, farmingType],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>
              {t('investor.welcome', { name: user?.name || 'Investor' })}
            </Text>
            <Text style={styles.headerSubtitle}>{t('investor.subtitle')}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
              <Text style={styles.languageToggleText}>
                {language === 'en' ? 'SW' : 'EN'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('InvestorProfile')}
              style={styles.profileButton}
            >
              <Ionicons name='person' size={24} color='#2E7D32' />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.searchBox}>
            <Ionicons name='search-outline' size={20} color='#777' />
            <TextInput
              placeholder='Search farmer...'
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          <View style={styles.filterRow}>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={county} onValueChange={(val) => setCounty(val)}>
                <Picker.Item label='County' value='' />
                <Picker.Item label='Nairobi' value='Nairobi' />
                <Picker.Item label='Kericho' value='Kericho' />
                <Picker.Item label='Nyeri' value='Nyeri' />
              </Picker>
            </View>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={farmingType} onValueChange={(val) => setFarmingType(val)}>
                <Picker.Item label='Type' value='' />
                <Picker.Item label='Maize' value='Maize' />
                <Picker.Item label='Tomatoes' value='Tomatoes' />
                <Picker.Item label='Dairy' value='Dairy' />
              </Picker>
            </View>
          </View>

          <Text style={styles.resultsLabel}>
            {filteredFarmers.length} {filteredFarmers.length === 1 ? 'farmer' : 'farmers'} found
          </Text>

          <FlatList
            data={filteredFarmers}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.farmerCard}>
                <View>
                  <Text style={styles.farmerName}>{item.name}</Text>
                  <Text style={styles.farmerMeta}>
                    {item.farmingType} • {item.county}
                  </Text>
                  <Text style={styles.farmerPhone}>{item.phone}</Text>
                </View>
                <Text style={styles.valuation}>{item.value}</Text>
              </View>
            )}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E8F5E9' },
  screen: { flex: 1 },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  headerSubtitle: { color: '#C8E6C9', fontSize: 14, marginTop: 4 },
  headerActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
    height: 45,
    marginTop: 16,
  },
  searchInput: { flex: 1, paddingHorizontal: 8, fontSize: 15 },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
  },
  resultsLabel: {
    color: '#2E7D32',
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  farmerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmerName: { fontSize: 17, fontWeight: '700', color: '#2E7D32' },
  farmerMeta: { color: '#555555', marginTop: 4 },
  farmerPhone: { color: '#1B5E20', marginTop: 6 },
  valuation: {
    color: '#1B5E20',
    fontWeight: '700',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
});
