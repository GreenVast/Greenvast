import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';

type MessageType = 'text' | 'image' | 'video' | 'audio';

interface Message {
  id: string;
  author: string;
  time: string;
  content: string;
  type: MessageType;
  isMine?: boolean;
}

const sampleMessages: Message[] = [
  {
    id: '1',
    author: 'Grace',
    time: '08:40',
    content: 'Good morning! Field visit at 11am.',
    type: 'text',
  },
  {
    id: '2',
    author: 'You',
    time: '08:44',
    content: 'Confirmed. Will share photos afterwards.',
    type: 'text',
    isMine: true,
  },
  {
    id: '3',
    author: 'Community Manager',
    time: '09:10',
    content: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=320&q=80',
    type: 'image',
  },
  {
    id: '4',
    author: 'Joseph',
    time: '09:20',
    content: 'Audio note: Tips on post-harvest storage',
    type: 'audio',
  },
  {
    id: '5',
    author: 'Grace',
    time: '09:45',
    content: 'Video: Sorting tomatoes to avoid bruises',
    type: 'video',
  },
];

type ScreenRoute = RouteProp<{ params: { community: { name: string } } }, 'params'>;

export default function CommunityChat() {
  const navigation = useNavigation<any>();
  const route = useRoute<ScreenRoute>();
  const { community } = route.params ?? { community: { name: 'Community' } };
  const { t } = useLanguage();

  const messages = useMemo(() => sampleMessages, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>{community.name}</Text>
            <Text style={styles.headerSubtitle}>Online • 48 members</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="call-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          style={{ flex: 1 }}
          renderItem={({ item }) => {
            const isMine = item.isMine;
            return (
              <View
                style={[
                  styles.messageContainer,
                  isMine ? styles.myMessage : styles.theirMessage,
                ]}
              >
                {!isMine && (
                  <Text style={styles.messageAuthor}>{item.author}</Text>
                )}
                {item.type === 'text' && (
                  <Text style={[styles.messageText, isMine && { color: '#FFFFFF' }]}>
                    {item.content}
                  </Text>
                )}
                {item.type === 'image' && (
                  <Image source={{ uri: item.content }} style={styles.messageImage} />
                )}
                {item.type === 'audio' && (
                  <View style={styles.attachmentRow}>
                    <Ionicons name="musical-notes-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.attachmentText}>{item.content}</Text>
                  </View>
                )}
                {item.type === 'video' && (
                  <View style={styles.attachmentRow}>
                    <Ionicons name="videocam-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.attachmentText}>{item.content}</Text>
                  </View>
                )}
                <Text style={[styles.messageTime, isMine && { color: '#E0F2F1' }]}>
                  {item.time}
                </Text>
              </View>
            );
          }}
        />

        <View style={styles.composer}>
          <View style={styles.attachmentButtons}>
            <TouchableOpacity style={styles.attachmentIcon}>
              <Ionicons name="camera-outline" size={20} color="#2E7D32" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachmentIcon}>
              <Ionicons name="image-outline" size={20} color="#2E7D32" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachmentIcon}>
              <Ionicons name="mic-outline" size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder={t('chat.placeholder')}
            style={styles.messageInput}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendText}>{t('chat.send')}</Text>
          </TouchableOpacity>
        </View>
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
  },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  headerSubtitle: { color: '#C8E6C9', fontSize: 12, marginTop: 2 },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 14,
    padding: 12,
    marginVertical: 6,
  },
  myMessage: {
    backgroundColor: '#2E7D32',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    elevation: 1,
  },
  messageAuthor: { fontSize: 11, color: '#2E7D32', marginBottom: 4 },
  messageText: { fontSize: 14, color: '#2E7D32' },
  messageTime: { fontSize: 10, color: '#777', marginTop: 6, textAlign: 'right' },
  messageImage: { width: 220, height: 140, borderRadius: 12, marginTop: 6 },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attachmentText: { color: '#FFFFFF', fontSize: 13 },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  attachmentButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  attachmentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageInput: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#F1F8E9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  sendText: { color: '#FFFFFF', fontWeight: '600' },
});
