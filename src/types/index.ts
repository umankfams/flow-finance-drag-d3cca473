
export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  // Income categories
  | 'salary' 
  | 'investment' 
  | 'gift' 
  | 'other-income'
  // Expense categories
  | 'food' 
  | 'transportation' 
  | 'housing'
  | 'utilities'
  | 'entertainment'
  | 'shopping'
  | 'health'
  | 'education'
  | 'other-expense'
  // Allow for dynamic categories
  | string;

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
}

export type FilterOptions = {
  type?: TransactionType;
  category?: TransactionCategory;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
};

export interface CategoryInfo {
  label: string;
  color: string;
  icon: string;
}
