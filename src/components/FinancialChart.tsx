
import { useTransactions } from "@/contexts/TransactionContext";
import { Transaction, TransactionCategory } from "@/types";
import { categoryInfo } from "./CategoryLabel";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ChartProps {
  type: "expense" | "income";
}

const FinancialChart = ({ type }: ChartProps) => {
  const { filteredTransactions } = useTransactions();

  // Filter transactions by type
  const transactions = filteredTransactions.filter(
    (transaction) => transaction.type === type
  );

  // Calculate total for each category
  const categoryTotals: Record<string, number> = {};
  transactions.forEach((transaction) => {
    const { category, amount } = transaction;
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    categoryTotals[category] += amount;
  });

  // Prepare data for pie chart
  const pieData = Object.entries(categoryTotals).map(([category, amount]) => {
    const { label, color } = categoryInfo[category as TransactionCategory];
    return {
      name: label,
      value: amount,
      color: color.replace("bg-", ""),
    };
  });

  // Calculate monthly data for bar chart
  const getMonthlyData = () => {
    const monthlyData: Record<string, Record<string, number>> = {};
    
    // Get last 6 months
    const today = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today);
      month.setMonth(today.getMonth() - i);
      const monthYear = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      months.push(monthYear);
      monthlyData[monthYear] = {};
    }
    
    // Group transactions by month and category
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (months.includes(monthYear)) {
        const { category, amount } = transaction;
        const { label } = categoryInfo[category as TransactionCategory];
        
        if (!monthlyData[monthYear][label]) {
          monthlyData[monthYear][label] = 0;
        }
        
        monthlyData[monthYear][label] += amount;
      }
    });
    
    // Convert to array format for recharts
    return months.map((month) => {
      return {
        month,
        ...monthlyData[month],
      };
    });
  };

  // Get colors for the bar chart
  const getBarColors = () => {
    const uniqueCategories = [...new Set(transactions.map((t) => t.category))];
    return uniqueCategories.map((category) => {
      const { color } = categoryInfo[category as TransactionCategory];
      // Convert Tailwind color classes to hex or RGB
      // This is a simple mapping, you may want to improve it
      const colorMap: Record<string, string> = {
        "bg-green-500": "#22C55E",
        "bg-blue-500": "#3B82F6", 
        "bg-purple-500": "#A855F7",
        "bg-teal-500": "#14B8A6",
        "bg-amber-500": "#F59E0B",
        "bg-indigo-500": "#6366F1",
        "bg-pink-500": "#EC4899",
        "bg-cyan-500": "#06B6D4",
        "bg-violet-500": "#8B5CF6",
        "bg-fuchsia-500": "#D946EF",
        "bg-rose-500": "#F43F5E",
        "bg-lime-500": "#84CC16",
        "bg-slate-500": "#64748B"
      };
      
      return colorMap[color] || "#64748B";
    });
  };

  const monthlyData = getMonthlyData();
  const barColors = getBarColors();

  // Get all unique categories that have data
  const uniqueCategories = [...new Set(transactions.map((t) => {
    const { label } = categoryInfo[t.category as TransactionCategory];
    return label;
  }))];

  // Get nicer colors for pie chart
  const COLORS = [
    "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51", "#264653",
    "#8ECAE6", "#219EBC", "#023047", "#FFB703", "#FB8500",
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        {type === "expense" ? "Expense" : "Income"} Breakdown
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="h-64">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    value,
                    index,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#fff"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        fontSize={12}
                      >
                        {pieData[index].name} ({Math.round((value / transactions.reduce((sum, t) => sum + t.amount, 0)) * 100)}%)
                      </text>
                    );
                  }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="h-64">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis />
                <Tooltip />
                <Legend />
                {uniqueCategories.map((category, index) => (
                  <Bar key={category} dataKey={category} fill={barColors[index % barColors.length]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;
