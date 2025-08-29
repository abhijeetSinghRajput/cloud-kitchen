import { useEffect } from "react";
import { motion } from "framer-motion";
import { useOrderStore } from "@/stores/useOrderStore";
import Orders from "@/components/admin/Orders";
import OrderSummaryGrid from "@/components/admin/OrderSummaryGrid";
import EmptyCompletedOrder from "@/components/admin/empty-state/EmptyCompletedOrder";
import EmptyPendingOrder from "@/components/admin/empty-state/EmptyPendingOrder";
import { Separator } from "@/components/ui/separator";
import AnimatedTabs from "@/components/ui/animated-tabs";

const AdminDashboardPage = () => {
  const { orders, subscribeOrders } = useOrderStore();

  useEffect(() => {
    const unsubscribe = subscribeOrders();
    return () => unsubscribe(); // cleanup listener on unmount
  }, [subscribeOrders]);

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const completedOrders = orders.filter((o) => o.status === "completed");

  // Mobile tabs configuration
  const mobileTabsConfig = [
    {
      title: "Pending",
      value: "pending",
      content: <Orders orders={pendingOrders} type="pending" />
    },
    {
      title: "Completed", 
      value: "completed",
      content: <Orders orders={completedOrders} type="completed" />
    },
    {
      title: "Summary",
      value: "summary", 
      content: <OrderSummaryGrid orders={pendingOrders} />
    }
  ];

  // Desktop tabs configuration (without summary)
  const desktopTabsConfig = [
    {
      title: "Pending",
      value: "pending",
      content: <Orders orders={pendingOrders} />
    },
    {
      title: "Completed",
      value: "completed", 
      content: <Orders orders={completedOrders} type="completed" />
    }
  ];

  return (
    <div>
      <motion.h1 
        className="text-2xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Dashboard
      </motion.h1>

      <motion.div 
        className="mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Mobile View */}
        <div className="block lg:hidden">
          <AnimatedTabs
            tabs={mobileTabsConfig}
            defaultValue="pending"
            className="w-full"
            tabsListClassName="w-full"
          />
        </div>

        {/* Desktop View */}
        <div className="hidden lg:flex gap-6">
          {/* Left Side Tabs (2/3 width) */}
          <div className="flex-1">
            <AnimatedTabs
              tabs={desktopTabsConfig}
              defaultValue="pending"
              className="w-full"
            />
          </div>

          {/* Vertical Separator */}
          <motion.div 
            className="w-px bg-border"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          />

          {/* Right Side Summary (1/3 width) */}
          <div className="flex-1">
            <motion.h3 
              className="text-lg font-semibold text-muted-foreground mb-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              Summary
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <OrderSummaryGrid orders={pendingOrders} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;