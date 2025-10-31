import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, ScrollView } from 'react-native';

const communityList = [
  {
    name: 'Local Farmers',
    whatsapp: 'https://chat.whatsapp.com/EXAMPLE1',
  },
  {
    name: 'Crop Exchange',
    whatsapp: 'https://chat.whatsapp.com/EXAMPLE2',
  },
  {
    name: 'Dairy Group',
    whatsapp: 'https://chat.whatsapp.com/EXAMPLE3',
  },
  {
    name: 'Avocado Growers',
    whatsapp: 'https://chat.whatsapp.com/EXAMPLE4',
  },
];

export default function Communities() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Communities</Text>
      <Text style={styles.subtitle}>Join a WhatsApp group to connect with other farmers:</Text>
      {communityList.map((c) => (
        <View key={c.name} style={styles.card}>
          <Text style={styles.communityName}>{c.name}</Text>
          <TouchableOpacity
            style={styles.joinBtn}
            onPress={() => Linking.openURL(c.whatsapp)}
          >
            <Text style={styles.joinText}>Join WhatsApp Group</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9', padding: 20 },
  title: { fontSize: 22, color: '#2E7D32', fontWeight: '700', marginBottom: 10 },
  subtitle: { color: '#555', marginBottom: 18 },
  card: { backgroundColor: 'white', borderRadius: 14, padding: 16, marginBottom: 16, elevation: 2 },
  communityName: { fontSize: 16, fontWeight: '700', color: '#2E7D32', marginBottom: 8 },
  joinBtn: { backgroundColor: '#25D366', padding: 10, borderRadius: 8, alignItems: 'center' },
  joinText: { color: 'white', fontWeight: '700' },
});
