
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Transaction, TransactionType, FilterOptions, TransactionCategory, CategoryInfo } from "../types";
import { useToast } from "@/hooks/use-toast";
import { categoryInfo as defaultCategoryInfo } from "@/components/CategoryLabel";

interface TransactionContextType {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  filterTransactions: (options: FilterOptions) => void;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  updateCategoryInfo: (category: TransactionCategory, info: CategoryInfo) => void;
  categoryInfo: Record<TransactionCategory, CategoryInfo>;
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
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Initialize with some sample data
    const sampleData: Transaction[] = [
      {
        id: "1",
        description: "Gaji Bulanan",
        amount: 5000000,
        date: "2025-05-10",
        type: "income",
        category: "salary"
      },
      {
        id: "2",
        description: "Belanja Bulanan",
        amount: 1500000,
        date: "2025-05-12",
        type: "expense",
        category: "food"
      },
      {
        id: "3",
        description: "Sewa Apartemen",
        amount: 2500000,
        date: "2025-05-05",
        type: "expense",
        category: "housing"
      },
      {
        id: "4",
        description: "Dividen Investasi",
        amount: 750000,
        date: "2025-05-08",
        type: "income",
        category: "investment"
      }
    ];
    
    const savedData = localStorage.getItem("transactions");
    return savedData ? JSON.parse(savedData) : sampleData;
  });
  
  // Load category info from localStorage or use default
  const [categoryInfo, setCategoryInfo] = useState<Record<TransactionCategory, CategoryInfo>>(() => {
    const savedCategoryInfo = localStorage.getItem("categoryInfo");
    return savedCategoryInfo ? JSON.parse(savedCategoryInfo) : defaultCategoryInfo;
  });
  
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpense;

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    // Apply current filters when transactions change
    applyFilters(filterOptions);
  }, [transactions]);

  // Save category info to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("categoryInfo", JSON.stringify(categoryInfo));
  }, [categoryInfo]);

  const addTransaction = (transactionData: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString()
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    
    toast({
      title: "Transaksi ditambahkan",
      description: `${transactionData.description} senilai ${transactionData.amount} berhasil ditambahkan.`
    });
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === transaction.id ? transaction : t)
    );
    
    toast({
      title: "Transaksi diperbarui",
      description: `${transaction.description} berhasil diperbarui.`
    });
  };

  const deleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    if (transactionToDelete) {
      toast({
        title: "Transaksi dihapus",
        description: `${transactionToDelete.description} berhasil dihapus.`
      });
    }
  };

  const updateCategoryInfo = (category: TransactionCategory, info: CategoryInfo) => {
    setCategoryInfo(prev => ({
      ...prev,
      [category]: info
    }));
  };

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

  const value = {
    transactions,
    filteredTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    filterTransactions,
    filterOptions,
    setFilterOptions,
    totalIncome,
    totalExpense,
    balance,
    updateCategoryInfo,
    categoryInfo
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
