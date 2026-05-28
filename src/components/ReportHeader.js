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
  exportPeriod,
  onExportPeriodChange,
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
        <Text style={styles.heroChip}>{selectedDate}</Text>
      </View>
      <Text style={styles.heroTitle}>Pemasukan dan Pengeluaran</Text>
      <Text style={styles.heroSubtitle}>Ringkas, rapi, dan siap diekspor.</Text>
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
      exportPeriod={exportPeriod}
      onExportPeriodChange={onExportPeriodChange}
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

    <View style={styles.panel}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Export laporan</Text>
        <Text style={styles.datePreview}>CSV</Text>
      </View>
      <View style={styles.exportPeriodWrap}>
        {[
          { value: 'daily', label: 'Harian' },
          { value: 'weekly', label: 'Mingguan' },
          { value: 'monthly', label: 'Bulanan' },
        ].map((item) => (
          <Pressable
            key={item.value}
            onPress={() => onExportPeriodChange(item.value)}
            style={[
              styles.exportPeriodButton,
              exportPeriod === item.value && styles.exportPeriodButtonActive,
            ]}
          >
            <Text
              style={[
                styles.exportPeriodText,
                exportPeriod === item.value && styles.exportPeriodTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        disabled={transactionCount === 0}
        onPress={onExportCsv}
        style={[
          styles.primaryButton,
          transactionCount === 0 && styles.primaryButtonDisabled,
        ]}
      >
        <Text style={styles.primaryButtonText}>Export CSV</Text>
      </Pressable>
    </View>

    <Text style={styles.listTitle}>Transaksi {selectedDate}</Text>
  </View>
);
