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

  // ✅ Place Order (no totalAmount here)
  placeOrder: async (order) => {
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
    }
  },

  // ✅ Delete Order
  deleteOrder: async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      toast.success("Order deleted");
    } catch (error) {
      toast.error("Failed to delete order");
      console.error("❌ Error deleting order:", error);
    }
  },

  // ✅ Mark as Done
  markDone: async (id) => {
    try {
      await updateDoc(doc(db, "orders", id), { status: "completed" });
      toast.success("Order marked as done");
    } catch (error) {
      toast.error("Failed to mark done");
      console.error("❌ Error updating order:", error);
    }
  },

  // ✅ Subscribe to orders (FIFO + enrich items + compute totalAmount)
  subscribeOrders: () => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const promises = snapshot.docs.map(async (docSnap) => {
        const order = { id: docSnap.id, ...docSnap.data() };

        // Enrich items with details
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

        // ✅ Compute totalAmount here on every fetch
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
