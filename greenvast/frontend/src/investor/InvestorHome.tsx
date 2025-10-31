import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';

export default function InvestorHome() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();

  const [search, setSearch] = useState('');
  const [county, setCounty] = useState('');
  const [farmingType, setFarmingType] = useState('');

  // 🧑🏾‍🌾 Mock Farmers List with contacts
  const farmers = [
    {
      id: '1',
      name: 'Aisha Omar',
      county: 'Nairobi',
      farmingType: 'Maize',
      value: 'KSh 180,000',
      phone: '+254 712 345 678',
      funding: true,
    },
    {
      id: '2',
      name: 'John Mwangi',
      county: 'Kericho',
      farmingType: 'Tomatoes',
      value: 'KSh 150,000',
      phone: '+254 799 888 222',
      funding: true,
    },
    {
      id: '3',
      name: 'Grace Wanjiku',
      county: 'Nyeri',
      farmingType: 'Dairy',
      value: 'KSh 220,000',
      phone: '+254 701 234 890',
      funding: false,
    },
    {
      id: '4',
      name: 'Peter Otieno',
      county: 'Nairobi',
      farmingType: 'Dairy',
      value: 'KSh 190,000',
      phone: '+254 729 876 543',
      funding: true,
    },
    {
      id: '5',
      name: 'Mercy Kiptoo',
      county: 'Kericho',
      farmingType: 'Maize',
      value: 'KSh 160,000',
      phone: '+254 710 555 321',
      funding: true,
    },
  ];

  // Filtering logic (connects search + dropdowns)
  const filteredFarmers = farmers.filter(
    (f) =>
      f.funding === true &&
      (search === '' || f.name.toLowerCase().includes(search.toLowerCase())) &&
      (county === '' || f.county === county) &&
      (farmingType === '' || f.farmingType === farmingType)
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#E8F5E9' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#2E7D32',
          paddingTop: Platform.OS === 'ios' ? 60 : 40,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: '700' }}>
            Welcome, {user?.name || 'Investor'}
          </Text>
          <Text style={{ color: 'white', fontSize: 14, marginTop: 4 }}>
            Search for farmers to fund 🌿
          </Text>
        </View>

        {/* Profile button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('InvestorProfile')}
          style={{
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 50,
          }}
        >
          <Ionicons name="person" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Search Bar (small & sleek) */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 10,
            paddingHorizontal: 8,
            height: 40,
            elevation: 2,
            marginBottom: 10,
          }}
        >
          <Ionicons name="search" size={18} color="#2E7D32" />
          <TextInput
            placeholder="Search farmer..."
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              paddingHorizontal: 8,
              fontSize: 15,
            }}
          />
        </View>

        {/* County + Farming Type dropdowns */}
        <View style={{ flexDirection: 'row', marginBottom: 18, gap: 8 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 10,
              elevation: 1,
              overflow: 'hidden',
            }}
          >
            <Picker
              selectedValue={county}
              onValueChange={(val) => setCounty(val)}
              mode="dropdown"
            >
              <Picker.Item label="County" value="" />
              <Picker.Item label="Nairobi" value="Nairobi" />
              <Picker.Item label="Kericho" value="Kericho" />
              <Picker.Item label="Nyeri" value="Nyeri" />
            </Picker>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderRadius: 10,
              elevation: 1,
              overflow: 'hidden',
            }}
          >
            <Picker
              selectedValue={farmingType}
              onValueChange={(val) => setFarmingType(val)}
              mode="dropdown"
            >
              <Picker.Item label="Type" value="" />
              <Picker.Item label="Maize" value="Maize" />
              <Picker.Item label="Tomatoes" value="Tomatoes" />
              <Picker.Item label="Dairy" value="Dairy" />
            </Picker>
          </View>
        </View>

        {/* Results */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#2E7D32',
            marginBottom: 10,
          }}
        >
          Farmers Looking for Funding: {filteredFarmers.length}
        </Text>

        {filteredFarmers.length === 0 ? (
          <Text style={{ color: '#555', fontSize: 15 }}>
            No farmers match your search.
          </Text>
        ) : (
          <FlatList
            data={filteredFarmers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 14,
                  borderRadius: 12,
                  marginBottom: 12,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: '700',
                        color: '#2E7D32',
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text style={{ color: '#555', marginTop: 4 }}>
                      {item.farmingType} • {item.county}
                    </Text>
                    <Text style={{ color: '#1B5E20', marginTop: 4 }}>
                      📞 {item.phone}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontWeight: '700',
                      color: '#1B5E20',
                      backgroundColor: '#E8F5E9',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}
                  >
                    {item.value}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>
    </View>
  );
}
