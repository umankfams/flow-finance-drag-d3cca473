
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Transaction, TransactionType, FilterOptions, TransactionCategory } from "../types";
import { useToast } from "@/hooks/use-toast";

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
        description: "Salary",
        amount: 5000,
        date: "2025-05-10",
        type: "income",
        category: "salary"
      },
      {
        id: "2",
        description: "Groceries",
        amount: 150,
        date: "2025-05-12",
        type: "expense",
        category: "food"
      },
      {
        id: "3",
        description: "Rent",
        amount: 1200,
        date: "2025-05-05",
        type: "expense",
        category: "housing"
      },
      {
        id: "4",
        description: "Investment return",
        amount: 300,
        date: "2025-05-08",
        type: "income",
        category: "investment"
      }
    ];
    
    const savedData = localStorage.getItem("transactions");
    return savedData ? JSON.parse(savedData) : sampleData;
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

  const addTransaction = (transactionData: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString()
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    
    toast({
      title: "Transaction added",
      description: `${transactionData.description} for ${transactionData.amount} added successfully.`
    });
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === transaction.id ? transaction : t)
    );
    
    toast({
      title: "Transaction updated",
      description: `${transaction.description} updated successfully.`
    });
  };

  const deleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    if (transactionToDelete) {
      toast({
        title: "Transaction deleted",
        description: `${transactionToDelete.description} deleted successfully.`
      });
    }
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
      result = result.filter(t => 
        t.description.toLowerCase().includes(term) || 
        t.category.toLowerCase().includes(term)
      );
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
    balance
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
