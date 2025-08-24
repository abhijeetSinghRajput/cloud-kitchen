import { create } from "zustand";

export const useCartStore = create((set, get) => ({
    // schema of chart
    // cart: {
    //     "Tea": [
    //         {name: "Masala Tea", count: 1, price: 30},
    //         {name: "Green Tea", count: 2, price: 25},
    //     ],
    //     "Paratha": [
    //         {name: "Butter Aloo Paratha", count: 2, price: 80},
    //         {name: "Plain Aloo Paratha", count: 2, price: 70},
    //     ]
    // },

    cart: {},

    // Add item to cart
    add: (category, item) => {
        set((state) => {
            const newCart = {...state.cart};
            
            // If category doesn't exist, create it
            if (!newCart[category]) {
                newCart[category] = [];
            }
            
            // Check if item already exists in the category
            const existingItemIndex = newCart[category].findIndex(
                cartItem => cartItem.name === item.name
            );
            
            if (existingItemIndex >= 0) {
                // Increment count if item exists
                newCart[category][existingItemIndex].count += 1;
            } else {
                // Add new item with count 1
                newCart[category].push({
                    name: item.name,
                    count: 1,
                    price: item.price
                });
            }
            
            return { cart: newCart };
        });
    },

    // Remove item from cart
    remove: (category, itemName) => {
        set((state) => {
            const newCart = {...state.cart};
            
            // Check if category exists
            if (!newCart[category]) {
                return { cart: newCart };
            }
            
            // Find the item in the category
            const existingItemIndex = newCart[category].findIndex(
                cartItem => cartItem.name === itemName
            );
            
            if (existingItemIndex >= 0) {
                if (newCart[category][existingItemIndex].count > 1) {
                    // Decrement count if more than 1
                    newCart[category][existingItemIndex].count -= 1;
                } else {
                    // Remove item if count is 1
                    newCart[category].splice(existingItemIndex, 1);
                    
                    // Remove category if empty
                    if (newCart[category].length === 0) {
                        delete newCart[category];
                    }
                }
            }
            
            return { cart: newCart };
        });
    },

    // Remove entire item from cart (regardless of count)
    removeCompletely: (category, itemName) => {
        set((state) => {
            const newCart = {...state.cart};
            
            // Check if category exists
            if (!newCart[category]) {
                return { cart: newCart };
            }
            
            // Filter out the item
            newCart[category] = newCart[category].filter(
                cartItem => cartItem.name !== itemName
            );
            
            // Remove category if empty
            if (newCart[category].length === 0) {
                delete newCart[category];
            }
            
            return { cart: newCart };
        });
    },

    getCategoryItemCount: (category)=>{
        const categoryItem = get().cart[category];
        if(!categoryItem) return 0;

        return categoryItem.reduce((total, item)=> total + item.count, 0);
    },

    getCartItemCount: () => {
        let count = 0;
        for(const category in get().cart){
            count += get().getCategoryItemCount(category);
        }
        return count;
    },

    // Get total items count
    getTotalItems: () => {
        const { cart } = get();
        let total = 0;
        
        for (const category in cart) {
            total += cart[category].reduce((sum, item) => sum + item.count, 0);
        }
        
        return total;
    },

    // Get total price
    getTotalPrice: () => {
        const { cart } = get();
        let total = 0;
        
        for (const category in cart) {
            total += cart[category].reduce(
                (sum, item) => sum + (item.price * item.count), 0
            );
        }
        
        return total;
    },

    // Clear entire cart
    clearCart: () => {
        set({ cart: {} });
    }
}));