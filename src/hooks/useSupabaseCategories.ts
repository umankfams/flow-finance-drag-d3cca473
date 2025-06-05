
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TransactionCategory, CategoryInfo } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseCategories = () => {
  const [categoryInfo, setCategoryInfo] = useState<Record<TransactionCategory, CategoryInfo>>({} as Record<TransactionCategory, CategoryInfo>);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) throw error;

      const categoryMap: Record<TransactionCategory, CategoryInfo> = {} as Record<TransactionCategory, CategoryInfo>;
      
      data?.forEach(category => {
        categoryMap[category.key as TransactionCategory] = {
          label: category.label,
          color: category.color,
          icon: category.icon
        };
      });

      setCategoryInfo(categoryMap);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Gagal memuat kategori dari database.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryInfo = async (category: TransactionCategory, info: CategoryInfo) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          label: info.label,
          color: info.color,
          icon: info.icon
        })
        .eq('key', category);

      if (error) throw error;

      setCategoryInfo(prev => ({
        ...prev,
        [category]: info
      }));

      toast({
        title: "Kategori diperbarui",
        description: `Kategori ${info.label} berhasil diperbarui.`
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui kategori.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categoryInfo,
    loading,
    updateCategoryInfo,
    refetch: fetchCategories
  };
};
