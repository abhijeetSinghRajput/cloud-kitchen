import { create } from "zustand";

export const useCartStore = create((set, get) => ({
    // cart schema
    // cart: {
    //   "Biryani": [
    //       {
    //         name: "Veg Biryani",
    //         image: "/food images/Biryani.png",
    //         desc: "Fragrant rice with vegetables and spices",
    //         price: 160,
    //         count: 2
    //       }
    //   ],
    //   "Tea": [...]
    // }

    cart: {},

    // Add item to cart
    addToCart: (category, item) => {
        set((state) => {
            const newCart = { ...state.cart };

            if (!newCart[category]) {
                newCart[category] = [];
            }

            const existingItemIndex = newCart[category].findIndex(
                (cartItem) => cartItem.name === item.name
            );

            if (existingItemIndex >= 0) {
                newCart[category][existingItemIndex].count += 1;
            } else {
                // store the entire item + count
                newCart[category].push({
                    ...item,
                    count: 1,
                });
            }

            return { cart: newCart };
        });
    },

    // Remove one quantity
    removeFromCart: (category, itemName) => {
        set((state) => {
            const newCart = { ...state.cart };

            if (!newCart[category]) return { cart: newCart };

            const existingItemIndex = newCart[category].findIndex(
                (cartItem) => cartItem.name === itemName
            );

            if (existingItemIndex >= 0) {
                if (newCart[category][existingItemIndex].count > 1) {
                    newCart[category][existingItemIndex].count -= 1;
                } else {
                    newCart[category].splice(existingItemIndex, 1);
                    if (newCart[category].length === 0) {
                        delete newCart[category];
                    }
                }
            }

            return { cart: newCart };
        });
    },

    // Remove entire item
    removeCompletely: (category, itemName) => {
        set((state) => {
            const newCart = { ...state.cart };

            if (!newCart[category]) return { cart: newCart };

            newCart[category] = newCart[category].filter(
                (cartItem) => cartItem.name !== itemName
            );

            if (newCart[category].length === 0) {
                delete newCart[category];
            }

            return { cart: newCart };
        });
    },

    getCategoryItemCount: (category) => {
        const categoryItem = get().cart[category];
        if (!categoryItem) return 0;

        return categoryItem.reduce((total, item) => total + item.count, 0);
    },

    getCartItemCount: () => {
        let count = 0;
        for (const category in get().cart) {
            count += get().getCategoryItemCount(category);
        }
        return count;
    },

    // Total items
    getTotalItems: () => {
        const { cart } = get();
        let total = 0;

        for (const category in cart) {
            total += cart[category].reduce((sum, item) => sum + item.count, 0);
        }

        return total;
    },

    // Total price
    getTotalPrice: () => {
        const { cart } = get();
        let total = 0;

        for (const category in cart) {
            total += cart[category].reduce(
                (sum, item) => sum + item.price * item.count,
                0
            );
        }

        return total;
    },

    clearCart: () => {
        set({ cart: {} });
    },
}));
