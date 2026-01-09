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
  //         quantity: 2
  //       }
  //   ],
  //   "Tea": [...]
  // }

  cart: {},
  isCartOpen: false,
  setOpenCart: (value) => set({ isCartOpen: Boolean(value) }),

  // Add item to cart
  addToCart: (category, item) => {
    set((state) => {
      const newCart = { ...state.cart };

      if (!newCart[category]) {
        newCart[category] = [];
      }

      const existingItemIndex = newCart[category].findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex >= 0) {
        newCart[category][existingItemIndex].quantity += 1;
      } else {
        // store the entire item + quantity
        newCart[category].push({
          ...item,
          quantity: 1,
        });
      }

      return { cart: newCart };
    });
  },

  // Remove one quantity
  removeFromCart: (category, item) => {
    set((state) => {
      const newCart = { ...state.cart };

      if (!newCart[category]) return { cart: newCart };

      const existingItemIndex = newCart[category].findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex >= 0) {
        if (newCart[category][existingItemIndex].quantity > 1) {
          newCart[category][existingItemIndex].quantity -= 1;
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
  removeCompletely: (category, item) => {
    set((state) => {
      const newCart = { ...state.cart };

      if (!newCart[category]) return { cart: newCart };

      newCart[category] = newCart[category].filter(
        (cartItem) => cartItem.id !== item.id
      );

      if (newCart[category].length === 0) {
        delete newCart[category];
      }

      return { cart: newCart };
    });
  },

  getCategoryItemQuantity: (category) => {
    const categoryItem = get().cart[category];
    if (!categoryItem) return 0;

    return categoryItem.reduce((total, item) => total + item.quantity, 0);
  },

  getCartItemQuantity: () => {
    let quantity = 0;
    for (const category in get().cart) {
      quantity += get().getCategoryItemQuantity(category);
    }
    return quantity;
  },

  // Total items
  getTotalItems: () => {
    const { cart } = get();
    let total = 0;

    for (const category in cart) {
      total += cart[category].reduce((sum, item) => sum + item.quantity, 0);
    }

    return total;
  },

  // Total price
  getTotalPrice: () => {
    const { cart } = get();
    let total = 0;

    for (const category in cart) {
      total += cart[category].reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    return total;
  },

  clearCart: () => {
    set({ cart: {} });
  },
}));
