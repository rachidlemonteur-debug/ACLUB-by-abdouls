import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/firebaseService';
import { toast } from 'sonner';

export function CategoriesManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const catsData = await getCategories();
      setCategories(catsData || []);
    } catch (error: any) {
      toast.error("Erreur de chargement des catégories: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, slug: cat.slug });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success("Catégorie mise à jour");
      } else {
        await createCategory(formData);
        toast.success("Catégorie créée");
      }
      closeModal();
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        await deleteCategory(id);
        toast.success("Catégorie supprimée");
        loadData();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-black mb-2">Gestion des Catégories</h1>
          <p className="text-neutral-500 text-sm">Gérez les catégories de votre catalogue.</p>
        </div>
        <Button size="sm" className="gap-2" onClick={openAddModal}>
          <Plus className="w-4 h-4" />
          Nouvelle Catégorie
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-xs font-semibold border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {categories.map((cat: any) => (
              <tr key={cat.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 font-medium text-black">{cat.name}</td>
                <td className="px-6 py-4 text-neutral-500">{cat.slug}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => openEditModal(cat)}
                    className="text-neutral-400 hover:text-black p-2 transition-colors inline-block"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="text-neutral-400 hover:text-red-600 p-2 transition-colors inline-block ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-neutral-500">
                  Aucune catégorie trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start overflow-y-auto pt-10 pb-10 px-4">
          <div className="bg-white max-w-md w-full rounded-xl shadow-2xl relative my-auto">
            <div className="flex justify-between items-center p-6 border-b border-neutral-100">
              <h2 className="text-xl font-display font-semibold text-black">
                {editingCategory ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
              </h2>
              <button onClick={closeModal} className="text-neutral-400 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">Nom *</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name || ''} 
                    onChange={handleChange}
                    placeholder="Ex: Mode"
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:border-black" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">Slug *</label>
                  <input 
                    type="text" 
                    name="slug" 
                    required 
                    value={formData.slug || ''} 
                    onChange={handleChange}
                    placeholder="Ex: mode"
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:border-black" 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Annuler
                </Button>
                <Button type="submit" variant="default">
                  {editingCategory ? 'Enregistrer' : 'Créer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
