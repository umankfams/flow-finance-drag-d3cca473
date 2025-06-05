
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // Convert Supabase data to Transaction type with proper casting
      const typedTransactions: Transaction[] = (data || []).map(item => ({
        id: item.id,
        description: item.description,
        amount: item.amount,
        date: item.date,
        type: item.type as 'income' | 'expense',
        category: item.category
      }));

      setTransactions(typedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Gagal memuat transaksi dari database.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) throw error;

      // Convert Supabase data to Transaction type with proper casting
      const typedTransaction: Transaction = {
        id: data.id,
        description: data.description,
        amount: data.amount,
        date: data.date,
        type: data.type as 'income' | 'expense',
        category: data.category
      };

      setTransactions(prev => [typedTransaction, ...prev]);
      
      toast({
        title: "Transaksi ditambahkan",
        description: `${transactionData.description} berhasil ditambahkan.`
      });

      return typedTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan transaksi.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          description: transaction.description,
          amount: transaction.amount,
          date: transaction.date,
          type: transaction.type,
          category: transaction.category
        })
        .eq('id', transaction.id)
        .select()
        .single();

      if (error) throw error;

      // Convert Supabase data to Transaction type with proper casting
      const typedTransaction: Transaction = {
        id: data.id,
        description: data.description,
        amount: data.amount,
        date: data.date,
        type: data.type as 'income' | 'expense',
        category: data.category
      };

      setTransactions(prev => 
        prev.map(t => t.id === transaction.id ? typedTransaction : t)
      );

      toast({
        title: "Transaksi diperbarui",
        description: `${transaction.description} berhasil diperbarui.`
      });

      return typedTransaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui transaksi.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const transactionToDelete = transactions.find(t => t.id === id);
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== id));

      if (transactionToDelete) {
        toast({
          title: "Transaksi dihapus",
          description: `${transactionToDelete.description} berhasil dihapus.`
        });
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus transaksi.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
};
