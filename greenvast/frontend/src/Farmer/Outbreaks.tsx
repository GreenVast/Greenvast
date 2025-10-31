import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const alerts = [
  { id: 'a1', title: 'Maize Rust', region: 'Kericho', risk: 'Medium' },
  { id: 'a2', title: 'Fall Armyworm', region: 'Nakuru', risk: 'High' },
];

export default function Outbreaks() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Outbreak Alerts</Text>
      {alerts.length === 0 ? (
        <Text style={styles.none}>No alerts</Text>
      ) : (
        alerts.map((a) => (
          <View key={a.id} style={styles.row}>
            <Text style={styles.rowTitle}>{a.title}</Text>
            <Text style={styles.rowSub}>{a.region} • {a.risk}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E8F5E9', padding: 16 },
  title: { fontSize: 20, color: '#2E7D32', fontWeight: '700', marginBottom: 12 },
  none: { color: '#777' },
  row: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 8, elevation: 2 },
  rowTitle: { fontWeight: '700' },
  rowSub: { color: '#777', marginTop: 6 },
});

