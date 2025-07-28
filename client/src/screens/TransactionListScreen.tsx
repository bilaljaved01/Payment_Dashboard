import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import api from '../services/api';

export default function TransactionListScreen({ navigation }:any) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/payments', {
        params: {
          status,
          method,
          dateFrom,
          dateTo,
        },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('TransactionDetails', { id: item._id })
      }
    >
      <Text style={styles.amount}>₹{item.amount ?? '0'}</Text>
      <Text style={styles.detail}>{item.receiver ?? 'Unknown'}</Text>
      <Text style={styles.status}>
        {item.status?.toUpperCase() ?? 'N/A'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TextInput
          placeholder="Status (e.g. success)"
          value={status}
          onChangeText={setStatus}
          style={styles.input}
        />
        <TextInput
          placeholder="Method (e.g. card)"
          value={method}
          onChangeText={setMethod}
          style={styles.input}
        />
        <TextInput
          placeholder="From (YYYY-MM-DD)"
          value={dateFrom}
          onChangeText={setDateFrom}
          style={styles.input}
        />
        <TextInput
          placeholder="To (YYYY-MM-DD)"
          value={dateTo}
          onChangeText={setDateTo}
          style={styles.input}
        />
        <TouchableOpacity onPress={fetchTransactions} style={styles.refreshBtn}>
          <Text style={{ color: 'white' }}>Apply Filters</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item:any) => item._id?.toString() ?? Math.random().toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f6fa' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  filterContainer: { marginBottom: 16 },
  input: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  refreshBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
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
  detail: { fontSize: 14, color: '#555' },
  status: { fontSize: 14, fontWeight: '600', marginTop: 4 },
});
