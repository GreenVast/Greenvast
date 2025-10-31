import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BuyerProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buyer Profile</Text>
      <Text style={styles.subtitle}>This is a placeholder for the buyer's profile screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F5E9' },
  title: { fontSize: 24, fontWeight: '700', color: '#2E7D32', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#555' },
});
