import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  crop: string;
  weeklyPrice: number;
  unit: string;
  market: string;
  updatedAt: string;
  onVoiceInput?: () => void;
};

export default function PriceCard({
  crop,
  weeklyPrice,
  unit,
  market,
  updatedAt,
  onVoiceInput,
}: Props) {
  const englishLine = `${crop} — price of the week: KSh ${weeklyPrice}/${unit}`;
  const kiswahiliLine = `Bei ya wiki: KSh ${weeklyPrice}/${unit}`;

  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 2,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '700' }}>{englishLine}</Text>
      <Text style={{ fontSize: 16, marginTop: 6 }}>{kiswahiliLine}</Text>
      <Text style={{ fontSize: 14, color: '#555', marginTop: 4 }}>
        Soko: {market} • Updated: {new Date(updatedAt).toLocaleDateString()}
      </Text>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TouchableOpacity
          onPress={() => Speech.speak(`${englishLine}. ${kiswahiliLine}`)}
          style={{ marginRight: 24 }}
        >
          <Ionicons name="volume-high" size={28} />
        </TouchableOpacity>
        <TouchableOpacity onLongPress={onVoiceInput}>
          <Ionicons name="mic" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
