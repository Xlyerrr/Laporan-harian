import { Pressable, Text, TextInput, View } from 'react-native';

import { styles } from '../styles/styles';
import { ReportSummary } from './ReportSummary';
import { TransactionForm } from './TransactionForm';
import { TransactionChart } from './TransactionChart';


export const ReportHeader = ({
  amount,
  category,
  note,
  chartData,
  onAmountChange,
  onCategoryChange,
  onCancelEdit,
  onDateChange,
  onExportCsv,
  onNoteChange,
  onSave,
  onTypeChange,
  isEditing,
  selectedDate,
  totals,
  transactionCount,
  type,
}) => (
  <View style={styles.headerContent}>
    <View style={styles.hero}>
      <View style={styles.heroTopRow}>
        <Text style={styles.heroEyebrow}>Laporan harian</Text>
        <Text style={styles.heroChip}>Aktif</Text>
      </View>
      <Text style={styles.heroTitle}>Pemasukan dan Pengeluaran</Text>
      <Text style={styles.heroSubtitle}>Catat arus kas harian dengan cepat.</Text>
    </View>

    <View style={styles.panel}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tanggal laporan</Text>
        <Text style={styles.datePreview}>{selectedDate}</Text>
      </View>
      <Text style={styles.inputLabel}>Format YYYY-MM-DD</Text>
      <TextInput
        value={selectedDate}
        onChangeText={onDateChange}
        placeholder="YYYY-MM-DD"
        style={styles.input}
      />

      <ReportSummary totals={totals} />
    </View>

    <TransactionChart chartData={chartData} />

    <TransactionForm
      amount={amount}
      category={category}
      isEditing={isEditing}
      note={note}
      onAmountChange={onAmountChange}
      onCancelEdit={onCancelEdit}
      onCategoryChange={onCategoryChange}
      onNoteChange={onNoteChange}
      onSave={onSave}
      onTypeChange={onTypeChange}
      type={type}
    />

    <Pressable
      disabled={transactionCount === 0}
      onPress={onExportCsv}
      style={styles.primaryButton}
    >
      <Text style={styles.primaryButtonText}>Export CSV ({transactionCount})</Text>
    </Pressable>

    <Text style={styles.listTitle}>Transaksi {selectedDate}</Text>
  </View>
);
