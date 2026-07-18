import { Text, View } from 'react-native';

export const EmptyState = ({ styles }) => (
  <View style={styles.emptyState}>
    <View style={styles.emptyBadge}>
      <Text style={styles.emptyBadgeText}>0</Text>
    </View>
    <Text style={styles.emptyTitle}>Belum ada transaksi</Text>
    <Text style={styles.emptyText}>Tambahkan pemasukan atau pengeluaran hari ini.</Text>
  </View>
);
