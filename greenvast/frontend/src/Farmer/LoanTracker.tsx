import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFarmerStore } from '../store/useFarmerStore';

const formatCurrency = (value: number) =>
  `KES ${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

export default function LoanTracker() {
  const navigation = useNavigation<any>();
  const loans = useFarmerStore((state) => state.loans);
  const addLoan = useFarmerStore((state) => state.addLoan);
  const repayLoan = useFarmerStore((state) => state.repayLoan);

  const [newAmount, setNewAmount] = useState('');
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [repayAmount, setRepayAmount] = useState('');

  const { totalBorrowed, totalRepaid, outstanding } = useMemo(() => {
    const borrowed = loans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
    const repaid = loans.reduce((sum, loan) => sum + (loan.repaid || 0), 0);
    return {
      totalBorrowed: borrowed,
      totalRepaid: repaid,
      outstanding: Math.max(borrowed - repaid, 0),
    };
  }, [loans]);

  const handleAddLoan = () => {
    const amount = parseFloat(newAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      Alert.alert('Check amount', 'Enter a positive number.');
      return;
    }
    addLoan(amount);
    setNewAmount('');
    Alert.alert('Loan added', 'Remember to keep your records updated.');
  };

  const handleOpenRepay = (loanId: string) => {
    setSelectedLoan(loanId);
    setRepayAmount('');
    setShowRepayModal(true);
  };

  const handleRepay = () => {
    const amount = parseFloat(repayAmount);
    if (!selectedLoan) return;
    if (Number.isNaN(amount) || amount <= 0) {
      Alert.alert('Check amount', 'Enter a positive number.');
      return;
    }
    repayLoan(selectedLoan, amount);
    setShowRepayModal(false);
    setSelectedLoan(null);
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

        <FlatList
          data={loans}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              {/* Summary */}
              <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>Total</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(totalBorrowed)}
                  </Text>
                </View>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>Repaid</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(totalRepaid)}
                  </Text>
                </View>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>Balance</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(outstanding)}
                  </Text>
                </View>
              </View>

              {/* Add loan */}
              <View style={styles.addCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.addTitle}>Record new loan</Text>
                  <Text style={styles.addSubtitle}>
                    Keep your loan details up to date for clear balances.
                  </Text>
                  <TextInput
                    placeholder="Amount (KES)"
                    keyboardType="numeric"
                    value={newAmount}
                    onChangeText={setNewAmount}
                    style={styles.input}
                  />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAddLoan}>
                  <Ionicons name="add-circle" size={36} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Loans</Text>
              {loans.length === 0 && (
                <Text style={styles.emptyState}>
                  No loans recorded yet. Add your first loan to get started.
                </Text>
              )}
            </>
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          renderItem={({ item }) => {
            const balance = Math.max(item.amount - item.repaid, 0);
            return (
              <View style={styles.loanCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={styles.loanAmount}>{formatCurrency(item.amount)}</Text>
                    <Text style={styles.loanMeta}>
                      Taken on {new Date(item.createdAt).toLocaleDateString('en-KE')}
                    </Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {balance === 0 ? 'Cleared' : 'Active'}
                    </Text>
                  </View>
                </View>

                <View style={styles.loanProgress}>
                  <View style={[styles.progressBar, { width: `${(item.repaid / item.amount) * 100 || 0}%` }]} />
                </View>
                <View style={styles.loanStats}>
                  <Text style={styles.statText}>
                    Repaid: {formatCurrency(item.repaid)}
                  </Text>
                  <Text style={styles.statText}>
                    Balance: {formatCurrency(balance)}
                  </Text>
                </View>

                {balance > 0 && (
                  <TouchableOpacity
                    style={styles.repayButton}
                    onPress={() => handleOpenRepay(item.id)}
                  >
                    <Ionicons name="cash-outline" size={18} color="#fff" />
                    <Text style={styles.repayButtonText}>Record repayment</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />

        <Modal
          visible={showRepayModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowRepayModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Record repayment</Text>
              <TextInput
                placeholder="Amount (KES)"
                keyboardType="numeric"
                value={repayAmount}
                onChangeText={setRepayAmount}
                style={styles.input}
              />
              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalButton, styles.modalCancel]}
                  onPress={() => setShowRepayModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalConfirm]}
                  onPress={handleRepay}
                >
                  <Text style={styles.modalConfirmText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  summaryLabel: { fontSize: 13, color: '#666' },
  summaryValue: { fontSize: 18, color: '#2E7D32', fontWeight: '700', marginTop: 4 },
  addCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    marginBottom: 24,
  },
  addTitle: { fontSize: 16, fontWeight: '700', color: '#2E7D32' },
  addSubtitle: { fontSize: 13, color: '#555', marginVertical: 6 },
  input: {
    backgroundColor: '#F1F8E9',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    fontSize: 14,
    marginTop: 8,
  },
  addButton: {
    marginLeft: 12,
    backgroundColor: '#2E7D32',
    padding: 10,
    borderRadius: 999,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
  },
  emptyState: {
    fontSize: 14,
    color: '#555',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  loanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  loanAmount: { fontSize: 18, fontWeight: '700', color: '#1B5E20' },
  loanMeta: { fontSize: 12, color: '#777', marginTop: 4 },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 12, color: '#1B5E20', fontWeight: '600' },
  loanProgress: {
    backgroundColor: '#E0E0E0',
    height: 6,
    borderRadius: 3,
    marginTop: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  loanStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statText: { fontSize: 13, color: '#555' },
  repayButton: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    borderRadius: 999,
  },
  repayButtonText: { color: '#FFFFFF', fontWeight: '600', marginLeft: 6 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 16,
    padding: 20,
    elevation: 6,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#2E7D32' },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  modalCancel: {
    marginRight: 10,
    backgroundColor: '#E0E0E0',
  },
  modalConfirm: {
    backgroundColor: '#2E7D32',
  },
  modalCancelText: { color: '#555', fontWeight: '600' },
  modalConfirmText: { color: '#FFFFFF', fontWeight: '600' },
});
