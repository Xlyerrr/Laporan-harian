import { Pressable, Text, TextInput, View } from 'react-native';

import { categories } from '../constants/categories';
import { wallets } from '../constants/wallets';

export const TransactionForm = ({
  styles,
  amount,
  category,
  isEditing,
  note,
  onAmountChange,
  onCancelEdit,
  onCategoryChange,
  onNoteChange,
  onSave,
  onTypeChange,
  onWalletChange,
  type,
  wallet,
}) => (
  <View style={[styles.panel, isEditing && styles.editingPanel]}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {isEditing ? 'Edit transaksi' : 'Tambah transaksi'}
      </Text>
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

    <Text style={styles.inputLabel}>Wallet</Text>
    <View style={styles.categoryWrap}>
      {wallets.map((item) => (
        <Pressable
          key={item}
          onPress={() => onWalletChange(item)}
          style={[styles.categoryButton, wallet === item && styles.categoryActive]}
        >
          <Text
            style={[
              styles.categoryText,
              wallet === item && styles.categoryTextActive,
            ]}
          >
            {item}
          </Text>
        </Pressable>
      ))}
    </View>

    <Pressable onPress={onSave} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>
        {isEditing ? 'Simpan perubahan' : '+ Simpan transaksi'}
      </Text>
    </Pressable>

    {isEditing && (
      <Pressable onPress={onCancelEdit} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Batal edit</Text>
      </Pressable>
    )}
  </View>
);
