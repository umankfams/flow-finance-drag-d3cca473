
import { TransactionCategory, CategoryInfo } from "@/types";

const categoryInfo: Record<TransactionCategory, CategoryInfo> = {
  // Income categories
  "salary": { 
    label: "Salary", 
    color: "bg-green-500", 
    icon: "💼" 
  },
  "investment": { 
    label: "Investment", 
    color: "bg-blue-500", 
    icon: "📈" 
  },
  "gift": { 
    label: "Gift", 
    color: "bg-purple-500", 
    icon: "🎁" 
  },
  "other-income": { 
    label: "Other Income", 
    color: "bg-teal-500", 
    icon: "💰" 
  },
  
  // Expense categories
  "food": { 
    label: "Food & Dining", 
    color: "bg-amber-500", 
    icon: "🍔" 
  },
  "transportation": { 
    label: "Transportation", 
    color: "bg-indigo-500", 
    icon: "🚗" 
  },
  "housing": { 
    label: "Housing", 
    color: "bg-pink-500", 
    icon: "🏠" 
  },
  "utilities": { 
    label: "Utilities", 
    color: "bg-cyan-500", 
    icon: "💡" 
  },
  "entertainment": { 
    label: "Entertainment", 
    color: "bg-violet-500", 
    icon: "🎬" 
  },
  "shopping": { 
    label: "Shopping", 
    color: "bg-fuchsia-500", 
    icon: "🛍️" 
  },
  "health": { 
    label: "Health", 
    color: "bg-rose-500", 
    icon: "🏥" 
  },
  "education": { 
    label: "Education", 
    color: "bg-lime-500", 
    icon: "📚" 
  },
  "other-expense": { 
    label: "Other Expense", 
    color: "bg-slate-500", 
    icon: "📝" 
  }
};

interface CategoryLabelProps {
  category: TransactionCategory;
  showIcon?: boolean;
}

const CategoryLabel = ({ category, showIcon = true }: CategoryLabelProps) => {
  const { label, color, icon } = categoryInfo[category];
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${color}`}>
      {showIcon && <span>{icon}</span>}
      {label}
    </span>
  );
};

export default CategoryLabel;
export { categoryInfo };
