import { Pressable, Text, TextInput, View } from 'react-native';

import { categories } from '../constants/categories';
import { styles } from '../styles/styles';

export const TransactionForm = ({
  amount,
  category,
  note,
  onAmountChange,
  onCategoryChange,
  onNoteChange,
  onSave,
  onTypeChange,
  type,
}) => (
  <View style={styles.panel}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Tambah transaksi</Text>
      <Text style={type === 'income' ? styles.typeBadgeIncome : styles.typeBadgeExpense}>
        {type === 'income' ? 'Masuk' : 'Keluar'}
      </Text>
    </View>

    <View style={styles.segmentedControl}>
      <Pressable
        onPress={() => onTypeChange('income')}
        style={[styles.segment, type === 'income' && styles.segmentActiveIncome]}
      >
        <Text style={[styles.segmentText, type === 'income' && styles.segmentTextActive]}>
          Pemasukan
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onTypeChange('expense')}
        style={[styles.segment, type === 'expense' && styles.segmentActiveExpense]}
      >
        <Text style={[styles.segmentText, type === 'expense' && styles.segmentTextActive]}>
          Pengeluaran
        </Text>
      </Pressable>
    </View>

    <Text style={styles.inputLabel}>Nominal</Text>
    <TextInput
      value={amount}
      onChangeText={onAmountChange}
      placeholder="Nominal, contoh 50000"
      keyboardType="number-pad"
      style={styles.input}
    />
    <Text style={styles.inputLabel}>Catatan</Text>
    <TextInput
      value={note}
      onChangeText={onNoteChange}
      placeholder="Catatan, contoh makan siang"
      style={styles.input}
    />

    <Text style={styles.inputLabel}>Kategori</Text>
    <View style={styles.categoryWrap}>
      {categories[type].map((item) => (
        <Pressable
          key={item}
          onPress={() => onCategoryChange(item)}
          style={[styles.categoryButton, category === item && styles.categoryActive]}
        >
          <Text
            style={[
              styles.categoryText,
              category === item && styles.categoryTextActive,
            ]}
          >
            {item}
          </Text>
        </Pressable>
      ))}
    </View>

    <Pressable onPress={onSave} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>+ Simpan transaksi</Text>
    </Pressable>
  </View>
);
