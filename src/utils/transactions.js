export const parseAmount = (value) => Number(value.replace(/[^\d]/g, ''));

export const createTransaction = ({
  type,
  amount,
  category,
  wallet,
  date,
  note,
}) => ({
  id: `${Date.now()}`,
  type,
  amount,
  category,
  wallet,
  date,
  note: note.trim() || 'Tanpa catatan',
  createdAt: new Date().toISOString(),
});

export const getDailyTransactions = (transactions, selectedDate) =>
  transactions
    .filter((transaction) => transaction.date === selectedDate)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const getMonthlyTransactions = (transactions, selectedDate) => {
  const monthKey = selectedDate.slice(0, 7);

  return transactions
    .filter((transaction) => transaction.date.startsWith(monthKey))
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
};

export const getPreviousMonthTransactions = (transactions, selectedDate) => {
  const selectedMonth = new Date(`${selectedDate}T00:00:00`);
  selectedMonth.setMonth(selectedMonth.getMonth() - 1);
  const previousMonthKey = selectedMonth.toISOString().slice(0, 7);

  return transactions
    .filter((transaction) => transaction.date.startsWith(previousMonthKey))
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
};

export const getAvailableTransactionMonths = (transactions, selectedDate) => {
  const selectedMonth = selectedDate.slice(0, 7);
  const monthSet = new Set([
    selectedMonth,
    ...transactions.map((transaction) => transaction.date.slice(0, 7)),
  ]);

  return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
};

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

export const getWalletTotals = (transactions) =>
  transactions.reduce((totals, transaction) => {
    const walletName = transaction.wallet || 'Tunai';

    if (!totals[walletName]) {
      totals[walletName] = 0;
    }

    if (transaction.type === 'income') {
      totals[walletName] += transaction.amount;
    } else {
      totals[walletName] -= transaction.amount;
    }

    return totals;
  }, {});

const isValidDateKey = (dateKey) =>
  /^\d{4}-\d{2}-\d{2}$/.test(dateKey) &&
  !Number.isNaN(new Date(`${dateKey}T00:00:00`).getTime());

const emptyChartData = () => ({
  labels: [],
  datasets: [
    {
      data: [0],
    },
  ],
});

const getDailyExpenseChartData = (transactions, selectedDate) => {
  const dailyExpenses = transactions.filter(
    (item) => item.date === selectedDate && item.type === 'expense'
  );
  const categoryTotals = dailyExpenses.reduce((totals, item) => {
    totals[item.category] = (totals[item.category] || 0) + item.amount;
    return totals;
  }, {});
  const labels = Object.keys(categoryTotals);

  if (labels.length === 0) {
    return emptyChartData();
  }

  return {
    labels,
    datasets: [
      {
        data: labels.map((label) => categoryTotals[label]),
      },
    ],
  };
};

const getWeeklyExpenseChartData = (transactions, selectedDate) => {
  const endDate = new Date(`${selectedDate}T00:00:00`);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (6 - index));
    return date.toISOString().slice(0, 10);
  });

  return {
    labels: days.map((date) => date.slice(5)),
    datasets: [
      {
        data: days.map((date) =>
          transactions
            .filter((item) => item.date === date && item.type === 'expense')
            .reduce((total, item) => total + item.amount, 0)
        ),
      },
    ],
  };
};

const getMonthlyExpenseChartData = (transactions, selectedDate) => {
  const monthKey = selectedDate.slice(0, 7);
  const [year, month] = monthKey.split('-').map(Number);
  const totalDays = new Date(year, month, 0).getDate();
  const weekRanges = [
    { label: 'M1', start: 1, end: 7 },
    { label: 'M2', start: 8, end: 14 },
    { label: 'M3', start: 15, end: 21 },
    { label: 'M4', start: 22, end: 28 },
    { label: 'M5', start: 29, end: totalDays },
  ].filter((week) => week.start <= totalDays);

  return {
    labels: weekRanges.map((week) => week.label),
    datasets: [
      {
        data: weekRanges.map((week) =>
          transactions
            .filter((item) => {
              if (!item.date.startsWith(monthKey) || item.type !== 'expense') {
                return false;
              }

              const day = Number(item.date.slice(8, 10));
              return day >= week.start && day <= week.end;
            })
            .reduce((total, item) => total + item.amount, 0)
        ),
      },
    ],
  };
};

export const getExpenseChartData = (transactions, selectedDate, period) => {
  if (!isValidDateKey(selectedDate)) {
    return {
      labels: [],
      datasets: [
        {
          data: [0],
        },
      ],
    };
  }

  if (period === 'daily') {
    return getDailyExpenseChartData(transactions, selectedDate);
  }

  if (period === 'monthly') {
    return getMonthlyExpenseChartData(transactions, selectedDate);
  }

  return getWeeklyExpenseChartData(transactions, selectedDate);
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

export const getRangeExportTransactions = (transactions, startDate, endDate) => {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  return transactions
    .filter((transaction) => {
      const transactionDate = new Date(`${transaction.date}T00:00:00`);
      return transactionDate >= start && transactionDate <= end;
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
};
