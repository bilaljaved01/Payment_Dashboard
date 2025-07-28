import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import api from '../services/api';

export default function TransactionDetailsScreen({ route }: any) {
  const { id } = route.params;
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTransaction = async () => {
    try {
      const res = await api.get(`/payments/${id}`);
      setTransaction(res.data);
    } catch (err) {
      console.error('Failed to fetch transaction details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  if (!transaction)
    return (
      <Text style={{ textAlign: 'center', marginTop: 100 }}>
        Transaction not found.
      </Text>
    );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transaction Details</Text>

      <View style={styles.card}>
        <Detail
          label="Amount"
          value={`₹${transaction.amount ?? '0'}`}
        />
        <Detail
          label="Receiver"
          value={transaction.receiver ?? 'N/A'}
        />
        <Detail
          label="Status"
          value={transaction.status ?? 'N/A'}
        />
        <Detail
          label="Method"
          value={transaction.method ?? 'N/A'}
        />
        <Detail
          label="Date"
          value={
            transaction.createdAt
              ? new Date(transaction.createdAt).toLocaleString()
              : 'Unknown'
          }
        />
        {transaction.notes && (
          <Detail label="Notes" value={transaction.notes} />
        )}
      </View>
    </ScrollView>
  );
}

const Detail = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f6fa',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
