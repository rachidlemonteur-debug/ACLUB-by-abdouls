import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  writeBatch
} from 'firebase/firestore';

export async function getProducts(adminRead = false) {
  try {
    const productsRef = collection(db, 'products');
    let q = query(productsRef);
    if (!adminRead) {
       q = query(productsRef, where('isActive', '==', true));
    }
    const snapshot = await getDocs(q);
    const products: any[] = [];
    
    for (const d of snapshot.docs) {
      const pData = d.data();
      // Load variants
      const vSnapshot = await getDocs(query(collection(db, 'product_variants'), where('productId', '==', d.id)));
      const variants = vSnapshot.docs.map(v => ({ id: v.id, ...(v.data() as any) }));
      
      // Load images
      const iSnapshot = await getDocs(query(collection(db, 'product_images'), where('productId', '==', d.id)));
      const images = iSnapshot.docs.map(i => ({ id: i.id, ...(i.data() as any) })).sort((a: any, b: any) => a.displayOrder - b.displayOrder);

      // Load category name
      let category = null;
      if (pData.categoryId) {
        const catSnap = await getDoc(doc(db, 'categories', pData.categoryId));
        if (catSnap.exists()) {
           category = { id: catSnap.id, name: catSnap.data().name };
        }
      }

      // Convert format for UI
      products.push({
        id: d.id,
        ...pData,
        variants: variants.map(v => ({
           name: v.name,
           value: v.value,
           sku: v.sku,
           stock_quantity: v.stockQuantity
        })),
        images: images.map(img => ({
           id: img.id,
           image_url: img.imageUrl,
           display_order: img.displayOrder
        })),
        category_id: pData.categoryId,
        is_active: pData.isActive,
        status_badge: pData.statusBadge,
        category
      });
    }
    return products;
  } catch (error) {
    console.warn("Could not reach Cloud Firestore backend or other error. Using fallback mock data.", error);
    // Return mock data for simple testing when backend is down
    return [
      {
        id: "mock1", 
        title: "Casquette Signature AClub",
        name: "Casquette Signature AClub",
        slug: "casquette-signature-aclub",
        description: "Une casquette élégante et minimaliste.",
        price: 15000,
        images: ["https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800"],
        category_id: "mock-cat",
        category: { id: "mock-cat", name: "Accessoire" },
        is_active: true,
        status_badge: "NOUVEAU",
        variants: [
          { name: "Couleur", value: "Noir", sku: "CASB-01", stock_quantity: 10 }
        ]
      }
    ];
  }
}

export async function getCategories() {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn("Could not fetch categories, returning mock data", err);
    return [
      { id: "mock-cat", name: "Accessoire", slug: "accessoire" },
      { id: "mock-cat-2", name: "Mode", slug: "mode" }
    ];
  }
}

export async function createCategory(data: { name: string, slug: string }) {
  try {
     const docRef = await addDoc(collection(db, 'categories'), {
        ...data,
        createdAt: new Date().toISOString()
     });
     return docRef.id;
  } catch (err) {
     console.error(err);
     throw err;
  }
}

export async function updateCategory(id: string, data: { name: string, slug: string }) {
  try {
     await updateDoc(doc(db, 'categories', id), data);
  } catch(err) {
     console.error(err);
     throw err;
  }
}

export async function deleteCategory(id: string) {
   try {
     const productsSnap = await getDocs(query(collection(db, 'products'), where('categoryId', '==', id)));
     if (!productsSnap.empty) {
        throw new Error("Impossible de supprimer la catégorie : des produits y sont associés.");
     }
     await deleteDoc(doc(db, 'categories', id));
   } catch(err) {
     console.error(err);
     throw err;
   }
}

