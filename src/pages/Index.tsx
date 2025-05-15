
import { TransactionProvider } from "@/contexts/TransactionContext";
import DashboardSummary from "@/components/DashboardSummary";
import TransactionList from "@/components/TransactionList";
import FinancialChart from "@/components/FinancialChart";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionForm from "@/components/TransactionForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Filter } from "lucide-react";

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <TransactionProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-finance-teal text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold">Pencatat Keuangan</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  asChild
                  className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                >
                  <Link to="/categories">
                    <Filter className="h-4 w-4 mr-2" /> Kelola Kategori
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsFormOpen(true)}
                  className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" /> Tambah Transaksi
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-6">
          <DashboardSummary />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FinancialChart type="expense" />
            </div>
            <div className="space-y-6">
              <FinancialChart type="income" />
            </div>
          </div>
          
          <TransactionList />
        </main>

        <footer className="bg-white border-t py-4">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Pencatat Keuangan. Seluruh hak cipta dilindungi.
            </p>
          </div>
        </footer>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Transaksi Baru</DialogTitle>
            </DialogHeader>
            <TransactionForm onComplete={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </TransactionProvider>
  );
};

export default Index;
