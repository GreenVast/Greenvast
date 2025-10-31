import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';

interface Community {
  id: string;
  name: string;
  county: string;
  lastMessage: string;
  lastSender: string;
  time: string;
  unread: number;
}

const joinedCommunities: Community[] = [
  {
    id: '1',
    name: 'Maize • Kericho',
    county: 'Kericho',
    lastMessage: 'Remember to dry maize properly before storage.',
    lastSender: 'Joseph',
    time: '09:15',
    unread: 2,
  },
  {
    id: '2',
    name: 'Tomato • Kirinyaga',
    county: 'Kirinyaga',
    lastMessage: 'Uploading a short video on staking technique.',
    lastSender: 'Grace',
    time: '07:40',
    unread: 0,
  },
  {
    id: '3',
    name: 'Dairy • Nyamira',
    county: 'Nyamira',
    lastMessage: 'Audio update: Vet visit tomorrow 11am.',
    lastSender: 'Community Manager',
    time: 'Yesterday',
    unread: 4,
  },
];

export default function Communities() {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const filteredCommunities = useMemo(() => {
    if (!query) return joinedCommunities;
    const lowered = query.toLowerCase();
    return joinedCommunities.filter(
      (community) =>
        community.name.toLowerCase().includes(lowered) ||
        community.county.toLowerCase().includes(lowered),
    );
  }, [query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('communities.joined')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchRow}>
          <Ionicons name='search-outline' size={18} color='#555' />
          <TextInput
            style={styles.searchInput}
            placeholder={t('communities.search')}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <FlatList
          data={filteredCommunities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.communityCard}
              onPress={() => navigation.navigate('CommunityChat', { community: item })}
            >
              <View style={styles.avatar}>
                <Ionicons name='people-outline' size={24} color='#2E7D32' />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.communityName}>{item.name}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.preview}>
                  <Text style={styles.sender}>{item.lastSender}: </Text>
                  {item.lastMessage}
                </Text>
              </View>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyState}>
              {t('communities.newMessage')}
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E8F5E9' },
  screen: { flex: 1 },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  searchRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 2,
    alignItems: 'center',
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
  communityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  communityName: { fontSize: 16, fontWeight: '700', color: '#1B5E20', flex: 1, paddingRight: 8 },
  time: { fontSize: 12, color: '#777' },
  preview: { fontSize: 13, color: '#555', marginTop: 6 },
  sender: { fontWeight: '600', color: '#2E7D32' },
  unreadBadge: {
    backgroundColor: '#2E7D32',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 10,
  },
  unreadText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  emptyState: {
    textAlign: 'center',
    color: '#555',
    marginTop: 40,
    fontSize: 14,
  },
});
