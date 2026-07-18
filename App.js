import { StatusBar } from 'expo-status-bar';
import { View, useWindowDimensions } from 'react-native';
import { MobileNavigation, Sidebar } from './src/components/Sidebar';
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
import { wallets } from './src/constants/wallets';
import { useTransactions } from './src/hooks/useTransactions';
import { transactionsToCsv } from './src/utils/csv';
import { createStyles } from './src/styles/styles';
import { themes } from './src/styles/theme';
import { today } from './src/utils/date';
import {
  createTransaction,
  getExpenseChartData,
  getAvailableTransactionMonths,
  getDailyTransactions,
  getExportTransactions,
  getMonthlyTransactions,
  getPreviousMonthTransactions,
  getRangeExportTransactions,
  getTransactionTotals,
  getWalletTotals,
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

const isValidDateKey = (dateKey) =>
  /^\d{4}-\d{2}-\d{2}$/.test(dateKey) &&
  !Number.isNaN(new Date(`${dateKey}T00:00:00`).getTime());

export default function App() {
  const [listTypeFilter, setListTypeFilter] = useState('all');
  const [themeMode, setThemeMode] = useState('light');
  const colors = themes[themeMode];
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { transactions, setTransactions } = useTransactions();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState(categories.expense[0]);
  const [wallet, setWallet] = useState(wallets[0]);
  const [selectedDate, setSelectedDate] = useState(today());
  const [chartPeriod, setChartPeriod] = useState('weekly');
  const [exportPeriod, setExportPeriod] = useState('daily');
  const [exportMonth, setExportMonth] = useState(selectedDate.slice(0, 7));
  const [exportStartDate, setExportStartDate] = useState(selectedDate);
  const [exportEndDate, setExportEndDate] = useState(selectedDate);
  const [listPeriod, setListPeriod] = useState('daily');
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const dailyTransactions = useMemo(
    () => getDailyTransactions(transactions, selectedDate),
    [selectedDate, transactions]
  );

  const visibleTransactions = useMemo(() => {
    let transactionsByPeriod = dailyTransactions;

    if (listPeriod === 'currentMonth') {
      transactionsByPeriod = getMonthlyTransactions(transactions, selectedDate);
    }

    if (listPeriod === 'previousMonth') {
      transactionsByPeriod = getPreviousMonthTransactions(transactions, selectedDate);
    }

    if (listTypeFilter === 'all') {
      return transactionsByPeriod;
    }

    return transactionsByPeriod.filter(
      (transaction) => transaction.type === listTypeFilter
    );
  }, [dailyTransactions, listPeriod, listTypeFilter, selectedDate, transactions]);

  const listTitle = {
    daily: `Transaksi ${selectedDate}`,
    currentMonth: `Transaksi bulan ${selectedDate.slice(0, 7)}`,
    previousMonth: 'Transaksi bulan sebelumnya',
  }[listPeriod];

  const expenseChartData = useMemo(
    () => getExpenseChartData(transactions, selectedDate, chartPeriod),
    [chartPeriod, selectedDate, transactions]
  );

  const exportMonthOptions = useMemo(
    () => getAvailableTransactionMonths(transactions, selectedDate),
    [selectedDate, transactions]
  );

  const selectedExportMonth = exportMonthOptions.includes(exportMonth)
    ? exportMonth
    : exportMonthOptions[0];

  const exportCsv = async () => {
    if (exportPeriod === 'range') {
      if (!isValidDateKey(exportStartDate) || !isValidDateKey(exportEndDate)) {
        Alert.alert('Tanggal belum valid', 'Gunakan format YYYY-MM-DD untuk rentang export.');
        return;
      }

      if (new Date(`${exportStartDate}T00:00:00`) > new Date(`${exportEndDate}T00:00:00`)) {
        Alert.alert('Rentang belum valid', 'Tanggal mulai tidak boleh lebih besar dari tanggal akhir.');
        return;
      }
    }

    const exportDateKey =
      exportPeriod === 'monthly' ? `${selectedExportMonth}-01` : selectedDate;
    const exportTransactions =
      exportPeriod === 'range'
        ? getRangeExportTransactions(transactions, exportStartDate, exportEndDate)
        : getExportTransactions(transactions, exportDateKey, exportPeriod);

    if (exportTransactions.length === 0) {
      Alert.alert('Belum ada data', 'Tidak ada transaksi untuk periode export ini.');
      return;
    }

    const periodLabel = {
      daily: 'harian',
      weekly: 'mingguan',
      monthly: 'bulanan',
      range: 'rentang',
    }[exportPeriod];

    const csv = transactionsToCsv(exportTransactions);
    const fileName =
      exportPeriod === 'monthly'
        ? `laporan-bulanan-${selectedExportMonth}.csv`
        : exportPeriod === 'range'
          ? `laporan-rentang-${exportStartDate}-sampai-${exportEndDate}.csv`
        : `laporan-${periodLabel}-${selectedDate}.csv`;

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

  const walletTotals = useMemo(
    () => getWalletTotals(transactions),
    [transactions]
  );

  const changeType = (nextType) => {
    setType(nextType);
    setCategory(categories[nextType][0]);
  };

  const resetForm = () => {
    setAmount('');
    setNote('');
    setEditingTransactionId(null);
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

    if (editingTransactionId) {
      setTransactions((current) =>
        current.map((transaction) =>
          transaction.id === editingTransactionId
            ? {
                ...transaction,
                type,
                amount: cleanAmount,
                category,
                wallet,
                date: selectedDate,
                note: note.trim() || 'Tanpa catatan',
                updatedAt: new Date().toISOString(),
              }
            : transaction
        )
      );
      resetForm();
      return;
    }

    const newTransaction = createTransaction({
      type,
      amount: cleanAmount,
      category,
      date: selectedDate,
      note,
      wallet,
    });

    setTransactions((current) => [newTransaction, ...current]);
    resetForm();
  };

  const editTransaction = (transaction) => {
    setEditingTransactionId(transaction.id);
    setType(transaction.type);
    setCategory(transaction.category);
    setWallet(transaction.wallet || wallets[0]);
    setSelectedDate(transaction.date);
    setAmount(String(transaction.amount));
    setNote(transaction.note === 'Tanpa catatan' ? '' : transaction.note);
  };

  const cancelEdit = () => {
    resetForm();
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
    <TransactionItem
      styles={styles}
      item={item}
      onDelete={deleteTransaction}
      onEdit={editTransaction}
    />
  );
  const shouldShowTransactions = activeScreen !== 'reports';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />

      <View style={styles.appShell}>
        {isDesktop && (
          <Sidebar
            activeScreen={activeScreen}
            onScreenChange={setActiveScreen}
            styles={styles}
          />
        )}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <FlatList
          data={shouldShowTransactions ? visibleTransactions : []}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          ListHeaderComponent={
            <ReportHeader
              styles={styles}
              themeMode={themeMode}
              onThemeModeChange={setThemeMode}
              amount={amount}
              category={category}
              chartData={expenseChartData}
              chartPeriod={chartPeriod}
              activeScreen={activeScreen}
              exportStartDate={exportStartDate}
              exportEndDate={exportEndDate}
              exportPeriod={exportPeriod}
              exportMonth={selectedExportMonth}
              exportMonthOptions={exportMonthOptions}
              listPeriod={listPeriod}
              listTitle={listTitle}
              onAmountChange={setAmount}
              onCategoryChange={setCategory}
              onChartPeriodChange={setChartPeriod}
              onNavigate={setActiveScreen}
              onDateChange={setSelectedDate}
              onExportCsv={exportCsv}
              onExportEndDateChange={setExportEndDate}
              onExportMonthChange={setExportMonth}
              onExportPeriodChange={setExportPeriod}
              onExportStartDateChange={setExportStartDate}
              onListPeriodChange={setListPeriod}
              onNoteChange={setNote}
              onSave={saveTransaction}
              onCancelEdit={cancelEdit}
              onTypeChange={changeType}
              onWalletChange={setWallet}
              isEditing={Boolean(editingTransactionId)}
              note={note}
              selectedDate={selectedDate}
              totals={totals}
              type={type}
              transactionCount={dailyTransactions.length}
              wallet={wallet}
              walletTotals={walletTotals}
              listTypeFilter={listTypeFilter}
              onListTypeFilterChange={setListTypeFilter}
            />
          }
          ListEmptyComponent={
            shouldShowTransactions ? <EmptyState styles={styles} /> : null
          }
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          />
        </KeyboardAvoidingView>
      </View>
      {!isDesktop && (
        <MobileNavigation
          activeScreen={activeScreen}
          onScreenChange={setActiveScreen}
          styles={styles}
        />
      )}
    </SafeAreaView>
  );
}
