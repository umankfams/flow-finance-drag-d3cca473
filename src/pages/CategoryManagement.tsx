
import { useState } from "react";
import { useTransactions } from "@/contexts/TransactionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryInfo, TransactionCategory } from "@/types";
import { categoryInfo } from "@/components/CategoryLabel";
import { Edit, Plus, Save, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CategoryManagement = () => {
  const { toast } = useToast();
  const { updateCategoryInfo } = useTransactions();
  const [activeTab, setActiveTab] = useState<"income" | "expense">("expense");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id: "",
    label: "",
    color: "bg-slate-500",
    icon: "📝",
  });

  // Group categories by type
  const incomeCategories = Object.entries(categoryInfo).filter(
    ([key]) => 
      key.includes("income") || 
      key === "salary" || 
      key === "investment" || 
      key === "gift"
  );
  
  const expenseCategories = Object.entries(categoryInfo).filter(
    ([key]) => 
      !(key.includes("income") || key === "salary" || key === "investment" || key === "gift")
  );

  const [editedCategories, setEditedCategories] = useState<Record<string, CategoryInfo>>({});

  const handleEditCategory = (categoryKey: string) => {
    setEditingCategory(categoryKey);
    setEditedCategories({
      ...editedCategories,
      [categoryKey]: { ...categoryInfo[categoryKey as TransactionCategory] }
    });
  };

  const handleSaveCategory = (categoryKey: string) => {
    if (editedCategories[categoryKey]) {
      updateCategoryInfo(categoryKey as TransactionCategory, editedCategories[categoryKey]);
      setEditingCategory(null);
      toast({
        title: "Kategori diperbarui",
        description: `Kategori ${editedCategories[categoryKey].label} berhasil diperbarui.`
      });
    }
  };

  const handleUpdateCategoryField = (categoryKey: string, field: keyof CategoryInfo, value: string) => {
    setEditedCategories({
      ...editedCategories,
      [categoryKey]: {
        ...editedCategories[categoryKey],
        [field]: value
      }
    });
  };

  const handleAddCategory = () => {
    if (newCategory.id && newCategory.label) {
      const categoryId = newCategory.id as TransactionCategory;
      updateCategoryInfo(categoryId, {
        label: newCategory.label,
        color: newCategory.color,
        icon: newCategory.icon
      });
      
      setIsAddDialogOpen(false);
      setNewCategory({
        id: "",
        label: "",
        color: "bg-slate-500",
        icon: "📝",
      });
      
      toast({
        title: "Kategori ditambahkan",
        description: `Kategori ${newCategory.label} berhasil ditambahkan.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-finance-teal text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold">Manajemen Kategori</h1>
            <Button 
              variant="outline"
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Tambah Kategori
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <Tabs defaultValue="expense" onValueChange={(v) => setActiveTab(v as "income" | "expense")}>
            <TabsList className="mb-4">
              <TabsTrigger value="expense">Kategori Pengeluaran</TabsTrigger>
              <TabsTrigger value="income">Kategori Pemasukan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="expense" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expenseCategories.map(([key, info]) => (
                  <div key={key} className="border rounded-lg p-4 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{info.icon}</span>
                        {editingCategory === key ? (
                          <Input 
                            value={editedCategories[key]?.label || ""}
                            onChange={(e) => handleUpdateCategoryField(key, "label", e.target.value)}
                            className="h-8 w-40"
                          />
                        ) : (
                          <h3 className="font-medium">{info.label}</h3>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {editingCategory === key ? (
                          <Button size="sm" onClick={() => handleSaveCategory(key)} variant="outline">
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleEditCategory(key)} variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`inline-block w-6 h-6 rounded-full ${info.color}`}></span>
                      {editingCategory === key && (
                        <select 
                          className="text-sm border rounded p-1"
                          value={editedCategories[key]?.color || info.color}
                          onChange={(e) => handleUpdateCategoryField(key, "color", e.target.value)}
                        >
                          <option value="bg-slate-500">Abu-abu</option>
                          <option value="bg-red-500">Merah</option>
                          <option value="bg-amber-500">Oranye</option>
                          <option value="bg-yellow-500">Kuning</option>
                          <option value="bg-green-500">Hijau</option>
                          <option value="bg-blue-500">Biru</option>
                          <option value="bg-purple-500">Ungu</option>
                          <option value="bg-pink-500">Merah Muda</option>
                          <option value="bg-cyan-500">Biru Muda</option>
                        </select>
                      )}
                    </div>
                    
                    {editingCategory === key && (
                      <div className="mt-2">
                        <label className="text-sm text-gray-500">Icon:</label>
                        <Input 
                          value={editedCategories[key]?.icon || ""}
                          onChange={(e) => handleUpdateCategoryField(key, "icon", e.target.value)}
                          className="h-8 mt-1"
                          placeholder="Emoji icon"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="income" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {incomeCategories.map(([key, info]) => (
                  <div key={key} className="border rounded-lg p-4 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{info.icon}</span>
                        {editingCategory === key ? (
                          <Input 
                            value={editedCategories[key]?.label || ""}
                            onChange={(e) => handleUpdateCategoryField(key, "label", e.target.value)}
                            className="h-8 w-40"
                          />
                        ) : (
                          <h3 className="font-medium">{info.label}</h3>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {editingCategory === key ? (
                          <Button size="sm" onClick={() => handleSaveCategory(key)} variant="outline">
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleEditCategory(key)} variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`inline-block w-6 h-6 rounded-full ${info.color}`}></span>
                      {editingCategory === key && (
                        <select 
                          className="text-sm border rounded p-1"
                          value={editedCategories[key]?.color || info.color}
                          onChange={(e) => handleUpdateCategoryField(key, "color", e.target.value)}
                        >
                          <option value="bg-slate-500">Abu-abu</option>
                          <option value="bg-red-500">Merah</option>
                          <option value="bg-amber-500">Oranye</option>
                          <option value="bg-yellow-500">Kuning</option>
                          <option value="bg-green-500">Hijau</option>
                          <option value="bg-blue-500">Biru</option>
                          <option value="bg-purple-500">Ungu</option>
                          <option value="bg-pink-500">Merah Muda</option>
                          <option value="bg-cyan-500">Biru Muda</option>
                        </select>
                      )}
                    </div>
                    
                    {editingCategory === key && (
                      <div className="mt-2">
                        <label className="text-sm text-gray-500">Icon:</label>
                        <Input 
                          value={editedCategories[key]?.icon || ""}
                          onChange={(e) => handleUpdateCategoryField(key, "icon", e.target.value)}
                          className="h-8 mt-1"
                          placeholder="Emoji icon"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Dialog for adding new category */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium">Tipe</label>
              <div className="flex mt-1 space-x-2">
                <Button
                  type="button"
                  variant={newCategory.id.includes("expense") || !newCategory.id.includes("income") ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setNewCategory({...newCategory, id: "other-expense"})}
                >
                  Pengeluaran
                </Button>
                <Button
                  type="button"
                  variant={newCategory.id.includes("income") ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setNewCategory({...newCategory, id: "other-income"})}
                >
                  Pemasukan
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">ID Kategori</label>
              <Input 
                className="mt-1"
                placeholder="contoh: food-delivery"
                value={newCategory.id}
                onChange={(e) => setNewCategory({...newCategory, id: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">Gunakan huruf kecil, tanpa spasi dan tanda baca</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Nama Kategori</label>
              <Input 
                className="mt-1"
                placeholder="contoh: Makanan Pesan Antar"
                value={newCategory.label}
                onChange={(e) => setNewCategory({...newCategory, label: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Warna</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={newCategory.color}
                onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
              >
                <option value="bg-slate-500">Abu-abu</option>
                <option value="bg-red-500">Merah</option>
                <option value="bg-amber-500">Oranye</option>
                <option value="bg-yellow-500">Kuning</option>
                <option value="bg-green-500">Hijau</option>
                <option value="bg-blue-500">Biru</option>
                <option value="bg-purple-500">Ungu</option>
                <option value="bg-pink-500">Merah Muda</option>
                <option value="bg-cyan-500">Biru Muda</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Icon (emoji)</label>
              <Input 
                className="mt-1"
                placeholder="contoh: 🍔"
                value={newCategory.icon}
                onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
              />
            </div>
            
            <Button className="w-full" onClick={handleAddCategory}>
              Tambah Kategori
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
