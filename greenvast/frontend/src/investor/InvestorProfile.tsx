import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';

export default function InvestorProfile() {
  const { user, logout, setUser } = useAuthStore();

  // Local form state
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    county: user?.county || '',
    language: user?.language || 'English',
    interest: user?.farmingType || '',
  });

  const handleSave = () => {
    setUser({
      ...user,
      ...form,
    } as any);
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    logout();
    alert('You have been logged out');
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

        {/* Icon */}
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
          Welcome, {form.name || 'Investor'}
        </Text>

        {/* Editable Fields */}
        <View style={{ backgroundColor: 'white', borderRadius: 14, padding: 16, elevation: 2 }}>
          <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 10, color: '#2E7D32' }}>
            Profile Details
          </Text>

          <Text style={{ marginTop: 8 }}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            placeholder="Your name"
          />

          <Text style={{ marginTop: 12 }}>Email</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={false}
          />

          <Text style={{ marginTop: 12 }}>County</Text>
          <TextInput
            style={styles.input}
            value={form.county}
            onChangeText={(text) => setForm({ ...form, county: text })}
            placeholder="e.g., Nairobi"
          />

          <Text style={{ marginTop: 12 }}>Language</Text>
          <TextInput
            style={styles.input}
            value={form.language}
            onChangeText={(text) => setForm({ ...form, language: text })}
            placeholder="English / Kiswahili"
          />

          <Text style={{ marginTop: 12 }}>Farming Interest</Text>
          <TextInput
            style={styles.input}
            value={form.interest}
            onChangeText={(text) => setForm({ ...form, interest: text })}
            placeholder="e.g., Dairy, Maize, Tomatoes"
          />
        </View>

        {/* Buttons */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: '#2E7D32',
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 24,
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>💾 Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => alert('Feature coming soon!')}
          style={{
            backgroundColor: '#1B5E20',
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>📊 View Investments</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: '#C62828',
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>🚪 Logout</Text>
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
