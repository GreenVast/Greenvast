import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const mockForecast = [
  { day: 'Today', summary: 'Light showers', temp: 24, action: 'Good to plant' },
  { day: 'Tomorrow', summary: 'Sunny', temp: 26, action: 'Good to plant' },
  { day: 'Day after', summary: 'Cloudy', temp: 23, action: 'Hold off if wet' },
];

export default function Weather() {
  const overall = 'Good to plant next 3 days';
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Weather</Text>
      <Text style={styles.overall}>{overall} 🌤️</Text>
      {mockForecast.map((f) => (
        <View key={f.day} style={styles.row}>
          <Text style={styles.day}>{f.day}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.summary}>{f.summary} • {f.temp}°C</Text>
            <Text style={styles.action}>{f.action}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E8F5E9', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#2E7D32', marginBottom: 6 },
  overall: { color: '#555', marginBottom: 12 },
  row: { backgroundColor: 'white', padding: 12, borderRadius: 8, marginBottom: 8, elevation: 2 },
  day: { fontWeight: '700', color: '#2E7D32' },
  summary: { color: '#333' },
  action: { color: '#777', marginTop: 4 },
});

