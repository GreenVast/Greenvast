import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { listProducts } from '../store/mockProducts';
import { useAuthStore } from '../store/useAuthStore';

export default function Market() {
  const [items, setItems] = useState(() => listProducts());
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const [selected, setSelected] = useState<any>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) setItems(listProducts());
  }, [isFocused]);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Market</Text>
        <Ionicons name="leaf-outline" size={24} color="white" />
      </View>

      {/* Farmer Actions */}
      {user?.role === 'farmer' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setItems(listProducts())}
          >
            <Ionicons name="cart-outline" size={22} color="#2E7D32" />
            <Text style={styles.actionText}>My Market</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('UploadProduct')}
          >
            <Ionicons name="cloud-upload-outline" size={22} color="#2E7D32" />
            <Text style={styles.actionText}>Upload</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Prices')}
          >
            <Ionicons name="pricetags-outline" size={22} color="#2E7D32" />
            <Text style={styles.actionText}>Prices</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Empty state */}
      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>
            No products yet. Upload your produce to the market.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.productCard,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setSelected(item)}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={32} color="#fff" />
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>KES {item.price}</Text>
                <Text style={styles.sellerText}>
                  Seller: {item.sellerEmail || 'Unknown'}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}

      {/* Product Detail Modal */}
      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selected && (
              <>
                {selected.image && (
                  <Image
                    source={{ uri: selected.image }}
                    style={styles.modalImage}
                  />
                )}
                <Text style={styles.modalTitle}>{selected.name}</Text>
                <Text style={styles.modalPrice}>KES {selected.price}</Text>
                <Text style={styles.modalSeller}>
                  Seller: {selected.sellerEmail || 'Unknown'}
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setSelected(null)}
                  >
                    <Text style={{ color: '#2E7D32', fontWeight: '700' }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E8F5E9', paddingTop: 40 },
  header: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    width: 100,
    elevation: 3,
  },
  actionText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 12,
    marginTop: 4,
  },
  productCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#A5D6A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: { fontSize: 16, fontWeight: '700', color: '#2E7D32' },
  productPrice: { fontSize: 15, fontWeight: '600', marginTop: 4 },
  sellerText: { fontSize: 12, color: '#555', marginTop: 4 },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#777', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  modalPrice: { fontSize: 16, marginTop: 4 },
  modalSeller: { fontSize: 13, color: '#777', marginTop: 4 },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    width: '100%',
  },
  closeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
  },
});
