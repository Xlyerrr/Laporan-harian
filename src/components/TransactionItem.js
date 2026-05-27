import { Pressable, Text, View } from 'react-native';

import { styles } from '../styles/styles';
import { formatRupiah } from '../utils/currency';

export const TransactionItem = ({ item, onDelete }) => (
  <Pressable onLongPress={() => onDelete(item.id)} style={styles.transactionItem}>
    <View
      style={
        item.type === 'income'
          ? styles.transactionAccentIncome
          : styles.transactionAccentExpense
      }
    />
    <View style={styles.transactionMeta}>
      <View style={styles.transactionTitleRow}>
        <Text style={styles.transactionNote}>{item.note}</Text>
        <Text style={item.type === 'income' ? styles.smallBadgeIncome : styles.smallBadgeExpense}>
          {item.type === 'income' ? 'Masuk' : 'Keluar'}
        </Text>
      </View>
      <Text style={styles.transactionCategory}>{item.category}</Text>
    </View>
    <View style={styles.transactionAmountWrap}>
      <Text style={item.type === 'income' ? styles.incomeText : styles.expenseText}>
        {item.type === 'income' ? '+' : '-'} {formatRupiah(item.amount)}
      </Text>
      <Text style={styles.deleteHint}>Tahan untuk hapus</Text>
    </View>
  </Pressable>
);
