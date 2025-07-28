import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TransactionCard = ({ item, onPress }: any) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.amount}>₹{item?.amount ?? '0'}</Text>
      <Text style={styles.receiver}>{item?.receiver ?? 'Unknown'}</Text>
      <Text style={styles.status}>{item?.status?.toUpperCase() ?? 'N/A'}</Text>
    </TouchableOpacity>
  );
};

export default TransactionCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  amount: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  receiver: { fontSize: 14, color: '#555' },
  status: { fontSize: 14, fontWeight: '600', marginTop: 4 },
});
