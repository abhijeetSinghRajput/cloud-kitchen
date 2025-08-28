// stores/useOrderStore.js
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { create } from "zustand";

export const useOrderStore = create((set) => ({
  orders: [],

  // ✅ Place Order
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

  // ✅ Subscribe to orders + populate item details
  subscribeOrders: () => {
    const unsubscribe = onSnapshot(collection(db, "orders"), async (snapshot) => {
      const promises = snapshot.docs.map(async (docSnap) => {
        const order = { id: docSnap.id, ...docSnap.data() };

        // For each item → fetch details
        const enrichedItems = await Promise.all(
          order.items.map(async (item) => {
            const foodRef = doc(db, "items", item.id);
            const foodSnap = await getDoc(foodRef);

            if (foodSnap.exists()) {
              return {
                ...item,
                ...foodSnap.data(), // merge food details into item
              };
            }
            return item; // fallback if food item not found
          })
        );

        return { ...order, items: enrichedItems };
      });

      const ordersWithItems = await Promise.all(promises);

      set({ orders: ordersWithItems });
    });

    return unsubscribe; // allow unsubscribe in component
  },
}));
