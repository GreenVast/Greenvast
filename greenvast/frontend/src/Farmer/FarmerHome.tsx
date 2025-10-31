import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFarmerStore } from '../store/useFarmerStore';

export default function FarmerHome() {
  const navigation = useNavigation<any>();
  const { farmer } = useFarmerStore();
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  const communities = ['Local Farmers', 'Crop Exchange', 'Dairy Group', 'Avocado Growers'];
  const communityLinks = {
    'Local Farmers': 'https://chat.whatsapp.com/EXAMPLE1',
    'Crop Exchange': 'https://chat.whatsapp.com/EXAMPLE2',
    'Dairy Group': 'https://chat.whatsapp.com/EXAMPLE3',
    'Avocado Growers': 'https://chat.whatsapp.com/EXAMPLE4',
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+254740682018');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* 🌿 HEADER */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>
              Hello, {farmer?.name || 'Farmer'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {farmer?.farmingType || '—'} • {farmer?.county || '—'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('FarmerProfile')}
            style={styles.profileButton}
          >
            <Ionicons name="person" size={26} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        {/* 🌦 MAIN CONTENT */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 18,
            paddingBottom: 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Weather Section */}
          <Text style={styles.sectionTitle}>Farming Insights</Text>

          <View style={styles.cardContainer}>
            {/* Weather Card */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => {
                try {
                  navigation.navigate('Weather');
                } catch {}
              }}
            >
              <Ionicons name="cloud-outline" size={36} color="#2E7D32" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardTitle}>Weather Forecast</Text>
                <Text style={styles.cardText}>Good to plant next 3 days</Text>
                <Text style={styles.cardSmall}>
                  Light showers expected, Avg temp 24°C
                </Text>
              </View>
            </Pressable>

            {/* Outbreak Card */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.alertCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => {
                try {
                  navigation.navigate('Outbreaks');
                } catch {}
              }}
            >
              <Ionicons
                name="alert-circle-outline"
                size={36}
                color="#C62828"
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.cardTitle, { color: '#C62828' }]}>
                  Outbreak Alerts
                </Text>
                <Text style={styles.cardText}>No current alerts</Text>
                <Text style={styles.cardSmall}>Last checked: Today</Text>
              </View>
            </Pressable>
          </View>

          {/* 🚜 Quick Actions */}
          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
            Quick Actions
          </Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Market')}
            >
              <Ionicons name="cart" size={34} color="#2E7D32" />
              <Text style={styles.actionLabel}>Market</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setJoinModalVisible(true)}
            >
              <Ionicons name="people" size={34} color="#2E7D32" />
              <Text style={styles.actionLabel}>Community</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 💬 Help Bar + Floating Button */}
        <View style={styles.bottomContainer}>
          {/* Help Bar */}
          <TouchableOpacity style={styles.helpBar}>
            <Ionicons name="help-circle-outline" size={20} color="#2E7D32" />
            <Text style={styles.helpText}>Need Help? Chat with Support</Text>
          </TouchableOpacity>

          {/* Floating call button */}
          <TouchableOpacity onPress={handleCallSupport} style={styles.fab}>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* 🌾 Join Community Modal */}
        <Modal visible={joinModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Join a Community</Text>

              {communities.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={styles.communityRow}
                  onPress={() => {
                    setJoinModalVisible(false);
                    Linking.openURL(communityLinks[c]);
                  }}
                >
                  <Text style={styles.communityText}>{c}</Text>
                  <Ionicons
                    name="add-circle-outline"
                    size={22}
                    color="#2E7D32"
                  />
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setJoinModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  screen: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },

  // HEADER
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 6,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#E8F5E9',
    fontSize: 14,
    marginTop: 4,
  },
  profileButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 50,
    elevation: 2,
  },

  // MAIN SECTIONS
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 20,
    marginBottom: 10,
  },
  cardContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  alertCard: {
    borderLeftColor: '#C62828',
    borderLeftWidth: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  cardText: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  cardSmall: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },

  // QUICK ACTIONS
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 22,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 3,
  },
  actionLabel: {
    marginTop: 8,
    color: '#2E7D32',
    fontWeight: '600',
  },

  // BOTTOM SECTION
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
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 5,
    marginBottom: 10,
  },
  helpText: {
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
  fab: {
    backgroundColor: '#2E7D32',
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
  },
  communityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  communityText: {
    fontSize: 16,
    color: '#333',
  },
  modalCancel: {
    marginTop: 14,
    alignSelf: 'center',
  },
  cancelText: {
    color: '#777',
    fontSize: 15,
  },
});
