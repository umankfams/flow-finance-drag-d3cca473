
import { useTransactions } from "@/contexts/TransactionContext";
import { formatCurrency } from "@/lib/utils";
import { ArrowDown, ArrowUp, DollarSign, Loader2 } from "lucide-react";

const DashboardSummary = () => {
  const { totalIncome, totalExpense, balance, loading } = useTransactions();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 p-6 rounded-xl shadow-sm flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ))}
      </div>
    );
  }

  const summaryItems = [
    {
      title: "Saldo Total",
      value: balance,
      icon: <DollarSign className="text-finance-darkblue" />,
      color: "bg-finance-lightblue",
      textColor: balance >= 0 ? "text-green-600" : "text-red-600",
    },
    {
      title: "Total Pemasukan",
      value: totalIncome,
      icon: <ArrowUp className="text-green-600" />,
      color: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Pengeluaran",
      value: totalExpense,
      icon: <ArrowDown className="text-secondary" />,
      color: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {summaryItems.map(({ title, value, icon, color, textColor }) => (
        <div
          key={title}
          className={`${color} p-6 rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden`}
        >
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-2xl font-bold ${textColor} mt-1`}>
              {formatCurrency(value)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white bg-opacity-40 flex items-center justify-center">
            {icon}
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white bg-opacity-10" />
        </div>
      ))}
    </div>
  );
};

export default DashboardSummary;
