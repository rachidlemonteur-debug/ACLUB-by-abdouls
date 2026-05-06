import React, { useState, useEffect } from 'react';
import { formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Product } from '../../types';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../services/firebaseService';
import { toast } from 'sonner';
import { ImageUpload } from '../../components/admin/ImageUpload';

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    price: 0,
    category_id: '',
    description: '',
    images: [],
    is_active: true,
    status_badge: 'Aucun',
    variants: { colors: [], sizes: [] }
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodsData, catsData] = await Promise.all([
        getProducts(true),
        getCategories()
      ]);
      setProducts(prodsData || []);
      setCategories(catsData || []);
    } catch (error: any) {
      toast.error("Erreur de chargement des données: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      slug: '',
      price: 0,
      category_id: categories.length > 0 ? categories[0].id : '',
      description: '',
      images: [],
      is_active: true,
      status_badge: 'Aucun',
      variants: { colors: [], sizes: [] }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    // Parse variants back into form format
    const sizes = product.variants?.filter((v: any) => v.name === 'Taille').map((v: any) => v.value) || [];
    const colors = product.variants?.filter((v: any) => v.name === 'Couleur').map((v: any) => v.value) || [];
    const images = product.images?.sort((a: any, b: any) => a.display_order - b.display_order).map((i: any) => i.image_url) || [];

    setFormData({ 
      title: product.title,
      slug: product.slug,
      price: product.price,
      category_id: product.category_id,
      description: product.description || '',
      images: images,
      is_active: product.is_active,
      status_badge: product.status_badge || 'Aucun',
      variants: { colors, sizes }
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      setFormData((prev: any) => ({ ...prev, [name]: Number(value) }));
    } else if (name === 'benefits') {
      const arrayValue = value.split('\n').filter(line => line.trim() !== '');
      setFormData((prev: any) => ({ ...prev, [name]: arrayValue }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const arrayValue = value.split('\n').filter(line => line.trim() !== '');
    setFormData((prev: any) => ({
      ...prev,
      variants: {
        ...prev.variants,
        [name]: arrayValue
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.price || !formData.category_id) return;

    // Transform formData to Subapase tables format
    const productData = {
      title: formData.title,
      slug: formData.slug,
      price: formData.price,
      category_id: formData.category_id,
      description: formData.description,
      is_active: formData.is_active,
      status_badge: formData.status_badge === 'Aucun' ? null : formData.status_badge
    };

    // Build variants
    const variantsList: any[] = [];
    formData.variants.sizes?.forEach((v: string) => variantsList.push({ name: 'Taille', value: v, sku: `${formData.slug}-size-${v}`, stock_quantity: 10 }));
    formData.variants.colors?.forEach((v: string) => variantsList.push({ name: 'Couleur', value: v, sku: `${formData.slug}-color-${v}`, stock_quantity: 10 }));

    // Build images
    const imagesList: any[] = formData.images?.map((url: string, idx: number) => ({
      image_url: url,
      display_order: idx + 1
    })) || [];

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData, variantsList, imagesList);
        toast.success("Produit mis à jour");
      } else {
        await createProduct(productData, variantsList, imagesList);
        toast.success("Produit créé");
      }
      closeModal();
      loadData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(id);
        toast.success("Produit supprimé");
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
          <h1 className="text-2xl font-display font-semibold text-black mb-2">Catalogue Produits</h1>
          <p className="text-neutral-500 text-sm">Gérez vos produits, offres et bundles essentiels.</p>
        </div>
        <Button size="sm" className="gap-2" onClick={openAddModal}>
          <Plus className="w-4 h-4" />
          Nouveau Produit
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-xs font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Prix</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-neutral-100 overflow-hidden shrink-0">
                        {product.images && product.images.length > 0 && (
                          <img src={product.images[0].image_url} alt={product.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-black">{product.title}</div>
                        {product.status_badge && <div className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5">{product.status_badge}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full text-xs font-medium uppercase">
                      {product.category?.name || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-black">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${product.is_active ? 'text-emerald-600' : 'text-neutral-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-emerald-500' : 'bg-neutral-400'}`}></span>
                      {product.is_active ? 'En Ligne' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="text-neutral-400 hover:text-black p-2 transition-colors inline-block"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-neutral-400 hover:text-red-600 p-2 transition-colors inline-block ml-2"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    Aucun produit dans le catalogue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start overflow-y-auto pt-10 pb-10 px-4">
          <div className="bg-white max-w-2xl w-full rounded-xl shadow-2xl relative my-auto">
            <div className="flex justify-between items-center p-6 border-b border-neutral-100">
              <h2 className="text-xl font-display font-semibold text-black">
                {editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
              </h2>
              <button onClick={closeModal} className="text-neutral-400 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">Nom du Produit *</label>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    value={formData.title || ''} 
                    onChange={handleChange}
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:border-black" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">Slug (URL) *</label>
                  <input 
                    type="text" 
                    name="slug" 
                    required 
                    value={formData.slug || ''} 
                    onChange={handleChange}
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:border-black" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">Prix (FCFA) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    required 
                    min="0"
                    value={formData.price || 0} 
                    onChange={handleChange}
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:border-black" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">Catégorie *</label>
                  <select 
                    name="category_id" 
                    required
                    value={formData.category_id || ''} 
                    onChange={handleChange}
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:border-black"
                  >
                    <option value="" disabled>Sélectionner une catégorie</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">Badge</label>
                  <select 
                    name="status_badge" 
                    value={formData.status_badge || 'Aucun'} 
                    onChange={handleChange}
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:border-black"
                  >
                    <option value="Aucun">Aucun</option>
                    <option value="PROMO">PROMO</option>
                    <option value="NOUVEAU">NOUVEAU</option>
                    <option value="RUPTURE">RUPTURE</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">Stock</label>
                  <select 
                    name="stockStatus" 
                    value={formData.stockStatus || 'Disponible'} 
                    onChange={handleChange}
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:border-black"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Peu de stock">Peu de stock</option>
                    <option value="Rupture">Rupture</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">Description</label>
                <textarea 
                  name="description" 
                  rows={3}
                  value={formData.description || ''} 
                  onChange={handleChange}
                  className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:border-black resize-none" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">Bénéfices (1 par ligne)</label>
                  <textarea 
                    name="benefits" 
                    rows={4}
                    value={formData.benefits?.join('\n') || ''} 
                    onChange={handleChange}
                    placeholder="Hydratation 24h&#10;Fini invisible"
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:border-black resize-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">Images (Drag & Drop)</label>
                  <ImageUpload 
                    images={formData.images || []}
                    onChange={(newImages) => setFormData((prev: any) => ({ ...prev, images: newImages }))} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">Couleurs (1 par ligne)</label>
                  <textarea 
                    name="colors" 
                    rows={3}
                    value={formData.variants?.colors?.join('\n') || ''} 
                    onChange={handleVariantChange}
                    placeholder="Noir&#10;Blanc"
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:border-black resize-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">Tailles (1 par ligne)</label>
                  <textarea 
                    name="sizes" 
                    rows={3}
                    value={formData.variants?.sizes?.join('\n') || ''} 
                    onChange={handleVariantChange}
                    placeholder="S&#10;M&#10;L&#10;XL"
                    className="w-full border border-neutral-200 rounded-md px-3 py-2 focus:outline-none focus:border-black resize-none" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="is_active" 
                    name="is_active"
                    checked={formData.is_active || false}
                    onChange={handleChange}
                    className="w-4 h-4 text-black focus:ring-black border-neutral-300 rounded"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-neutral-700">
                    Produit Actif (Visible en boutique)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isPopular" 
                    name="isPopular"
                    checked={formData.isPopular || false}
                    onChange={handleChange}
                    className="w-4 h-4 text-black focus:ring-black border-neutral-300 rounded"
                  />
                  <label htmlFor="isPopular" className="text-sm font-medium text-neutral-700">
                    Marquer comme "Best Seller"
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isFeatured" 
                    name="isFeatured"
                    checked={formData.isFeatured || false}
                    onChange={handleChange}
                    className="w-4 h-4 text-black focus:ring-black border-neutral-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium text-neutral-700">
                    Afficher dans la Sélection du Moment (Accueil)
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Annuler
                </Button>
                <Button type="submit" variant="default">
                  {editingProduct ? 'Enregistrer' : 'Créer le Produit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
