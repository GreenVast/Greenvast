import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigation } from '@react-navigation/native';

export default function InvestorProfile() {
  const logout = useAuthStore((s) => s.logout);
  const navigation = useNavigation<any>();

  // Example static profile data
  const profile = {
    name: 'Investor',
    email: 'investor@gmail.com',
    county: 'Nairobi',
    language: 'English',
    interest: 'Dairy, Maize, Tomatoes',
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#E8F5E9' }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
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
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>
          Investor Profile
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 50,
          }}
        >
          <Ionicons name="person" size={26} color="#2E7D32" />
        </View>
      </View>

      {/* Body */}
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: '#2E7D32',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Welcome, {profile.name}
        </Text>

        {/* Static Profile Details */}
        <View style={{ backgroundColor: 'white', borderRadius: 14, padding: 16, elevation: 2 }}>
          <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 10, color: '#2E7D32' }}>
            Profile Details
          </Text>
          <Text style={{ marginTop: 8 }}>Full Name</Text>
          <Text style={styles.input}>{profile.name}</Text>
          <Text style={{ marginTop: 12 }}>Email</Text>
          <Text style={styles.input}>{profile.email}</Text>
          <Text style={{ marginTop: 12 }}>County</Text>
          <Text style={styles.input}>{profile.county}</Text>
          <Text style={{ marginTop: 12 }}>Language</Text>
          <Text style={styles.input}>{profile.language}</Text>
          <Text style={{ marginTop: 12 }}>Farming Interest</Text>
          <Text style={styles.input}>{profile.interest}</Text>
        </View>

        {/* Investment History */}
        <View style={{ backgroundColor: 'white', borderRadius: 14, padding: 16, elevation: 2, marginTop: 24 }}>
          <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 10, color: '#2E7D32' }}>
            Investment History
          </Text>
          <Text style={{ marginBottom: 8 }}>Farmer: Aisha Omar</Text>
          <Text style={{ marginBottom: 8 }}>Amount: KES 50,000</Text>
          <Text style={{ marginBottom: 8 }}>Date: 2025-03-15</Text>
          <Text style={{ marginBottom: 8 }}>Status: Repaid</Text>
          <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 8 }} />
          <Text style={{ marginBottom: 8 }}>Farmer: John Mwangi</Text>
          <Text style={{ marginBottom: 8 }}>Amount: KES 30,000</Text>
          <Text style={{ marginBottom: 8 }}>Date: 2025-07-10</Text>
          <Text style={{ marginBottom: 8 }}>Status: Ongoing</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => {
            logout();
            navigation.navigate('Login');
          }}
          style={{
            backgroundColor: '#C62828',
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 24,
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = {
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    fontSize: 16,
  },
};