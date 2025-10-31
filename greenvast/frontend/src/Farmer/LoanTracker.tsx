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

export default function LoanTracker() {
  const navigation = useNavigation<any>();

  const [loans, setLoans] = useState([
    { id: '1', lender: 'Equity Bank', principal: 25000, paid: 7000 },
    { id: '2', lender: 'KCB Microfinance', principal: 18000, paid: 12000 },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newLoan, setNewLoan] = useState({ lender: '', principal: '', paid: '' });

  // Totals
  const totalLoan = loans.reduce((sum, l) => sum + l.principal, 0);
  const totalPaid = loans.reduce((sum, l) => sum + l.paid, 0);
  const totalBalance = totalLoan - totalPaid;

  const addLoan = () => {
    if (!newLoan.lender || !newLoan.principal) {
      Alert.alert('Missing fields', 'Please enter lender and amount');
      return;
    }
    const loan = {
      id: Math.random().toString(),
      lender: newLoan.lender,
      principal: parseFloat(newLoan.principal),
      paid: parseFloat(newLoan.paid || '0'),
    };
    setLoans([...loans, loan]);
    setNewLoan({ lender: '', principal: '', paid: '' });
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
          <Text style={styles.headerTitle}>Loan Tracker</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Summary Section */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Total Loan</Text>
            <Text style={styles.value}>KSh {totalLoan.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Paid</Text>
            <Text style={styles.value}>KSh {totalPaid.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Balance</Text>
            <Text style={[styles.value, { color: '#C62828' }]}>
              KSh {totalBalance.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Loan List */}
        <FlatList
          data={loans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={styles.loanCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.lender}>{item.lender}</Text>
                <Text style={styles.detail}>
                  Principal: KSh {item.principal.toLocaleString()}
                </Text>
                <Text style={styles.detail}>Paid: KSh {item.paid.toLocaleString()}</Text>
                <Text style={styles.detail}>
                  Balance: KSh {(item.principal - item.paid).toLocaleString()}
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

        {/* Add Loan Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add New Loan</Text>

              <TextInput
                style={styles.input}
                placeholder="Lender name"
                value={newLoan.lender}
                onChangeText={(t) => setNewLoan({ ...newLoan, lender: t })}
              />

              <TextInput
                style={styles.input}
                placeholder="Principal amount (KSh)"
                keyboardType="numeric"
                value={newLoan.principal}
                onChangeText={(t) => setNewLoan({ ...newLoan, principal: t })}
              />

              <TextInput
                style={styles.input}
                placeholder="Amount paid (KSh)"
                keyboardType="numeric"
                value={newLoan.paid}
                onChangeText={(t) => setNewLoan({ ...newLoan, paid: t })}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#2E7D32' }]}
                  onPress={addLoan}
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
  loanCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  lender: {
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
