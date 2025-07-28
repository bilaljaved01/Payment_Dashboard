import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import api from '../services/api';

export default function AddPaymentScreen({ navigation }:any) {
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [status, setStatus] = useState('success'); // default
  const [method, setMethod] = useState('card'); // default

  const handleSubmit = async () => {
    if (!amount || !receiver || !status || !method) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const response = await api.post('/payments', {
        amount: Number(amount),
        receiver,
        status,
        method,
      });

      Alert.alert('Success', 'Payment added successfully');
      navigation.navigate('Transactions');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add payment');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Payment</Text>

      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        placeholder="Receiver"
        style={styles.input}
        value={receiver}
        onChangeText={setReceiver}
      />
      <TextInput
        placeholder="Status (success, failed, pending)"
        style={styles.input}
        value={status}
        onChangeText={setStatus}
      />
      <TextInput
        placeholder="Method (card, bank, upi)"
        style={styles.input}
        value={method}
        onChangeText={setMethod}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f6fa',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
