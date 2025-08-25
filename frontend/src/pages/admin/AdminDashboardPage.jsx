import Orders from "@/components/admin/Orders";
import OrderSummaryGrid from "@/components/admin/OrderSummaryGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orders } from "@/constants/orders";
import React from "react";

const AdminDashboardPage = () => {
  // Split orders into pending & completed
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const completedOrders = orders.filter((o) => o.status === "completed");

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Small screen: show Tabs */}
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

      {/* Large screen: show Orders (with 2 tabs) + Summary side by side */}
      <div className="hidden lg:grid grid-cols-2 gap-6 mt-6">
        {/* Orders Section with Tabs */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <Tabs defaultValue="pending">
            <TabsList className="mb-2">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Orders orders={pendingOrders} />
            </TabsContent>
            <TabsContent value="completed">
              <Orders orders={completedOrders} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Summary Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <OrderSummaryGrid orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
