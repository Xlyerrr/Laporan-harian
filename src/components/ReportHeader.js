import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { ReportSummary } from './ReportSummary';
import { TransactionForm } from './TransactionForm';
import { TransactionChart } from './TransactionChart';
import { WalletSummary } from './Wallet';

const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const parseDateKey = (dateKey) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);

  if (!match) {
    return new Date();
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const getDaysInMonth = (year, month) => (
  new Date(year, month + 1, 0).getDate()
);

const getDateParts = (date) => ({
  day: date.getDate(),
  month: date.getMonth(),
  year: date.getFullYear(),
});

const formatDisplayDate = ({ day, month, year }) => (
  `${day} ${monthNames[month]} ${year}`
);

const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number);
  return `${monthNames[month - 1]} ${year}`;
};

const formatDatePartsKey = ({ day, month, year }) => (
  formatDateKey(new Date(year, month, day))
);

const getYearOptions = (selectedYear) => {
  const currentYear = new Date().getFullYear();
  const startYear = Math.min(currentYear - 5, selectedYear);
  const endYear = Math.max(currentYear + 1, selectedYear);

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index
  );
};

const exportPeriodOptions = [
  { value: 'daily', label: 'Harian' },
  { value: 'weekly', label: 'Mingguan' },
  { value: 'monthly', label: 'Bulanan' },
  { value: 'range', label: 'Rentang' },
];

const listPeriodOptions = [
  { value: 'daily', label: 'Harian' },
  { value: 'currentMonth', label: 'Bulan ini' },
  { value: 'previousMonth', label: 'Bulan lalu' },
];

const listTypeOptions = [
  { value: 'all', label: 'Semua' },
  { value: 'income', label: 'Uang masuk' },
  { value: 'expense', label: 'Uang keluar' },
];

