export const parseAmount = (value) => Number(value.replace(/[^\d]/g, ''));

export const createTransaction = ({ type, amount, category, date, note }) => ({
  id: `${Date.now()}`,
  type,
  amount,
  category,
  date,
  note: note.trim() || 'Tanpa catatan',
  createdAt: new Date().toISOString(),
});

export const getDailyTransactions = (transactions, selectedDate) =>
  transactions
    .filter((transaction) => transaction.date === selectedDate)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const getTransactionTotals = (transactions) =>
  transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'income') {
        summary.income += transaction.amount;
      } else {
        summary.expense += transaction.amount;
      }

      summary.balance = summary.income - summary.expense;
      return summary;
    },
    { income: 0, expense: 0, balance: 0 }
  );
