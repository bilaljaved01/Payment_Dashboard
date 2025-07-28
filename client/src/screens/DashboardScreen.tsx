import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;



export default function DashboardScreen() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/payments/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total Payments Today:</Text>
        <Text style={styles.value}>{stats?.todayPayments || 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Payments This Week:</Text>
        <Text style={styles.value}>{stats?.weekPayments || 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Revenue:</Text>
        <Text style={styles.value}>₹{stats?.totalRevenue || 0}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Failed Transactions:</Text>
        <Text style={styles.value}>{stats?.failedCount || 0}</Text>
      </View>

      <Text style={styles.chartTitle}>Revenue - Last 7 Days</Text>
      <LineChart
  data={{
    labels: stats?.last7Days?.map((d: any) => d.day) || [],
    datasets: [{ data: stats?.last7Days?.map((d: any) => d.amount) || [] }],
  }}
  width={screenWidth - 32}
  height={220}
  chartConfig={{
    backgroundGradientFrom: '#f4f6fa',
    backgroundGradientTo: '#f4f6fa',
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    labelColor: () => '#000',
  }}
  style={{ borderRadius: 10 }}
/>

    </ScrollView>
  );
}

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
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#444',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 16,
  },
  chart: {
    borderRadius: 10,
  },
});