export const ReportHeader = ({
  styles,
  activeScreen,
  themeMode,
  onThemeModeChange,
  amount,
  category,
  note,
  chartData,
  chartPeriod,
  exportStartDate,
  exportEndDate,
  exportPeriod,
  exportMonth,
  exportMonthOptions,
  listPeriod,
  listTitle,
  onExportPeriodChange,
  onExportMonthChange,
  onAmountChange,
  onCategoryChange,
  onCancelEdit,
  onChartPeriodChange,
  onDateChange,
  onExportCsv,
  onExportEndDateChange,
  onListPeriodChange,
  onNoteChange,
  onNavigate,
  onSave,
  onExportStartDateChange,
  onTypeChange,
  onWalletChange,
  isEditing,
  selectedDate,
  totals,
  transactionCount,
  type,
  wallet,
  walletTotals,
  listTypeFilter,
  onListTypeFilterChange,
}) => {
  const selectedDateObject = useMemo(
    () => parseDateKey(selectedDate),
    [selectedDate]
  );
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isExportMenuVisible, setIsExportMenuVisible] = useState(false);
  const [isListFilterVisible, setIsListFilterVisible] = useState(false);
  const [draftDate, setDraftDate] = useState(() => getDateParts(selectedDateObject));
  const selectedExportPeriod = exportPeriodOptions.find(
    (item) => item.value === exportPeriod
  ) || exportPeriodOptions[0];
  const dayOptions = useMemo(
    () => Array.from(
      { length: getDaysInMonth(draftDate.year, draftDate.month) },
      (_, index) => index + 1
    ),
    [draftDate.month, draftDate.year]
  );
  const yearOptions = useMemo(
    () => getYearOptions(draftDate.year),
    [draftDate.year]
  );

  useEffect(() => {
    setDraftDate(getDateParts(selectedDateObject));
  }, [selectedDateObject]);

  const updateDraftDate = (changes) => {
    setDraftDate((current) => {
      const nextDate = { ...current, ...changes };
      const maxDay = getDaysInMonth(nextDate.year, nextDate.month);

      return {
        ...nextDate,
        day: Math.min(nextDate.day, maxDay),
      };
    });
  };

  const applyDraftDate = () => {
    onDateChange(formatDatePartsKey(draftDate));
    setIsDatePickerVisible(false);
  };

  const selectToday = () => {
    const todayParts = getDateParts(new Date());

    setDraftDate(todayParts);
    onDateChange(formatDatePartsKey(todayParts));
    setIsDatePickerVisible(false);
  };

  const changeListPeriod = (period) => {
    onListPeriodChange(period);
  };
  const selectedTypeLabel = listTypeOptions.find(
    (item) => item.value === listTypeFilter
  )?.label || 'Semua';
  const selectedPeriodLabel = listPeriodOptions.find(
    (item) => item.value === listPeriod
  )?.label || 'Harian';
  const isDashboard = activeScreen === 'dashboard';
  const isTransactions = activeScreen === 'transactions';
  const isReports = activeScreen === 'reports';
  const screenContent = {
    dashboard: {
      eyebrow: 'Ruang kerja keuangan',
      title: 'Ringkasan keuangan',
      subtitle: 'Pantau arus kas dan transaksi terbaru dalam satu tempat.',
    },
    transactions: {
      eyebrow: 'Pencatatan transaksi',
      title: 'Kelola transaksi',
      subtitle: 'Catat, temukan, dan perbarui setiap transaksi dengan cepat.',
    },
    reports: {
      eyebrow: 'Analisis keuangan',
      title: 'Laporan dan tren',
      subtitle: 'Tinjau pola pengeluaran dan ekspor laporan Anda.',
    },
  }[activeScreen] || {
    eyebrow: 'Ruang kerja keuangan',
    title: 'Ringkasan keuangan',
    subtitle: 'Pantau arus kas dan transaksi terbaru dalam satu tempat.',
  };

  return (
    <View style={styles.headerContent}>
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroEyebrow}>{screenContent.eyebrow}</Text>
          <View style={styles.themeToggle}>
            <Text style={styles.themeToggleText}>
              {themeMode === 'dark' ? 'Gelap' : 'Terang'}
            </Text>
            <Switch
              accessibilityLabel="Aktifkan mode gelap"
              onValueChange={(isDark) => onThemeModeChange(isDark ? 'dark' : 'light')}
              thumbColor="#FFFFFF"
              trackColor={{ false: '#64748B', true: '#0F8A5F' }}
              value={themeMode === 'dark'}
            />
          </View>
        </View>
        <Text style={styles.heroTitle}>{screenContent.title}</Text>
        <Text style={styles.heroSubtitle}>{screenContent.subtitle}</Text>
        <View style={styles.heroActionRow}>
          <Text style={styles.heroChip}>{selectedDate}</Text>
          {!isTransactions && (
            <Pressable
              onPress={() => onNavigate('transactions')}
              style={styles.heroAction}
            >
              <Text style={styles.heroActionText}>+ Transaksi</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tanggal laporan</Text>
          <Text style={styles.datePreview}>{selectedDate}</Text>
        </View>
        <View style={styles.bankingDatePicker}>
          <Pressable
            onPress={() => setIsDatePickerVisible(true)}
            style={styles.bankingDateButton}
          >
            <View>
              <Text style={styles.bankingDateLabel}>Pilih tanggal</Text>
              <Text style={styles.bankingDateValue}>
                {formatDisplayDate(getDateParts(selectedDateObject))}
              </Text>
            </View>
            <Text style={styles.bankingDateIcon}>v</Text>
          </Pressable>
        </View>

        {isDashboard && (
          <>
            <ReportSummary styles={styles} totals={totals} />
            <WalletSummary styles={styles} walletTotals={walletTotals} />
          </>
        )}
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setIsDatePickerVisible(false)}
        transparent
        visible={isDatePickerVisible}
      >
        <View style={styles.dateModalOverlay}>
          <Pressable
            onPress={() => setIsDatePickerVisible(false)}
            style={styles.dateModalBackdrop}
          />
          <View style={styles.dateModalSheet}>
            <View style={styles.dateModalHeader}>
              <Text style={styles.dateModalTitle}>Pilih tanggal laporan</Text>
              <Pressable onPress={() => setIsDatePickerVisible(false)}>
                <Text style={styles.dateModalClose}>Tutup</Text>
              </Pressable>
            </View>

            <Text style={styles.dateModalPreview}>
              {formatDisplayDate(draftDate)}
            </Text>

            <View style={styles.dateOptionColumns}>
              <View style={styles.dateOptionColumn}>
                <Text style={styles.dateOptionTitle}>Tanggal</Text>
                <ScrollView style={styles.dateOptionList}>
                  {dayOptions.map((day) => (
                    <Pressable
                      key={day}
                      onPress={() => updateDraftDate({ day })}
                      style={[
                        styles.dateOptionItem,
                        draftDate.day === day && styles.dateOptionItemActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateOptionText,
                          draftDate.day === day && styles.dateOptionTextActive,
                        ]}
                      >
                        {day}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.dateOptionColumn}>
                <Text style={styles.dateOptionTitle}>Bulan</Text>
                <ScrollView style={styles.dateOptionList}>
                  {monthNames.map((month, index) => (
                    <Pressable
                      key={month}
                      onPress={() => updateDraftDate({ month: index })}
                      style={[
                        styles.dateOptionItem,
                        draftDate.month === index && styles.dateOptionItemActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateOptionText,
                          draftDate.month === index && styles.dateOptionTextActive,
                        ]}
                      >
                        {month.slice(0, 3)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.dateOptionColumn}>
                <Text style={styles.dateOptionTitle}>Tahun</Text>
                <ScrollView style={styles.dateOptionList}>
                  {yearOptions.map((year) => (
                    <Pressable
                      key={year}
                      onPress={() => updateDraftDate({ year })}
                      style={[
                        styles.dateOptionItem,
                        draftDate.year === year && styles.dateOptionItemActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateOptionText,
                          draftDate.year === year && styles.dateOptionTextActive,
                        ]}
                      >
                        {year}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.dateModalActions}>
              <Pressable onPress={selectToday} style={styles.dateTodayButton}>
                <Text style={styles.dateTodayButtonText}>Hari ini</Text>
              </Pressable>
              <Pressable onPress={applyDraftDate} style={styles.dateApplyButton}>
                <Text style={styles.dateApplyButtonText}>Terapkan</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        onRequestClose={() => setIsListFilterVisible(false)}
        transparent
        visible={isListFilterVisible}
      >
        <View style={styles.filterModalOverlay}>
          <Pressable
            onPress={() => setIsListFilterVisible(false)}
            style={styles.filterModalBackdrop}
          />
          <View style={styles.filterModalCard}>
            <View style={styles.filterModalHeader}>
              <View>
                <Text style={styles.filterModalTitle}>Filter transaksi</Text>
                <Text style={styles.filterModalSubtitle}>
                  Tentukan transaksi yang ingin ditampilkan.
                </Text>
              </View>
              <Pressable onPress={() => setIsListFilterVisible(false)}>
                <Text style={styles.filterModalClose}>Tutup</Text>
              </Pressable>
            </View>

            <View style={styles.filterModalSection}>
              <Text style={styles.filterModalLabel}>Jenis transaksi</Text>
              <View
                accessibilityLabel="Filter jenis transaksi"
                accessibilityRole="radiogroup"
                style={styles.listSegmentWrap}
              >
                {listTypeOptions.map((item) => (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ selected: listTypeFilter === item.value }}
                    key={item.value}
                    onPress={() => onListTypeFilterChange(item.value)}
                    style={[
                      styles.listSegmentButton,
                      listTypeFilter === item.value && styles.listSegmentButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.listSegmentText,
                        listTypeFilter === item.value && styles.listSegmentTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.filterModalSection}>
              <Text style={styles.filterModalLabel}>Periode</Text>
              <View
                accessibilityLabel="Filter periode transaksi"
                accessibilityRole="radiogroup"
                style={styles.listSegmentWrap}
              >
                {listPeriodOptions.map((item) => (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ selected: listPeriod === item.value }}
                    key={item.value}
                    onPress={() => changeListPeriod(item.value)}
                    style={[
                      styles.listSegmentButton,
                      listPeriod === item.value && styles.listSegmentButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.listSegmentText,
                        listPeriod === item.value && styles.listSegmentTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              onPress={() => setIsListFilterVisible(false)}
              style={styles.filterModalApply}
            >
              <Text style={styles.filterModalApplyText}>Selesai</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {!isTransactions && (
      <TransactionChart styles={styles}
        chartData={chartData}
        chartPeriod={chartPeriod}
        onChartPeriodChange={onChartPeriodChange}
      />
      )}

      {isTransactions && (
      <TransactionForm styles={styles}
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
        wallet={wallet}
        onWalletChange={onWalletChange}
      />
      )}

      {!isDashboard && (
      <View style={styles.panel}>
        <View style={styles.reportToolsHeader}>
          <View>
            <Text style={styles.sectionTitle}>Kelola laporan</Text>
            <Text style={styles.reportToolsCaption}>Export CSV dan tampilan transaksi</Text>
          </View>
          <Text style={styles.datePreview}>{selectedDate}</Text>
        </View>

        <View style={styles.reportToolsGrid}>
          {isReports && <View style={styles.reportToolColumn}>
            <View style={styles.reportToolHeader}>
              <View style={styles.reportToolTitleRow}>
                <View style={styles.reportToolDot} />
                <Text style={styles.reportToolTitle}>Export laporan</Text>
              </View>
              <Text style={styles.reportToolBadge}>CSV</Text>
            </View>

            <View style={styles.exportActionRow}>
              <View style={styles.exportSelectWrap}>
                <Pressable
                  onPress={() => setIsExportMenuVisible((visible) => !visible)}
                  style={styles.exportSelect}
                >
                  <Text style={styles.exportSelectText}>{selectedExportPeriod.label}</Text>
                  <Text style={styles.exportSelectIcon}>{isExportMenuVisible ? '^' : 'v'}</Text>
                </Pressable>

                {isExportMenuVisible && (
                  <View style={styles.exportMenu}>
                    {exportPeriodOptions.map((item) => (
                      <Pressable
                        key={item.value}
                        onPress={() => {
                          onExportPeriodChange(item.value);
                          setIsExportMenuVisible(false);
                        }}
                        style={[
                          styles.exportMenuOption,
                          exportPeriod === item.value && styles.exportMenuOptionActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.exportMenuText,
                            exportPeriod === item.value && styles.exportMenuTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <Pressable
                onPress={onExportCsv}
                style={[styles.primaryButton, styles.exportActionButton]}
              >
                <Text style={[styles.primaryButtonText, styles.exportActionText]}>
                  Export CSV
                </Text>
              </Pressable>
            </View>

            {exportPeriod === 'monthly' && (
              <View style={styles.monthPickerWrap}>
                {exportMonthOptions.map((month) => (
                  <Pressable
                    key={month}
                    onPress={() => onExportMonthChange(month)}
                    style={[
                      styles.monthPickerButton,
                      exportMonth === month && styles.monthPickerButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.monthPickerText,
                        exportMonth === month && styles.monthPickerTextActive,
                      ]}
                    >
                      {formatMonthLabel(month)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
            {exportPeriod === 'range' && (
              <View style={styles.rangeExportWrap}>
                <View style={styles.rangeExportField}>
                  <Text style={styles.inputLabel}>Tanggal mulai</Text>
                  <TextInput
                    onChangeText={onExportStartDateChange}
                    placeholder="YYYY-MM-DD"
                    style={styles.input}
                    value={exportStartDate}
                  />
                </View>
                <View style={styles.rangeExportField}>
                  <Text style={styles.inputLabel}>Tanggal akhir</Text>
                  <TextInput
                    onChangeText={onExportEndDateChange}
                    placeholder="YYYY-MM-DD"
                    style={styles.input}
                    value={exportEndDate}
                  />
                </View>
              </View>
            )}
          </View>
          }

          {isReports && <View style={styles.reportToolDivider} />}

          {isTransactions && <View style={styles.reportToolColumn}>
            <View style={styles.reportToolHeader}>
              <View style={styles.reportToolTitleRow}>
                <View style={styles.reportToolDot} />
                <Text style={styles.reportToolTitle}>Daftar transaksi</Text>
              </View>
              <Text style={styles.reportToolBadge}>Filter</Text>
            </View>
            <Pressable
              accessibilityHint="Buka pilihan filter transaksi"
              accessibilityRole="button"
              onPress={() => setIsListFilterVisible(true)}
              style={styles.filterTrigger}
            >
              <View>
                <Text style={styles.filterTriggerLabel}>Tampilan transaksi</Text>
                <Text style={styles.filterTriggerValue}>
                  {selectedTypeLabel} · {selectedPeriodLabel}
                </Text>
              </View>
              <View style={styles.filterTriggerBadge}>
                <Text style={styles.filterTriggerBadgeText}>Filter</Text>
              </View>
            </Pressable>

          </View>
          }
        </View>
      </View>
      )}

      {!isReports && <Text style={styles.listTitle}>{listTitle}</Text>}
    </View>
  );
};
