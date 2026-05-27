# Laporan Harian React Native

Aplikasi mobile sederhana untuk mencatat pemasukan dan pengeluaran harian.
Dibuat dengan Expo React Native agar bisa dijalankan di Android, iOS, dan Web.

## Fitur

- Tambah transaksi pemasukan atau pengeluaran.
- Pilih kategori transaksi.
- Filter laporan berdasarkan tanggal.
- Ringkasan pemasukan, pengeluaran, dan saldo harian.
- Simpan data lokal dengan AsyncStorage.
- Hapus transaksi dengan tekan lama pada item transaksi.

## Struktur Source Code

```text
App.js
src/
  components/
    EmptyState.js
    ReportHeader.js
    ReportSummary.js
    TransactionForm.js
    TransactionItem.js
  constants/
    categories.js
  hooks/
    useTransactions.js
  styles/
    styles.js
  utils/
    currency.js
    date.js
    transactions.js
```

- `App.js`: mengatur state form, filter tanggal, simpan, dan hapus transaksi.
- `src/components`: potongan tampilan seperti form, ringkasan, dan item transaksi.
- `src/hooks/useTransactions.js`: memuat dan menyimpan data ke penyimpanan lokal.
- `src/constants/categories.js`: daftar kategori pemasukan dan pengeluaran.
- `src/utils`: fungsi bantuan untuk format uang, tanggal, dan hitung transaksi.
- `src/styles/styles.js`: semua styling React Native.

## Langkah Menjalankan

1. Masuk ke folder proyek:

   ```bash
   cd laporan-harian
   ```

2. Jalankan development server Expo:

   ```bash
   npm start
   ```

3. Buka aplikasi:

   ```bash
   npm run android
   npm run ios
   npm run web
   ```

   Untuk perangkat fisik, install Expo Go lalu scan QR code dari terminal.

## Langkah Pembuatan Dari Nol

1. Buat proyek Expo:

   ```bash
   npx create-expo-app@latest laporan-harian --template blank
   ```

2. Masuk ke folder proyek:

   ```bash
   cd laporan-harian
   ```

3. Pasang penyimpanan lokal:

   ```bash
   npx expo install @react-native-async-storage/async-storage
   ```

4. Ganti isi `App.js` dengan kode aplikasi laporan harian.

5. Jalankan aplikasi:

   ```bash
   npm start
   ```

## Catatan Pengembangan Berikutnya

- Tambahkan edit transaksi.
- Tambahkan laporan bulanan.
- Tambahkan grafik pemasukan dan pengeluaran.
- Tambahkan export CSV/PDF.
- Tambahkan backup ke database seperti Supabase atau Firebase.
