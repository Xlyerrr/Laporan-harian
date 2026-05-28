import { Text, View } from 'react-native';

import { styles } from '../styles/styles';
import { formatRupiah } from '../utils/currency';

const getBalanceStatus = (balance) => {
  if (balance > 0) {
    return 'Surplus hari ini';
  }

  if (balance < 0) {
    return 'Defisit hari ini';
  }

  return 'Pemasukan dan pengeluaran seimbang';
};

export const ReportSummary = ({ totals }) => {
  const balanceStatus = getBalanceStatus(totals.balance);

  return (
    <View style={styles.summaryWrap}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Selisih harian</Text>
        <Text
          style={
            totals.balance >= 0 ? styles.balanceAmount : styles.balanceAmountDanger
          }
        >
          {formatRupiah(totals.balance)}
        </Text>
        <Text style={styles.balanceStatus}>{balanceStatus}</Text>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryItemIncome}>
          <Text style={styles.summaryLabel}>Pemasukan</Text>
          <Text style={styles.incomeText}>{formatRupiah(totals.income)}</Text>
        </View>
        <View style={styles.summaryItemExpense}>
          <Text style={styles.summaryLabel}>Pengeluaran</Text>
          <Text style={styles.expenseText}>{formatRupiah(totals.expense)}</Text>
        </View>
      </View>
    </View>
  );
};
