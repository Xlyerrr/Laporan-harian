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

export const getDailyExpenseChartData = (transactions, selectedDate) => {
  const isValidDate =
    /^\d{4}-\d{2}-\d{2}$/.test(selectedDate) &&
    !Number.isNaN(new Date(`${selectedDate}T00:00:00`).getTime());

  if (!isValidDate) {
    return {
      labels: [],
      datasets: [
        {
          data: [0],
        },
      ],
    };
  }

  const endDate = new Date(`${selectedDate}T00:00:00`);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (6 - index));
    return date.toISOString().slice(0, 10);
  });

  const expenseData = days.map((date) =>
    transactions
      .filter((item) => item.date === date && item.type === 'expense')
      .reduce((total, item) => total + item.amount, 0)
  );

  return {
    labels: days.map((date) => date.slice(5)),
    datasets: [
      {
        data: expenseData,
      },
    ],
  };
};

export const getExportTransactions = (transactions, selectedDate, period) => {
  if (period === 'daily') {
    return transactions.filter((transaction) => transaction.date === selectedDate);
  }

  if (period === 'weekly') {
    const endDate = new Date(`${selectedDate}T00:00:00`);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);

    return transactions.filter((transaction) => {
      const transactionDate = new Date(`${transaction.date}T00:00:00`);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  if (period === 'monthly') {
    const monthKey = selectedDate.slice(0, 7);

    return transactions.filter((transaction) =>
      transaction.date.startsWith(monthKey)
    );
  }

  return [];
};
