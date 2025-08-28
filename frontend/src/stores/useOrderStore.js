// stores/useOrderStore.js
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useOrderStore = create(
  subscribeWithSelector((set, get) => ({
    orders: [],
    
    // Add new order from checkout
    addOrder: (cartItems, tableNumber) => {
      const newOrder = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tableNumber: tableNumber,
        items: cartItems,
        status: "pending", // pending, served, done
        timestamp: new Date().toISOString(),
        totalAmount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
        totalItems: cartItems.reduce((total, item) => total + item.quantity, 0)
      };
      
      set((state) => ({
        orders: [newOrder, ...state.orders]
      }));
      
      return newOrder.id;
    },
    
    // Update order status
    updateOrderStatus: (orderId, newStatus) => {
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        )
      }));
    },
    
    // Get orders by status
    getOrdersByStatus: (status) => {
      return get().orders.filter(order => order.status === status);
    },
    
    // Get orders by table number
    getOrdersByTable: (tableNumber) => {
      return get().orders.filter(order => order.tableNumber === tableNumber);
    },
    
    // Get pending orders
    getPendingOrders: () => {
      return get().orders.filter(order => order.status === "pending");
    },
    
    // Get served orders
    getServedOrders: () => {
      return get().orders.filter(order => order.status === "served");
    },
    
    // Get completed orders
    getCompletedOrders: () => {
      return get().orders.filter(order => order.status === "done");
    },
    
    // Remove order (optional - for cleanup)
    removeOrder: (orderId) => {
      set((state) => ({
        orders: state.orders.filter(order => order.id !== orderId)
      }));
    },
    
    // Get order summary stats
    getOrderStats: () => {
      const orders = get().orders;
      const today = new Date().toDateString();
      
      const todayOrders = orders.filter(order => 
        new Date(order.timestamp).toDateString() === today
      );
      
      return {
        total: orders.length,
        pending: orders.filter(o => o.status === "pending").length,
        served: orders.filter(o => o.status === "served").length,
        done: orders.filter(o => o.status === "done").length,
        todayTotal: todayOrders.length,
        todayRevenue: todayOrders
          .filter(o => o.status === "done")
          .reduce((sum, o) => sum + o.totalAmount, 0)
      };
    },
    
    // Clear all orders (admin function)
    clearAllOrders: () => {
      set({ orders: [] });
    }
  }))
);