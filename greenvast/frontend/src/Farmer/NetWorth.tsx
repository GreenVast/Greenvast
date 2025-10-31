import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function NetWorth() {
  const navigation = useNavigation<any>();

  const [assets, setAssets] = useState([
    { id: '1', name: 'Land (5 acres)', value: 500000 },
    { id: '2', name: 'Crops (maize, beans)', value: 120000 },
    { id: '3', name: 'Livestock (cows, goats)', value: 180000 },
  ]);

  const [loans] = useState(120000); // Example from LoanTracker (you can link later)
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const netWorth = totalAssets - loans;

  const [modalVisible, setModalVisible] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', value: '' });

  const addAsset = () => {
    if (!newAsset.name || !newAsset.value) {
      Alert.alert('Missing fields', 'Please fill all fields');
      return;
    }

    const asset = {
      id: Math.random().toString(),
      name: newAsset.name,
      value: parseFloat(newAsset.value),
    };

    setAssets([...assets, asset]);
    setNewAsset({ name: '', value: '' });
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Net Worth</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Summary Section */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Farm Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>Total Assets</Text>
            <Text style={styles.value}>KSh {totalAssets.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Loans</Text>
            <Text style={[styles.value, { color: '#C62828' }]}>
              KSh {loans.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Net Worth</Text>
            <Text
              style={[
                styles.value,
                { color: netWorth >= 0 ? '#2E7D32' : '#C62828' },
              ]}
            >
              KSh {netWorth.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Asset List */}
        <FlatList
          data={assets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={styles.assetCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.assetName}>{item.name}</Text>
                <Text style={styles.detail}>
                  Value: KSh {item.value.toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        />

        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>

        {/* Add Asset Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add New Asset</Text>

              <TextInput
                style={styles.input}
                placeholder="Asset name (e.g., Land, Crops)"
                value={newAsset.name}
                onChangeText={(t) => setNewAsset({ ...newAsset, name: t })}
              />

              <TextInput
                style={styles.input}
                placeholder="Asset value (KSh)"
                keyboardType="numeric"
                value={newAsset.value}
                onChangeText={(t) => setNewAsset({ ...newAsset, value: t })}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#2E7D32' }]}
                  onPress={addAsset}
                >
                  <Text style={styles.modalBtnText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#BDBDBD' }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
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
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 14,
    padding: 16,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontSize: 15,
    color: '#444',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
  },
  assetCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#2E7D32',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});
