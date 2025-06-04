
import { TransactionCategory, CategoryInfo } from "@/types";
import { useTransactions } from "@/contexts/TransactionContext";

// Default category info yang akan digunakan sebagai fallback
export const categoryInfo: Record<TransactionCategory, CategoryInfo> = {
  // Income categories
  "salary": { 
    label: "Gaji", 
    color: "bg-green-500", 
    icon: "💼" 
  },
  "investment": { 
    label: "Investasi", 
    color: "bg-blue-500", 
    icon: "📈" 
  },
  "gift": { 
    label: "Hadiah", 
    color: "bg-purple-500", 
    icon: "🎁" 
  },
  "other-income": { 
    label: "Pendapatan Lain", 
    color: "bg-teal-500", 
    icon: "💰" 
  },
  
  // Expense categories
  "food": { 
    label: "Makanan & Minuman", 
    color: "bg-amber-500", 
    icon: "🍔" 
  },
  "transportation": { 
    label: "Transportasi", 
    color: "bg-indigo-500", 
    icon: "🚗" 
  },
  "housing": { 
    label: "Perumahan", 
    color: "bg-pink-500", 
    icon: "🏠" 
  },
  "utilities": { 
    label: "Utilitas", 
    color: "bg-cyan-500", 
    icon: "💡" 
  },
  "entertainment": { 
    label: "Hiburan", 
    color: "bg-violet-500", 
    icon: "🎬" 
  },
  "shopping": { 
    label: "Belanja", 
    color: "bg-fuchsia-500", 
    icon: "🛍️" 
  },
  "health": { 
    label: "Kesehatan", 
    color: "bg-rose-500", 
    icon: "🏥" 
  },
  "education": { 
    label: "Pendidikan", 
    color: "bg-lime-500", 
    icon: "📚" 
  },
  "other-expense": { 
    label: "Pengeluaran Lain", 
    color: "bg-slate-500", 
    icon: "📝" 
  }
};

interface CategoryLabelProps {
  category: TransactionCategory;
  showIcon?: boolean;
}

const CategoryLabel = ({ category, showIcon = true }: CategoryLabelProps) => {
  const { categoryInfo: contextCategoryInfo } = useTransactions();
  
  // Gunakan kategori dari context jika ada, atau gunakan default
  const info = contextCategoryInfo[category] || categoryInfo[category as TransactionCategory] || {
    label: category,
    color: "bg-gray-500",
    icon: "🏷️"
  };
  
  const { label, color, icon } = info;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${color}`}>
      {showIcon && <span>{icon}</span>}
      {label}
    </span>
  );
};

export default CategoryLabel;
