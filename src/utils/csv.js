const csvHeaders = ['Tanggal', 'Tipe', 'Wallet', 'Kategori', 'Catatan', 'Nominal'];

const escapeCsvValue = (value) => {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
};

export const transactionsToCsv = (transactions) => {
  const rows = transactions.map((transaction) => [
    transaction.date,
    transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    transaction.wallet || 'Tunai',
    transaction.category,
    transaction.note,
    transaction.amount,
  ]);

  return [csvHeaders, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n');
};
