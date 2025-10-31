import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { addProduct } from '../store/mockProducts';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigation } from '@react-navigation/native';

export default function UploadProduct() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const submit = () => {
    if (!name || !price) return Alert.alert('Error', 'Name and price required');
    const item = addProduct({ name, price: Number(price), image: image || undefined, sellerEmail: user?.email });
  Alert.alert('Uploaded', `${item.name} saved`);
  try { navigation.goBack(); } catch { navigation.navigate('Market'); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#E8F5E9', padding: 20, marginTop: 32 }}>
      <Text style={{ fontSize: 20, color: '#2E7D32', fontWeight: '700', marginTop: 16 }}>Upload Product</Text>
      <TextInput placeholder="Product name" value={name} onChangeText={setName} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 12 }} />
      <TextInput placeholder="Price (KES)" value={price} onChangeText={setPrice} keyboardType="numeric" style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 12 }} />
      <TextInput placeholder="Image URL (optional)" value={image} onChangeText={setImage} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 12 }} />

      <TouchableOpacity onPress={submit} style={{ marginTop: 16, backgroundColor: '#2E7D32', padding: 12, borderRadius: 8, alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
}
