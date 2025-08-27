import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLocalStorageStore = create(
  persist(
    (set, get) => ({
      // ✅ general state container
      data: {},

      // ✅ set any key/value
      setItem: (key, value) =>
        set((state) => ({
          data: { ...state.data, [key]: value },
        })),

      // ✅ get value by key
      getItem: (key) => get().data[key],

      // ✅ remove a specific key
      removeItem: (key) =>
        set((state) => {
          const newData = { ...state.data };
          delete newData[key];
          return { data: newData };
        }),

      // ✅ clear all data
      clear: () => set({ data: {} }),
    }),
    {
      name: "local-storage", // localStorage key
    }
  )
);

export default useLocalStorageStore;
