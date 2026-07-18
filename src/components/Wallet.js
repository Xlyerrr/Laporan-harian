import { Text, View } from 'react-native';

import { wallets } from '../constants/wallets';
import { formatRupiah } from '../utils/currency';

export const WalletSummary = ({ styles, walletTotals = {} }) => (
  <View style={styles.walletSummary}>
    <Text style={styles.walletTitle}>Wallet</Text>

    {wallets.map((wallet) => (
      <View key={wallet} style={styles.walletRow}>
        <Text style={styles.walletName}>{wallet}</Text>
        <Text style={styles.walletAmount}>
          {formatRupiah(walletTotals[wallet] || 0)}
        </Text>
      </View>
    ))}
  </View>
);
