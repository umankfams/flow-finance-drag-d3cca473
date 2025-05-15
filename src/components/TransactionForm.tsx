
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Transaction, TransactionCategory, TransactionType } from "@/types";
import { useTransactions } from "@/contexts/TransactionContext";
import { categoryInfo } from "./CategoryLabel";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface TransactionFormProps {
  onComplete?: () => void;
  initialData?: Transaction;
}

const TransactionForm = ({ onComplete, initialData }: TransactionFormProps) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const isEditing = !!initialData;

  const [description, setDescription] = useState(initialData?.description || "");
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
  const [date, setDate] = useState<Date>(
    initialData?.date ? new Date(initialData.date) : new Date()
  );
  const [type, setType] = useState<TransactionType>(
    initialData?.type || "expense"
  );
  const [category, setCategory] = useState<TransactionCategory>(
    initialData?.category || "other-expense"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      description,
      amount: parseFloat(amount),
      date: format(date, "yyyy-MM-dd"),
      type,
      category,
    };

    if (isEditing && initialData) {
      updateTransaction({ ...transactionData, id: initialData.id });
    } else {
      addTransaction(transactionData);
    }

    if (onComplete) {
      onComplete();
    }
  };

  // Filter categories based on the selected type
  const filteredCategories = Object.entries(categoryInfo).filter(([key]) => {
    if (type === "income") {
      return key.includes("income") || key === "salary" || key === "investment" || key === "gift";
    } else {
      return !(key.includes("income") || key === "salary" || key === "investment" || key === "gift");
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Enter transaction description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1">
        <Label>Type</Label>
        <RadioGroup
          defaultValue={type}
          onValueChange={(value) => setType(value as TransactionType)}
          className="flex space-x-1"
        >
          <div className="flex items-center space-x-2 rounded-md border p-2 flex-1">
            <RadioGroupItem value="expense" id="expense" />
            <Label htmlFor="expense" className="cursor-pointer flex-1">
              Expense
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-2 flex-1">
            <RadioGroupItem value="income" id="income" />
            <Label htmlFor="income" className="cursor-pointer flex-1">
              Income
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-1">
        <Label htmlFor="category">Category</Label>
        <Select
          defaultValue={category}
          onValueChange={(value) => setCategory(value as TransactionCategory)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map(([key, { label, icon }]) => (
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

      <Button type="submit" className="w-full">
        {isEditing ? "Update" : "Add"} Transaction
      </Button>
    </form>
  );
};

export default TransactionForm;
