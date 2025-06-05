
import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { Transaction, TransactionType, FilterOptions, TransactionCategory, CategoryInfo } from "../types";
import { useSupabaseTransactions } from "@/hooks/useSupabaseTransactions";
import { useSupabaseCategories } from "@/hooks/useSupabaseCategories";

interface TransactionContextType {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<Transaction>;
  updateTransaction: (transaction: Transaction) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  filterTransactions: (options: FilterOptions) => void;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  updateCategoryInfo: (category: TransactionCategory, info: CategoryInfo) => Promise<void>;
  categoryInfo: Record<TransactionCategory, CategoryInfo>;
  loading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const { 
    transactions, 
    loading: transactionsLoading,
    addTransaction: addTransactionDB,
    updateTransaction: updateTransactionDB,
    deleteTransaction: deleteTransactionDB
  } = useSupabaseTransactions();
  
  const { 
    categoryInfo, 
    loading: categoriesLoading,
    updateCategoryInfo: updateCategoryInfoDB 
  } = useSupabaseCategories();
  
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

  const loading = transactionsLoading || categoriesLoading;

  // Calculate totals
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance };
  }, [transactions]);

  const applyFilters = (options: FilterOptions) => {
    let result = [...transactions];
    
    if (options.type) {
      result = result.filter(t => t.type === options.type);
    }
    
    if (options.category) {
      result = result.filter(t => t.category === options.category);
    }
    
    if (options.startDate) {
      result = result.filter(t => new Date(t.date) >= new Date(options.startDate!));
    }
    
    if (options.endDate) {
      result = result.filter(t => new Date(t.date) <= new Date(options.endDate!));
    }
    
    if (options.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      result = result.filter(t => {
        const categoryLabel = categoryInfo[t.category]?.label.toLowerCase() || t.category.toLowerCase();
        return t.description.toLowerCase().includes(term) || categoryLabel.includes(term);
      });
    }
    
    setFilteredTransactions(result);
  };

  const filterTransactions = (options: FilterOptions) => {
    setFilterOptions(options);
    applyFilters(options);
  };

  // Apply current filters when transactions or categories change
  useEffect(() => {
    applyFilters(filterOptions);
  }, [transactions, categoryInfo, filterOptions]);

  const value = {
    transactions,
    filteredTransactions,
    addTransaction: addTransactionDB,
    updateTransaction: updateTransactionDB,
    deleteTransaction: deleteTransactionDB,
    filterTransactions,
    filterOptions,
    setFilterOptions,
    totalIncome,
    totalExpense,
    balance,
    updateCategoryInfo: updateCategoryInfoDB,
    categoryInfo,
    loading
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
