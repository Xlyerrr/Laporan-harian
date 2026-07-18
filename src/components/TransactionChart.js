import { Pressable, Text, View } from 'react-native';
import { formatRupiah } from '../utils/currency';

const formatShortRupiah = (value) => {
  if (value >= 1000000) {
    return `Rp${(value / 1000000).toFixed(1).replace('.0', '')} jt`;
  }

  if (value >= 1000) {
    return `Rp${Math.round(value / 1000)} rb`;
  }

  return formatRupiah(value);
};

const periodOptions = [
  { value: 'daily', label: 'Harian' },
  { value: 'weekly', label: 'Mingguan' },
  { value: 'monthly', label: 'Bulanan' },
];

const periodTitles = {
  daily: 'Pengeluaran Harian',
  weekly: 'Pengeluaran Mingguan',
  monthly: 'Pengeluaran Bulanan',
};

export const TransactionChart = ({
  styles,
  chartData,
  chartPeriod,
  onChartPeriodChange,
}) => {
  const labels = chartData?.labels?.length > 0 ? chartData.labels : ['-'];
  const values = chartData?.datasets?.[0]?.data ?? [0];
  const maxValue = Math.max(...values, 0);
  const chartMax = maxValue || 1;
  const total = values.reduce((sum, value) => sum + value, 0);
  const average = Math.round(total / labels.length);
  const maxIndex = values.indexOf(maxValue);

  return (
    <View style={styles.panel}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{periodTitles[chartPeriod]}</Text>
        <Text style={styles.chartPeakText}>Tertinggi {formatShortRupiah(maxValue)}</Text>
      </View>

      <View style={styles.chartPeriodWrap}>
        {periodOptions.map((item) => (
          <Pressable
            key={item.value}
            onPress={() => onChartPeriodChange(item.value)}
            style={[
              styles.chartPeriodButton,
              chartPeriod === item.value && styles.chartPeriodButtonActive,
            ]}
          >
            <Text
              style={[
                styles.chartPeriodText,
                chartPeriod === item.value && styles.chartPeriodTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.chartStatsRow}>
        <View style={styles.chartStat}>
          <Text style={styles.chartStatLabel}>Total</Text>
          <Text style={styles.chartStatValue}>{formatRupiah(total)}</Text>
        </View>
        <View style={styles.chartStat}>
          <Text style={styles.chartStatLabel}>Rata-rata</Text>
          <Text style={styles.chartStatValue}>{formatRupiah(average)}</Text>
        </View>
      </View>

      <View style={styles.heatList}>
        {labels.map((label, index) => {
          const value = values[index] ?? 0;
          const barWidth = value > 0 ? Math.max((value / chartMax) * 100, 8) : 0;
          const isPeak = value > 0 && index === maxIndex;

          return (
            <View key={`${label}-${index}`} style={styles.heatRow}>
              <View style={styles.heatDateWrap}>
                <Text style={[styles.heatDate, isPeak && styles.heatDatePeak]}>
                  {label}
                </Text>
              </View>

              <View style={styles.heatTrack}>
                <View
                  style={[
                    styles.heatBar,
                    isPeak && styles.heatBarPeak,
                    { width: `${barWidth}%` },
                  ]}
                />
                {isPeak && (
                  <View style={styles.heatPeakBadge}>
                    <Text style={styles.heatPeakBadgeText}>Tertinggi</Text>
                  </View>
                )}
              </View>

              <View style={styles.heatValueWrap}>
                <Text style={[styles.heatValue, value === 0 && styles.heatValueMuted]}>
                  {formatShortRupiah(value)}
                </Text>
              </View>
            </View>
          );
        })}

        {total === 0 && (
          <View style={styles.heatEmptyNotice}>
            <Text style={styles.heatEmptyText}>
              Belum ada pengeluaran pada rentang ini.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
