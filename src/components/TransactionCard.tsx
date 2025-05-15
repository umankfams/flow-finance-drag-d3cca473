
import { Transaction } from "@/types";
import CategoryLabel from "./CategoryLabel";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
  isDragging?: boolean;
}

const TransactionCard = ({ 
  transaction, 
  onClick,
  isDragging = false
}: TransactionCardProps) => {
  const { description, amount, date, type, category } = transaction;
  
  // Format the date to a more readable format
  const formattedDate = format(new Date(date), "d MMM yyyy", { locale: id });

  return (
    <div 
      className={`transaction-card ${isDragging ? 'opacity-50' : ''} draggable-item`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{description}</h3>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        <p className={`font-semibold ${type === "income" ? "income" : "expense"}`}>
          {type === "income" ? "+" : "-"}{formatCurrency(amount)}
        </p>
      </div>
      <div className="mt-3">
        <CategoryLabel category={category} />
      </div>
    </div>
  );
};

export default TransactionCard;
