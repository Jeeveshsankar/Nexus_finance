import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFinanceStore = create(
  persist(
    (set) => ({
      transactions: [],
      filters: {
        search:   '',
        category: 'All',
        type:     'All',
        dateRange: null,
        sortBy:   'Date',
        sortDir:  'desc',
      },
      role:  'admin',
      theme: 'dark',

      addTransaction: (tx) => set((state) => ({
        transactions: [tx, ...state.transactions],
      })),

      editTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map((tx) =>
          tx.id === id ? { ...tx, ...updates } : tx
        ),
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((tx) => tx.id !== id),
      })),

      setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value },
      })),

      resetFilters: () => set(() => ({
        filters: {
          search: '', category: 'All', type: 'All',
          dateRange: null, sortBy: 'Date', sortDir: 'desc',
        },
      })),

      setRole:     (role) => set({ role }),
      toggleTheme: ()     => set((state) => ({
        theme: state.theme === 'dark' ? 'light' : 'dark',
      })),
    }),
    {
      name:       'finance-storage',
      partialize: (state) => ({ role: state.role, theme: state.theme }),
    }
  )
);

export default useFinanceStore;
