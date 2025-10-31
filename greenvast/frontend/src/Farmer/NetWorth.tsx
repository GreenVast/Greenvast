import React, { useMemo } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFarmerStore } from '../store/useFarmerStore';

const formatCurrency = (value: number) =>
  `KES ${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

const assetPresets = [
  {
    id: 'land',
    title: 'Land & property',
    desc: 'Estimated value of your farm plots',
    value: 280000,
    icon: 'home-outline',
  },
  {
    id: 'stock',
    title: 'Harvest & stock',
    desc: 'Produce, livestock, inputs on hand',
    value: 95000,
    icon: 'leaf-outline',
  },
  {
    id: 'equipment',
    title: 'Tools & equipment',
    desc: 'Machinery, tools, irrigation assets',
    value: 42000,
    icon: 'hammer-outline',
  },
];

export default function NetWorth() {
  const navigation = useNavigation<any>();
  const loans = useFarmerStore((state) => state.loans);

  const outstanding = useMemo(() => {
    return loans.reduce((sum, loan) => sum + Math.max((loan.amount || 0) - (loan.repaid || 0), 0), 0);
  }, [loans]);

  const totalAssets = assetPresets.reduce((sum, asset) => sum + asset.value, 0);
  const netWorth = Math.max(totalAssets - outstanding, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Farm Value</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.body}>
          <View style={styles.netWorthCard}>
            <Text style={styles.netWorthLabel}>Estimated net worth</Text>
            <Text style={styles.netWorthValue}>{formatCurrency(netWorth)}</Text>
            <Text style={styles.netWorthSubtitle}>
              Assets minus outstanding loans based on your latest records.
            </Text>
          </View>

          <View style={styles.balanceCard}>
            <View style={styles.balanceCell}>
              <Text style={styles.balanceLabel}>Assets</Text>
              <Text style={styles.balanceValue}>{formatCurrency(totalAssets)}</Text>
            </View>
            <View style={[styles.balanceCell, styles.balanceDivider]}>
              <Text style={[styles.balanceLabel, { color: '#C62828' }]}>Outstanding loans</Text>
              <Text style={[styles.balanceValue, { color: '#C62828' }]}>
                {formatCurrency(outstanding)}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Asset breakdown</Text>
          <FlatList
            data={assetPresets}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={styles.assetCard}>
                <View style={styles.assetIcon}>
                  <Ionicons name={item.icon as any} size={24} color="#2E7D32" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.assetTitle}>{item.title}</Text>
                  <Text style={styles.assetDesc}>{item.desc}</Text>
                </View>
                <Text style={styles.assetValue}>{formatCurrency(item.value)}</Text>
              </View>
            )}
          />
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
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  body: { flex: 1, padding: 18 },
  netWorthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    marginBottom: 16,
  },
  netWorthLabel: { fontSize: 14, color: '#777' },
  netWorthValue: { fontSize: 28, fontWeight: '700', color: '#1B5E20', marginTop: 6 },
  netWorthSubtitle: { fontSize: 13, color: '#555', marginTop: 8 },
  balanceCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  balanceCell: {
    flex: 1,
    alignItems: 'center',
  },
  balanceDivider: {
    borderLeftWidth: 1,
    borderColor: '#E0E0E0',
  },
  balanceLabel: { fontSize: 13, color: '#2E7D32', fontWeight: '600' },
  balanceValue: { fontSize: 18, fontWeight: '700', color: '#2E7D32', marginTop: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2E7D32', marginBottom: 12 },
  assetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
  },
  assetIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  assetTitle: { fontSize: 15, fontWeight: '700', color: '#1B5E20' },
  assetDesc: { fontSize: 12, color: '#777', marginTop: 4 },
  assetValue: { fontSize: 15, fontWeight: '600', color: '#1B5E20' },
});
