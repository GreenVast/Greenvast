import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';
import { useFarmerStore } from '../store/useFarmerStore';
import { findUser } from '../store/mockUsers';

export default function Login() {
  const navigation = useNavigation<any>();
  const setUser = useAuthStore((s) => s.setUser);
  const setFarmer = useFarmerStore((s) => s.setFarmer);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

  const found = findUser(email, password);
    if (!found) {
      Alert.alert('Invalid', 'Email or password incorrect');
      return;
    }

    // set auth state
    setUser({ email: found.email, role: found.role as any });

    // seed farmer store if farmer
    if (found.role === 'farmer') {
      setFarmer({
        name: 'Aisha Omar',
        phone: '0712345678',
        county: 'Nairobi',
        language: 'en',
        farmingType: 'Maize',
        email: found.email,
      });
      try {
        navigation.navigate('FarmerHome');
      } catch {
        // fallback to root
      }
    } else if (found.role === 'investor') {
      setFarmer({
        name: 'Aisha Omar',
        phone: '0712345678',
        county: 'Nairobi',
        language: 'en',
        farmingType: 'Maize',
        email: found.email,
      });
      try {
        navigation.navigate('InvestorHome');
      } catch {}
    } else if (found.role === 'buyer') {
      setFarmer({
        name: 'Aisha Omar',
        phone: '0712345678',
        county: 'Nairobi',
        language: 'en',
        farmingType: 'Maize',
        email: found.email,
      });
      try {
        navigation.navigate('BuyerHome');
      } catch {}
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#E8F5E9', justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', color: '#2E7D32', textAlign: 'center' }}>
        GreenVast 🌿
      </Text>
      <Text style={{ textAlign: 'center', color: '#666', marginBottom: 40 }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 15 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ backgroundColor: '#fff', padding: 14, borderRadius: 10 }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: '#2E7D32',
          marginTop: 25,
          padding: 14,
          borderRadius: 12,
        }}
      >
        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={{ textAlign: 'center', color: '#2E7D32', marginTop: 18 }}>
          Don’t have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