export async function createProduct(productData: any, variants: any[], images: any[]) {
  try {
     const pData = {
        title: productData.title,
        slug: productData.slug,
        description: productData.description || '',
        price: productData.price,
        categoryId: productData.category_id,
        isActive: productData.is_active,
        statusBadge: productData.status_badge === 'Aucun' ? null : productData.status_badge,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
     };
     const docRef = await addDoc(collection(db, 'products'), pData);
     const productId = docRef.id;

     if (variants.length > 0 || images.length > 0) {
        const batch = writeBatch(db);
        variants.forEach(v => {
           const vRef = doc(collection(db, 'product_variants'));
           batch.set(vRef, {
             productId,
             name: v.name,
             value: v.value,
             sku: v.sku,
             additionalPrice: 0, // default
             stockQuantity: v.stock_quantity || 10,
             createdAt: new Date().toISOString(),
             updatedAt: new Date().toISOString(),
           })
        });
        images.forEach(img => {
           const iRef = doc(collection(db, 'product_images'));
           batch.set(iRef, {
              productId,
              imageUrl: img.image_url,
              displayOrder: img.display_order,
              createdAt: new Date().toISOString(),
           });
        });
        await batch.commit();
     }
     return productId;
  } catch (err) {
     console.error(err);
     throw err;
  }
}

export async function updateProduct(id: string, productData: any, variants: any[], images: any[]) {
  try {
     // Currently we just update product fields
     // Full sync of variants and images requires deleting old ones and replacing, but we simplify for now
     const pData = {
        title: productData.title,
        slug: productData.slug,
        description: productData.description || '',
        price: productData.price,
        categoryId: productData.category_id,
        isActive: productData.is_active,
        statusBadge: productData.status_badge === 'Aucun' ? null : productData.status_badge,
        updatedAt: new Date().toISOString(),
     };
     await updateDoc(doc(db, 'products', id), pData);

     // Simplify: Clean up variants & images and replace
     const vSnapshot = await getDocs(query(collection(db, 'product_variants'), where('productId', '==', id)));
     const iSnapshot = await getDocs(query(collection(db, 'product_images'), where('productId', '==', id)));
     const deleteBatch = writeBatch(db);
     vSnapshot.forEach(d => deleteBatch.delete(d.ref));
     iSnapshot.forEach(d => deleteBatch.delete(d.ref));
     await deleteBatch.commit();

     const createBatch = writeBatch(db);
     variants.forEach(v => {
        const vRef = doc(collection(db, 'product_variants'));
        createBatch.set(vRef, {
           productId: id,
           name: v.name,
           value: v.value,
           sku: v.sku,
           additionalPrice: 0,
           stockQuantity: v.stock_quantity || 10,
           createdAt: new Date().toISOString(),
           updatedAt: new Date().toISOString(),
        })
     });
     images.forEach(img => {
        const iRef = doc(collection(db, 'product_images'));
        createBatch.set(iRef, {
           productId: id,
           imageUrl: img.image_url,
           displayOrder: img.display_order,
           createdAt: new Date().toISOString(),
        });
     });
     await createBatch.commit();
     
  } catch(err) {
     console.error(err);
     throw err;
  }
}

export async function deleteProduct(id: string) {
   try {
     const vSnapshot = await getDocs(query(collection(db, 'product_variants'), where('productId', '==', id)));
     const iSnapshot = await getDocs(query(collection(db, 'product_images'), where('productId', '==', id)));
     const batch = writeBatch(db);
     vSnapshot.forEach(d => batch.delete(d.ref));
     iSnapshot.forEach(d => batch.delete(d.ref));
     batch.delete(doc(db, 'products', id));
     await batch.commit();
   } catch(err) {
     console.error(err);
     throw err;
   }
}

export async function getProductReviews(productId: string) {
  try {
    const reviewsRef = collection(db, 'product_reviews');
    const q = query(reviewsRef, where('productId', '==', productId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.error("Could not fetch reviews", err);
    return [];
  }
}

export async function addReview(productId: string, data: { authorName: string, rating: number, comment: string }) {
  try {
    const docRef = await addDoc(collection(db, 'product_reviews'), {
      productId,
      authorName: data.authorName,
      rating: data.rating,
      comment: data.comment,
      status: 'published', // could be 'pending' if we want moderation
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
