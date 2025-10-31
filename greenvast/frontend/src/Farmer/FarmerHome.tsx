import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFarmerStore } from '../store/useFarmerStore';
import { useLanguage } from '../context/LanguageContext';

const suggestedCommunities = [
  'Local Farmers',
  'Crop Exchange',
  'Dairy Group',
  'Avocado Growers',
];

export default function FarmerHome() {
  const navigation = useNavigation<any>();
  const { farmer } = useFarmerStore();
  const { t, language, toggleLanguage } = useLanguage();

  const [joinModalVisible, setJoinModalVisible] = useState(false);

  const handleCallSupport = () => {
    Linking.openURL('tel:+254740682018');
  };

  const handleJoinCommunity = (name: string) => {
    Alert.alert('Joined', `${name} community added to your list.`);
    setJoinModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>
              {t('farmer.greeting', { name: farmer?.name || 'Farmer' })}
            </Text>
            <Text style={styles.headerSubtitle}>
              {t('farmer.location', {
                type: farmer?.farmingType || '—',
                county: farmer?.county || '—',
              })}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
              <Text style={styles.languageToggleText}>
                {language === 'en' ? 'SW' : 'EN'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('FarmerProfile')}
              style={styles.profileButton}
            >
              <Ionicons name="person" size={26} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 18,
            paddingBottom: 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>{t('farmer.farmingInsights')}</Text>

          <View style={styles.cardContainer}>
            <Pressable
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => navigation.navigate('Weather')}
            >
              <Ionicons name="cloud-outline" size={36} color="#2E7D32" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardTitle}>{t('farmer.weatherTitle')}</Text>
                <Text style={styles.cardText}>{t('farmer.weatherSubtitle')}</Text>
                <Text style={styles.cardSmall}>{t('farmer.weatherDetail')}</Text>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.alertCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => navigation.navigate('Outbreaks')}
            >
              <Ionicons name="alert-circle-outline" size={36} color="#C62828" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.cardTitle, { color: '#C62828' }]}>
                  {t('farmer.outbreakTitle')}
                </Text>
                <Text style={styles.cardText}>{t('farmer.outbreakSubtitle')}</Text>
                <Text style={styles.cardSmall}>{t('farmer.outbreakDetail')}</Text>
              </View>
            </Pressable>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
            {t('farmer.quickActions')}
          </Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Market')}
            >
              <Ionicons name="cart" size={34} color="#2E7D32" />
              <Text style={styles.actionLabel}>{t('farmer.market')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('LoanTracker')}
            >
              <Ionicons name="cash" size={34} color="#2E7D32" />
              <Text style={styles.actionLabel}>{t('farmer.loanTracker')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('NetWorth')}
            >
              <Ionicons name="bar-chart" size={34} color="#2E7D32" />
              <Text style={styles.actionLabel}>{t('farmer.netWorth')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Prices')}
            >
              <Ionicons name="pricetags" size={34} color="#2E7D32" />
              <Text style={styles.actionLabel}>{t('farmer.market')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('UploadProduct')}
            >
              <Ionicons name="cloud-upload" size={34} color="#2E7D32" />
              <Text style={styles.actionLabel}>Upload</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Communities')}
            >
              <Ionicons name="chatbubbles" size={34} color="#2E7D32" />
              <Text style={styles.actionLabel}>{t('farmer.communities')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.communityBanner}
            onPress={() => setJoinModalVisible(true)}
          >
            <Ionicons name="people" size={30} color="#FFFFFF" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.communityTitle}>{t('farmer.communities')}</Text>
              <Text style={styles.communitySubtitle}>
                Join conversations nearby and share updates instantly.
              </Text>
            </View>
            <Ionicons name="add" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.helpBar} onPress={handleCallSupport}>
            <Ionicons name="call" size={20} color="#2E7D32" />
            <Text style={styles.helpText}>Call support</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={joinModalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setJoinModalVisible(false)}>
          <Pressable style={styles.modalCard}>
            <Text style={styles.modalTitle}>Suggested communities</Text>
            {suggestedCommunities.map((name) => (
              <View key={name} style={styles.communityRow}>
                <Text style={styles.communityText}>{name}</Text>
                <TouchableOpacity onPress={() => handleJoinCommunity(name)}>
                  <Ionicons name="add-circle-outline" size={24} color="#2E7D32" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.modalCancel} onPress={() => setJoinModalVisible(false)}>
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E8F5E9' },
  screen: { flex: 1 },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  headerSubtitle: { color: '#C8E6C9', fontSize: 14, marginTop: 4 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  languageToggle: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    elevation: 2,
  },
  languageToggleText: { color: '#2E7D32', fontWeight: '700', fontSize: 12 },
  profileButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 999,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 24,
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    gap: 14,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.92,
  },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#C62828',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1B5E20' },
  cardText: { fontSize: 14, marginTop: 4, color: '#333333' },
  cardSmall: { fontSize: 12, marginTop: 2, color: '#777' },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
  },
  actionLabel: { marginTop: 10, color: '#2E7D32', fontWeight: '600' },
  communityBanner: {
    marginTop: 28,
    backgroundColor: '#2E7D32',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  communityTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  communitySubtitle: { color: '#E8F5E9', fontSize: 13 },
  bottomContainer: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  helpBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    elevation: 5,
    gap: 8,
  },
  helpText: { color: '#2E7D32', fontWeight: '600', fontSize: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    width: '100%',
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#2E7D32', marginBottom: 12 },
  communityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  communityText: { fontSize: 16, color: '#333333' },
  modalCancel: { marginTop: 16, alignSelf: 'center' },
  cancelText: { color: '#777777', fontSize: 15 },
});
