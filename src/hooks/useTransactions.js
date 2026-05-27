import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

const STORAGE_KEY = 'laporan-harian:transactions';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setTransactions(JSON.parse(saved));
        }
      } catch (error) {
        Alert.alert('Gagal memuat data', 'Data lokal tidak bisa dibaca.');
      } finally {
        setLoaded(true);
      }
    };

    loadTransactions();
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)).catch(() => {
      Alert.alert('Gagal menyimpan data', 'Coba tambahkan transaksi lagi.');
    });
  }, [loaded, transactions]);

  return { transactions, setTransactions };
};
