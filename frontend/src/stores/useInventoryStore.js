import { create } from "zustand";
import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

export const useInventoryStore = create((set, get) => ({
  categories: [],
  items: {}, // { categoryId: [items] }
  loading: {
    fetchCategories: false,
    fetchItems: false,
    updateCategoriesAvailability: false,
    addItem: false,
    updateItem: false,
    deleteItem: false,
    fetchCategoriesWithItems: false,
  },
  error: "",

  // ✅ Helpers
  setLoading: (name, value = true) =>
    set((state) => ({
      loading: { ...state.loading, [name]: value },
    })),

  setError: (error, loadingKey = null) =>
    set((state) => ({
      error: error.message || error,
      loading: loadingKey
        ? { ...state.loading, [loadingKey]: false }
        : state.loading,
    })),

  clearError: () => set({ error: "" }),

  // ✅ Fetch ALL categories (not just available ones)
  fetchCategories: async () => {
    const { setLoading, setError } = get();
    setLoading("fetchCategories");
    set({ error: "" });

    try {
      const snapshot = await getDocs(collection(db, "categories"));
      const categories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      set({ categories });
      return categories;
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err, "fetchCategories");
      throw err;
    } finally {
      setLoading("fetchCategories", false);
    }
  },

  // ✅ Fetch category by slug WITH items
  getCategoryWithItems: async (slug) => {
    const { setLoading, setError } = get();
    setLoading("fetchItems");
    set({ error: "" });

    try {
      if (!slug) throw new Error("Category slug is required");

      const categoryQuery = query(
        collection(db, "categories"),
        where("slug", "==", slug),
      );
      const categorySnapshot = await getDocs(categoryQuery);

      if (categorySnapshot.empty) {
        throw new Error(`Category with slug "${slug}" not found`);
      }

      const categoryDoc = categorySnapshot.docs[0];
      const categoryData = { id: categoryDoc.id, ...categoryDoc.data() };

      const itemsQuery = query(
        collection(db, "items"),
        where("categoryId", "==", categoryDoc.id),
      );
      const itemsSnapshot = await getDocs(itemsQuery);

      const items = itemsSnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      set((state) => ({
        items: { ...state.items, [categoryDoc.id]: items },
      }));

      return {
        ...categoryData,
        items,
      };
    } catch (err) {
      console.error("Error fetching category with items:", err);
      setError(err, "fetchItems");
      return null;
    } finally {
      setLoading("fetchItems", false);
    }
  },

  // ✅ Optimized: Fetch ALL categories with items in single pass
  fetchCategoriesWithItems: async () => {
    const { setLoading, setError } = get();
    setLoading("fetchCategoriesWithItems");
    set({ error: "" });

    try {
      // Fetch both in parallel
      const [categoriesSnap, itemsSnap] = await Promise.all([
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "items")),
      ]);

      // Process categories
      const categories = categoriesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Group items by categoryId
      const itemsByCategory = {};
      itemsSnap.docs.forEach((doc) => {
        const item = { id: doc.id, ...doc.data() };
        if (!itemsByCategory[item.categoryId]) {
          itemsByCategory[item.categoryId] = [];
        }
        itemsByCategory[item.categoryId].push(item);
      });

      // Attach items to categories
      const categoriesWithItems = categories.map((cat) => ({
        ...cat,
        items: itemsByCategory[cat.id] || [],
      }));

      const availableCategories = categories.filter((c) => c.isAvailable);

      localStorage.setItem("categoryCount", availableCategories.length || 0);

      set({
        categories: categoriesWithItems,
        items: itemsByCategory,
      });

      return categoriesWithItems;
    } catch (err) {
      console.error("Error fetching categories with items:", err);
      setError(err, "fetchCategoriesWithItems");
      throw err;
    } finally {
      setLoading("fetchCategoriesWithItems", false);
    }
  },

  // ✅ Optimized: Fetch ALL items (grouped by category)
  getAllItems: async () => {
    const { setLoading, setError } = get();
    setLoading("fetchItems");
    set({ error: "" });

    try {
      const snapshot = await getDocs(collection(db, "items"));
      const itemsByCat = {};

      snapshot.docs.forEach((docSnap) => {
        const data = { id: docSnap.id, ...docSnap.data() };
        if (!itemsByCat[data.categoryId]) itemsByCat[data.categoryId] = [];
        itemsByCat[data.categoryId].push(data);
      });

      set({ items: itemsByCat });
      return itemsByCat;
    } catch (err) {
      console.error("Error fetching all items:", err);
      setError(err, "fetchItems");
      throw err;
    } finally {
      setLoading("fetchItems", false);
    }
  },

  // ✅ Fetch items for a specific category
  getItemsByCategory: async (categoryId) => {
    const { setLoading, setError } = get();
    setLoading("fetchItems");
    set({ error: "" });

    try {
      if (!categoryId) throw new Error("Category ID is required");

      const q = query(
        collection(db, "items"),
        where("categoryId", "==", categoryId),
      );
      const snapshot = await getDocs(q);

      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      set((state) => ({
        items: { ...state.items, [categoryId]: items },
      }));

      return items;
    } catch (err) {
      console.error("Error fetching items by category:", err);
      setError(err, "fetchItems");
      throw err;
    } finally {
      setLoading("fetchItems", false);
    }
  },

  // ✅ Optimized: Batch update category availability
  updateCategoriesAvailability: async (categoryIds = [], isAvailable) => {
    const { setLoading, setError } = get();
    setLoading("updateCategoriesAvailability");
    set({ error: "" });

    try {
      if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        throw new Error("Category IDs array is required");
      }

      const batch = writeBatch(db);

      categoryIds.forEach((id) => {
        const docRef = doc(db, "categories", id);
        batch.update(docRef, {
          isAvailable,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();

      // Optimized: Update state immutably
      set((state) => ({
        categories: state.categories.map((c) =>
          categoryIds.includes(c.id) ? { ...c, isAvailable } : c,
        ),
      }));

      return { success: true, updatedCount: categoryIds.length };
    } catch (err) {
      console.error("Error updating categories availability:", err);
      setError(err, "updateCategoriesAvailability");
      throw err;
    } finally {
      setLoading("updateCategoriesAvailability", false);
    }
  },

  // ✅ Add new item
  addItem: async (categoryId, item) => {
    const { setLoading, setError } = get();
    setLoading("addItem");
    set({ error: "" });

    try {
      if (!categoryId) throw new Error("Category ID is required");
      if (!item || !item.name) throw new Error("Item name is required");
      if (!item.price || item.price <= 0)
        throw new Error("Valid price is required");

      const docRef = doc(collection(db, "items"));
      const itemData = {
        ...item,
        categoryId,
        price: Number(item.price),
        tags: Array.isArray(item.tags) ? item.tags : [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, itemData);

      const newItem = { ...itemData, id: docRef.id };

      set((state) => ({
        items: {
          ...state.items,
          [categoryId]: [...(state.items[categoryId] || []), newItem],
        },
      }));

      return newItem;
    } catch (err) {
      console.error("Error adding item:", err);
      setError(err, "addItem");
      throw err;
    } finally {
      setLoading("addItem", false);
    }
  },

  // ✅ Update item
  updateItem: async (categoryId, itemId, updatedItem) => {
    const { setLoading, setError } = get();
    setLoading("updateItem");
    set({ error: "" });

    try {
      if (!categoryId) throw new Error("Category ID is required");
      if (!itemId) throw new Error("Item ID is required");
      if (!updatedItem) throw new Error("Updated item data is required");

      const updateData = {
        ...updatedItem,
        price: updatedItem.price ? Number(updatedItem.price) : undefined,
        tags: Array.isArray(updatedItem.tags) ? updatedItem.tags : undefined,
        updatedAt: serverTimestamp(),
      };

      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) delete updateData[key];
      });

      await updateDoc(doc(db, "items", itemId), updateData);

      set((state) => ({
        items: {
          ...state.items,
          [categoryId]:
            state.items[categoryId]?.map((i) =>
              i.id === itemId ? { ...i, ...updateData } : i,
            ) || [],
        },
      }));

      return { ...updateData, id: itemId };
    } catch (err) {
      console.error("Error updating item:", err);
      setError(err, "updateItem");
      throw err;
    } finally {
      setLoading("updateItem", false);
    }
  },

  // ✅ Delete item with image cleanup
  deleteItem: async (item, deleteImage = null) => {
    const { setLoading, setError } = get();
    setLoading("deleteItem");
    set({ error: "" });

    try {
      if (!item || !item.id) throw new Error("Item with ID is required");
      if (!item.categoryId) throw new Error("Item must have categoryId");

      if (deleteImage && item.image) {
        try {
          await deleteImage(item.image);
        } catch (imageError) {
          console.warn(
            "Failed to delete image, continuing with item deletion:",
            imageError,
          );
        }
      }

      await deleteDoc(doc(db, "items", item.id));

      set((state) => ({
        items: {
          ...state.items,
          [item.categoryId]:
            state.items[item.categoryId]?.filter((i) => i.id !== item.id) || [],
        },
      }));

      return { success: true, deletedItem: item };
    } catch (err) {
      console.error("Error deleting item:", err);
      setError(err, "deleteItem");
      throw err;
    } finally {
      setLoading("deleteItem", false);
    }
  },

  // ✅ Optimized: Bulk operations
  bulkUpdateItems: async (categoryId, updates) => {
    const { setLoading, setError } = get();
    setLoading("updateItem");
    set({ error: "" });

    try {
      const batch = writeBatch(db);

      updates.forEach(({ id, data }) => {
        batch.update(doc(db, "items", id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();

      const updateMap = new Map(updates.map(({ id, data }) => [id, data]));

      set((state) => ({
        items: {
          ...state.items,
          [categoryId]:
            state.items[categoryId]?.map((item) =>
              updateMap.has(item.id)
                ? { ...item, ...updateMap.get(item.id) }
                : item,
            ) || [],
        },
      }));

      return { success: true, updatedCount: updates.length };
    } catch (err) {
      console.error("Error bulk updating items:", err);
      setError(err, "updateItem");
      throw err;
    } finally {
      setLoading("updateItem", false);
    }
  },
}));
