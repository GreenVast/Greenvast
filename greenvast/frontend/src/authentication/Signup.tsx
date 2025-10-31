import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { addUser, findUser } from '../store/mockUsers';
import { useAuthStore } from '../store/useAuthStore';
import { useFarmerStore } from '../store/useFarmerStore';

export default function Signup() {
  const navigation = useNavigation<any>();
  const setUser = useAuthStore((s) => s.setUser);
  const setFarmer = useFarmerStore((s) => s.setFarmer);

  const [role, setRole] = useState<'farmer' | 'investor' | 'buyer'>('farmer');

  // common
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // farmer/buyer fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('');
  const [subCounty, setSubCounty] = useState('');
  const [farmingType, setFarmingType] = useState('Maize');

  const handleSignup = () => {
    if (!email || !password) return Alert.alert('Error', 'Email and password required');

    const existing = findUser(email);
    if (existing) return Alert.alert('Error', 'User already exists');

    try {
      const profile: any = { email };
      if (role === 'farmer' || role === 'buyer') {
        profile.name = name;
        profile.phone = phone;
        profile.county = county;
        profile.subCounty = subCounty;
        profile.farmingType = farmingType;
      }
      if (role === 'investor') {
        profile.name = name || 'Investor';
      }

      addUser({ email, password, role, profile });

      // auto-login
      setUser({ email, role });
      if (role === 'farmer') {
        setFarmer({
          name: profile.name,
          phone: profile.phone,
          county: profile.county,
          language: 'en',
          farmingType: profile.farmingType,
          email,
        });
        navigation.navigate('FarmerHome');
      } else if (role === 'investor') {
        navigation.navigate('InvestorHome');
      } else {
        navigation.navigate('BuyerHome');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Unable to register');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#E8F5E9', padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', color: '#2E7D32', textAlign: 'center' }}>
        GreenVast 🌿
      </Text>
      <Text style={{ textAlign: 'center', color: '#666', marginBottom: 20 }}>Create Account</Text>

      <Text style={{ fontWeight: '600', color: '#2E7D32' }}>I am a</Text>
      <View style={{ backgroundColor: '#fff', borderRadius: 10, marginVertical: 10 }}>
        <Picker selectedValue={role} onValueChange={(val) => setRole(val)}>
          <Picker.Item label="Farmer" value="farmer" />
          <Picker.Item label="Investor" value="investor" />
          <Picker.Item label="Buyer" value="buyer" />
        </Picker>
      </View>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10 }} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10 }} />

      {(role === 'farmer' || role === 'buyer' || role === 'investor') && (
        <>
          <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={{ backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10 }} />
          <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10 }} />
          <TextInput placeholder="County" value={county} onChangeText={setCounty} style={{ backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10 }} />
          <TextInput placeholder="Sub-county" value={subCounty} onChangeText={setSubCounty} style={{ backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10 }} />
          <Text style={{ fontWeight: '600', color: '#2E7D32' }}>Type of Farming</Text>
          <View style={{ backgroundColor: '#fff', borderRadius: 10, marginVertical: 10 }}>
            <Picker selectedValue={farmingType} onValueChange={(val) => setFarmingType(val)}>
              <Picker.Item label="Maize" value="Maize" />
              <Picker.Item label="Tomatoes" value="Tomatoes" />
              <Picker.Item label="Dairy" value="Dairy" />
              <Picker.Item label="Avocado" value="Avocado" />
            </Picker>
          </View>
        </>
      )}

      <TouchableOpacity onPress={handleSignup} style={{ backgroundColor: '#2E7D32', marginTop: 10, padding: 14, borderRadius: 12 }}>
        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ textAlign: 'center', color: '#2E7D32', marginTop: 18 }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}