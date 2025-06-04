
import { useState } from "react";
import { useTransactions } from "@/contexts/TransactionContext";
import TransactionCard from "./TransactionCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import TransactionForm from "./TransactionForm";
import { FilterOptions, Transaction, TransactionCategory, TransactionType } from "@/types";
import { ArrowDown, ArrowUp, Search, Plus } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { id } from 'date-fns/locale';

const TransactionList = () => {
  const { filteredTransactions, filterOptions, setFilterOptions, categoryInfo } = useTransactions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState(filterOptions.searchTerm || "");

  // For drag and drop
  const [draggedItem, setDraggedItem] = useState<Transaction | null>(null);
  
  const handleTransactionClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilterOptions((prev) => {
      const newOptions = { ...prev };
      
      if (value === "all" || value === undefined) {
        delete newOptions[key];
      } else {
        newOptions[key] = value;
      }
      
      return newOptions;
    });
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      handleFilterChange("searchTerm", value);
    } else {
      handleFilterChange("searchTerm", undefined);
    }
  };
  
  // Group transactions by date with better error handling
  const groupedTransactions: Record<string, Transaction[]> = {};
  
  filteredTransactions.forEach(transaction => {
    try {
      // Parse the date and validate it
      const date = new Date(transaction.date);
      
      // Check if the date is valid
      if (!isValid(date)) {
        console.warn(`Invalid date found in transaction ${transaction.id}: ${transaction.date}`);
        return; // Skip this transaction
      }
      
      const dateString = format(date, "EEEE, dd MMMM yyyy", { locale: id });
      
      if (!groupedTransactions[dateString]) {
        groupedTransactions[dateString] = [];
      }
      
      groupedTransactions[dateString].push(transaction);
    } catch (error) {
      console.error(`Error processing date for transaction ${transaction.id}:`, error);
      // Skip this transaction if date processing fails
    }
  });

  // Sort dates from newest to oldest with better error handling
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    try {
      // Extract the first transaction from each group to get the original date
      const transactionsA = groupedTransactions[a];
      const transactionsB = groupedTransactions[b];
      
      if (!transactionsA?.length || !transactionsB?.length) {
        return 0;
      }
      
      const dateA = new Date(transactionsA[0].date);
      const dateB = new Date(transactionsB[0].date);
      
      // Validate dates before comparing
      if (!isValid(dateA) || !isValid(dateB)) {
        console.warn('Invalid date found during sorting');
        return 0;
      }
      
      return dateB.getTime() - dateA.getTime();
    } catch (error) {
      console.error('Error sorting dates:', error);
      return 0;
    }
  });

  // Drag and drop functions
  const handleDragStart = (transaction: Transaction) => {
    setDraggedItem(transaction);
  };
  
  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Get all categories for the select dropdown
  const allCategories = Object.entries(categoryInfo);
  
  // Filter categories by type if a type filter is active
  const availableCategories = allCategories.filter(([key, info]) => {
    if (!filterOptions.type) return true;
    
    if (filterOptions.type === "income") {
      return key.includes("income") || key === "salary" || key === "investment" || key === "gift";
    } else {
      return !(key.includes("income") || key === "salary" || key === "investment" || key === "gift");
    }
  });

  return (
    <div className="space-y-4 bg-white p-5 rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Transaksi</h2>
        <Button
          size="sm"
          onClick={handleAddTransaction}
          className="bg-finance-teal hover:bg-finance-teal/90"
        >
          <Plus className="h-4 w-4 mr-1" />
          Tambah Baru
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari transaksi..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select
            value={filterOptions.type || "all"}
            onValueChange={(value) => 
              handleFilterChange("type", value !== "all" ? value as TransactionType : undefined)
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="income">
                <div className="flex items-center">
                  <ArrowUp className="mr-2 h-4 w-4 text-green-600" />
                  Pemasukan
                </div>
              </SelectItem>
              <SelectItem value="expense">
                <div className="flex items-center">
                  <ArrowDown className="mr-2 h-4 w-4 text-secondary" />
                  Pengeluaran
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterOptions.category || "all"}
            onValueChange={(value) => 
              handleFilterChange("category", value !== "all" ? value as TransactionCategory : undefined)
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">Semua Kategori</SelectItem>
              {availableCategories.map(([key, {label, icon}]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center space-x-2">
                    <span>{icon}</span>
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div 
        className={`mt-4 space-y-6 ${filteredTransactions.length ? '' : 'drop-indicator p-10 rounded-xl flex items-center justify-center'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {}}
      >
        {filteredTransactions.length ? (
          sortedDates.map(date => (
            <div key={date} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">{date}</h3>
              <div className="space-y-2">
                {groupedTransactions[date].map(transaction => (
                  <div 
                    key={transaction.id}
                    draggable
                    onDragStart={() => handleDragStart(transaction)}
                    onDragEnd={handleDragEnd}
                  >
                    <TransactionCard 
                      transaction={transaction}
                      onClick={() => handleTransactionClick(transaction)}
                      isDragging={draggedItem?.id === transaction.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm || Object.keys(filterOptions).length > 0 
                ? "Tidak ada transaksi yang cocok dengan filter Anda." 
                : "Seret dan lepas transaksi di sini."}
            </p>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm 
            onComplete={handleFormClose} 
            initialData={editingTransaction || undefined} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionList;
