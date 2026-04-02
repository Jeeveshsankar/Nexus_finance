import { subDays } from 'date-fns';

const INCOME_CATEGORIES  = ['Salary', 'Freelance', 'Investment'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Utilities'];

const getAmount = (category) => {
  switch (category) {
    case 'Salary':      return 45000 + Math.floor(Math.random() * 10000);
    case 'Freelance':   return 10000 + Math.floor(Math.random() * 15000);
    case 'Utilities':   return 1500  + Math.floor(Math.random() * 3000);
    case 'Food':        return 200   + Math.floor(Math.random() * 600);
    case 'Transport':   return 50    + Math.floor(Math.random() * 450);
    default:            return 100   + Math.floor(Math.random() * 5000);
  }
};

export const generateMockData = (count = 50) => {
  const transactions = [];

  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() > 0.7;
    const pool     = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const category = pool[Math.floor(Math.random() * pool.length)];
    const amount   = getAmount(category);

    transactions.push({
      id:       `tx-${Date.now()}-${i}`,
      category,
      type:     isIncome ? 'income' : 'expense',
      amount,
      date:     subDays(new Date(), Math.floor(Math.random() * 180)).toISOString(),
      status:   'completed',
    });
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};
