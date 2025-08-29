// useSubscriptionStore.js
import { create } from "zustand";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";

export const useSubscriptionStore = create((set) => ({
  subscriptions: [],
  loading: {
    requestSubscription: false,
    fetchSubscriptions: false,
    deleteSubscription: false,
  },
  errors: {
    requestSubscription: "",
    fetchSubscriptions: "",
    deleteSubscription: "",
  },

  // ✅ Request a new subscription
  requestSubscription: async (data) => {
    set((state) => ({
      loading: { ...state.loading, requestSubscription: true },
      errors: { ...state.errors, requestSubscription: "" },
    }));

    try {
      await addDoc(collection(db, "subscriptions"), {
        ...data,
        createdAt: serverTimestamp(),
      });

      toast.success("✅ Subscription request submitted successfully!");
    } catch (error) {
      console.error("Error requesting subscription:", error);
      set((state) => ({
        errors: { ...state.errors, requestSubscription: error.message },
      }));

      toast.error("❌ Failed to submit subscription request.");
    } finally {
      set((state) => ({
        loading: { ...state.loading, requestSubscription: false },
      }));
    }
  },

  // ✅ Real-time fetch subscriptions (for admin dashboard)
  fetchSubscriptions: () => {
    set((state) => ({
      loading: { ...state.loading, fetchSubscriptions: true },
      errors: { ...state.errors, fetchSubscriptions: "" },
    }));

    try {
      const q = query(
        collection(db, "subscriptions"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const subs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          set({
            subscriptions: subs,
            loading: { requestSubscription: false, fetchSubscriptions: false },
          });

          // 🎉 Optional: Toast when new subscriptions arrive
          if (subs.length > 0) {
            toast.info("📩 Subscriptions updated in real-time!");
          }
        },
        (error) => {
          console.error("Error fetching subscriptions:", error);
          set((state) => ({
            errors: { ...state.errors, fetchSubscriptions: error.message },
            loading: { ...state.loading, fetchSubscriptions: false },
          }));
          toast.error("❌ Failed to fetch subscriptions.");
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Error in fetchSubscriptions setup:", error);
      set((state) => ({
        errors: { ...state.errors, fetchSubscriptions: error.message },
        loading: { ...state.loading, fetchSubscriptions: false },
      }));
      toast.error("❌ Something went wrong while setting up listener.");
    }
  },

  // ✅ Delete a subscription by ID
  deleteSubscription: async (id) => {
    set((state) => ({
      loading: { ...state.loading, [`delete_${id}`]: true },
      errors: { ...state.errors, deleteSubscription: "" },
    }));

    try {
      await deleteDoc(doc(db, "subscriptions", id));
      toast.success("🗑️ Subscription deleted successfully!");
    } catch (error) {
      console.error("Error deleting subscription:", error);
      set((state) => ({
        errors: { ...state.errors, deleteSubscription: error.message },
      }));
      toast.error("❌ Failed to delete subscription.");
    } finally {
      set((state) => ({
        loading: { ...state.loading, [`delete_${id}`]: false },
      }));
    }
  },
}));
