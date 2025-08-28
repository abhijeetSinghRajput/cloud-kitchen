import { useEffect } from "react";
import { useOrderStore } from "@/stores/useOrderStore";
import Orders from "@/components/admin/Orders";
import OrderSummaryGrid from "@/components/admin/OrderSummaryGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboardPage = () => {
  const { orders, subscribeOrders } = useOrderStore();

  useEffect(() => {
    const unsubscribe = subscribeOrders();
    return () => unsubscribe(); // cleanup listener on unmount
  }, [subscribeOrders]);

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const completedOrders = orders.filter((o) => o.status === "completed");

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="block lg:hidden mt-4">
        <Tabs defaultValue="pending">
          <TabsList className="w-full flex justify-around">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Orders orders={pendingOrders} />
          </TabsContent>
          <TabsContent value="completed">
            <Orders orders={completedOrders} />
          </TabsContent>
          <TabsContent value="summary">
            <OrderSummaryGrid orders={orders} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
