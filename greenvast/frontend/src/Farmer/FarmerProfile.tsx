import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Switch,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFarmerStore } from '../store/useFarmerStore';
import { useTranslation } from 'react-i18next';

export default function FarmerProfile() {
  const navigation = useNavigation<any>();
  const { farmer, setFarmer, logout, loans, totalBorrowed, totalRepaid, repayLoan } = useFarmerStore();
  const [repayAmount, setRepayAmount] = useState('');
  const { t, i18n } = useTranslation();

  // Local editable state
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: farmer?.name || '',
    phone: farmer?.phone || '',
    county: farmer?.county || '',
    language: farmer?.language || 'en',
    farmingType: farmer?.farmingType || '',
    email: farmer?.email || '',
  });

  const [openForInvestment, setOpenForInvestment] = useState(false);

  const handleSave = () => {
    setFarmer({
      name: form.name,
      phone: form.phone,
      county: form.county,
      language: form.language,
      farmingType: form.farmingType,
      email: form.email,
    });
    i18n.changeLanguage(form.language);
    setEditing(false);
    Alert.alert('Saved', 'Profile updated');
  };

  const handleLogout = () => {
    Alert.alert(t('logout') || 'Logout', 'Are you sure you want to logout?', [
      { text: t('cancel') || 'Cancel' },
      {
        text: t('logout') || 'Logout',
        onPress: () => {
          logout();
          // try to navigate to a login screen if present
          try {
            navigation.navigate('Login');
          } catch (e) {
            // ignore if route not found
          }
        },
      },
    ]);
  };

  const callSupport = () => {
    const phone = 'tel:+254740682018';
    Linking.openURL(phone).catch(() => {
      Alert.alert('Error', 'Unable to open dialer');
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle" size={110} color="#2E7D32" />
        <Text style={styles.welcome}>{`Welcome, ${farmer?.name || 'Farmer'}`}</Text>
        <Text style={styles.sub}>{`${farmer?.farmingType || ''} • ${farmer?.county || ''}`}</Text>
      </View>

      {/* Summary Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('profile') || 'Summary'}</Text>
        <Text style={styles.row}>Name: {farmer?.name || form.name}</Text>
        <Text style={styles.row}>Phone: {farmer?.phone || form.phone}</Text>
        <Text style={styles.row}>County: {farmer?.county || form.county}</Text>
        <Text style={styles.row}>Language: {farmer?.language || form.language}</Text>
        <Text style={styles.row}>Type: {farmer?.farmingType || form.farmingType}</Text>
        <Text style={styles.row}>Email: {farmer?.email || form.email}</Text>
      </View>

      {/* Loan & Investment */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('loan.total') || 'Loan'}</Text>
        <Text style={styles.row}>Total borrowed: KES {totalBorrowed()}</Text>
        <Text style={styles.row}>Total repaid: KES {totalRepaid()}</Text>
        <Text style={styles.row}>Remaining: KES {totalBorrowed() - totalRepaid()}</Text>
        <View style={{ marginTop: 8 }}>
          <TextInput placeholder="Repay amount" keyboardType="numeric" value={repayAmount} onChangeText={setRepayAmount} style={styles.input} />
          <TouchableOpacity style={[styles.saveBtn, { marginTop: 8 }]} onPress={() => {
            const amt = parseFloat(repayAmount) || 0;
            if (amt <= 0) { Alert.alert('Invalid', 'Enter an amount'); return; }
            // repay the oldest loan
            if (loans && loans.length > 0) {
              repayLoan(loans[0].id, amt);
              setRepayAmount('');
              Alert.alert('Success', 'Payment recorded');
            } else {
              Alert.alert('No loans', 'You have no active loans');
            }
          }}>
            <Text style={{ color: 'white' }}>Repay</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.investRow}>
          <Text style={styles.row}>Open for Investment</Text>
          <Switch value={openForInvestment} onValueChange={setOpenForInvestment} />
        </View>
      </View>

      {/* Editable form (inline) */}
      {editing ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Edit Profile</Text>
          <TextInput style={styles.input} value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="Full name" />
          <TextInput style={styles.input} value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} placeholder="Phone" keyboardType="phone-pad" />
          <TextInput style={styles.input} value={form.county} onChangeText={(v) => setForm({ ...form, county: v })} placeholder="County" />
          <TextInput style={styles.input} value={form.language} onChangeText={(v) => setForm({ ...form, language: v })} placeholder="Language (en/sw)" />
          <TextInput style={styles.input} value={form.farmingType} onChangeText={(v) => setForm({ ...form, farmingType: v })} placeholder="Farming Type" />
          <TextInput style={styles.input} value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} placeholder="Email" keyboardType="email-address" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={{ color: 'white' }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ padding: 20 }}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setEditing(true)}>
            <Ionicons name="create" size={20} color="#2E7D32" />
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Loan', 'No active loans')}>
            <Ionicons name="card" size={20} color="#2E7D32" />
            <Text style={styles.actionText}>Pending Loan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('History', 'No history available')}>
            <Ionicons name="time" size={20} color="#2E7D32" />
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={callSupport}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#2E7D32" />
            <Text style={styles.actionText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={{ color: 'white', fontWeight: '600' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9' },
  header: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  welcome: { fontSize: 20, fontWeight: '700', color: '#2E7D32', marginTop: 8 },
  sub: { color: '#555', marginTop: 6 },
  card: { backgroundColor: 'white', margin: 16, borderRadius: 12, padding: 16, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#2E7D32', marginBottom: 8 },
  row: { fontSize: 14, color: '#333', marginBottom: 6 },
  investRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  input: { backgroundColor: '#f6f6f6', padding: 12, borderRadius: 8, marginTop: 8 },
  saveBtn: { backgroundColor: '#2E7D32', padding: 12, borderRadius: 8, alignItems: 'center', width: 120 },
  cancelBtn: { backgroundColor: '#fff', padding: 12, borderRadius: 8, alignItems: 'center', width: 120, borderWidth: 1, borderColor: '#ddd' },
  actionBtn: { backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 12, borderRadius: 10, elevation: 2 },
  actionText: { marginLeft: 12, fontSize: 16, color: '#2E7D32' },
  logoutBtn: { backgroundColor: '#C62828', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
});
