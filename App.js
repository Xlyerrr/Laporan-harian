import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

import { EmptyState } from './src/components/EmptyState';
import { ReportHeader } from './src/components/ReportHeader';
import { TransactionItem } from './src/components/TransactionItem';
import { categories } from './src/constants/categories';
import { useTransactions } from './src/hooks/useTransactions';
import { styles } from './src/styles/styles';
import { transactionsToCsv } from './src/utils/csv';
import { today } from './src/utils/date';
import {
  createTransaction,
  getDailyTransactions,
  getTransactionTotals,
  parseAmount,
} from './src/utils/transactions';

const downloadCsvOnWeb = (csv, fileName) => {
  const blob = new Blob([`\uFEFF${csv}`], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};

export default function App() {
  const { transactions, setTransactions } = useTransactions();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState(categories.expense[0]);
  const [selectedDate, setSelectedDate] = useState(today());

  const dailyTransactions = useMemo(
    () => getDailyTransactions(transactions, selectedDate),
    [selectedDate, transactions]
  );

  const exportCsv = async () => {
  if (dailyTransactions.length === 0) {
    Alert.alert('Belum ada data', 'Tambahkan transaksi sebelum mengekspor ke csv.');
    return;
  }

  const csv = transactionsToCsv(dailyTransactions);
  const fileName = `laporan-harian-${selectedDate}.csv`;

  if (Platform.OS === 'web') {
    downloadCsvOnWeb(csv, fileName);
    return;
  }

  if (Platform.OS === 'android') {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (!permissions.granted) {
      Alert.alert('Dibatalkan', 'Folder penyimpanan belum dipilih.');
      return;
    }

    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      fileName,
      'text/csv'
    );

    await FileSystem.writeAsStringAsync(fileUri, `\uFEFF${csv}`, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    Alert.alert('Berhasil', `File ${fileName} berhasil disimpan.`);
  }
};

  const totals = useMemo(
    () => getTransactionTotals(dailyTransactions),
    [dailyTransactions]
  );

  const changeType = (nextType) => {
    setType(nextType);
    setCategory(categories[nextType][0]);
  };

  const saveTransaction = () => {
    const cleanAmount = parseAmount(amount);
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(selectedDate);

    if (!cleanAmount || cleanAmount < 1) {
      Alert.alert('Nominal belum valid', 'Masukkan nominal lebih dari 0.');
      return;
    }

    if (!isValidDate || Number.isNaN(new Date(selectedDate).getTime())) {
      Alert.alert('Tanggal belum valid', 'Gunakan format YYYY-MM-DD.');
      return;
    }

    const newTransaction = createTransaction({
      type,
      amount: cleanAmount,
      category,
      date: selectedDate,
      note,
    });

    setTransactions((current) => [newTransaction, ...current]);
    setAmount('');
    setNote('');
  };

  const deleteTransaction = (id) => {
    Alert.alert('Hapus transaksi?', 'Data yang dihapus tidak bisa dikembalikan.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () =>
          setTransactions((current) =>
            current.filter((transaction) => transaction.id !== id)
          ),
      },
    ]);
  };

  const renderTransaction = ({ item }) => (
    <TransactionItem item={item} onDelete={deleteTransaction} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <FlatList
          data={dailyTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          ListHeaderComponent={
            <ReportHeader
              amount={amount}
              category={category}
              onAmountChange={setAmount}
              onCategoryChange={setCategory}
              onDateChange={setSelectedDate}
              onExportCsv={exportCsv}
              onNoteChange={setNote}
              onSave={saveTransaction}
              onTypeChange={changeType}
              note={note}
              selectedDate={selectedDate}
              totals={totals}
              type={type}
              transactionCount={dailyTransactions.length}
            />
          }
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
