import { db } from "@/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { toast } from "sonner";
import { create } from "zustand";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: {
    placeOrder: false,
    deleteOrder: false,
    markDone: false,
  },

  // ✅ Place Order
  placeOrder: async (order) => {
    set((state) => ({ loading: { ...state.loading, placeOrder: true } }));
    try {
      await addDoc(collection(db, "orders"), {
        ...order,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast.success("Order placed successfully");
    } catch (error) {
      toast.error("Failed to place order");
      console.error("❌ Error placing order:", error);
    } finally {
      set((state) => ({ loading: { ...state.loading, placeOrder: false } }));
    }
  },

  // ✅ Delete Order
  deleteOrder: async (id) => {
    set((state) => ({ loading: { ...state.loading, deleteOrder: id } }));
    try {
      await deleteDoc(doc(db, "orders", id));
      toast.success("Order deleted");
    } catch (error) {
      toast.error("Failed to delete order");
      console.error("❌ Error deleting order:", error);
    } finally {
      set((state) => ({ loading: { ...state.loading, deleteOrder: false } }));
    }
  },

  // ✅ Mark as Done
  markDone: async (id) => {
    set((state) => ({ loading: { ...state.loading, markDone: id } }));
    try {
      await updateDoc(doc(db, "orders", id), { status: "completed" });
      toast.success("Order marked as done");
    } catch (error) {
      toast.error("Failed to mark done");
      console.error("❌ Error updating order:", error);
    } finally {
      set((state) => ({ loading: { ...state.loading, markDone: false } }));
    }
  },

  // ✅ Subscribe Orders
  subscribeOrders: () => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const promises = snapshot.docs.map(async (docSnap) => {
        const order = { id: docSnap.id, ...docSnap.data() };

        // Enrich items
        const enrichedItems = await Promise.all(
          order.items.map(async (item) => {
            const foodRef = doc(db, "items", item.id);
            const foodSnap = await getDoc(foodRef);
            if (foodSnap.exists()) {
              return { ...item, ...foodSnap.data() };
            }
            return item;
          })
        );

        // Compute total
        const totalAmount = enrichedItems.reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
          0
        );

        return { ...order, items: enrichedItems, totalAmount };
      });

      const ordersWithItems = await Promise.all(promises);
      set({ orders: ordersWithItems });
    });

    return unsubscribe;
  },
}));
