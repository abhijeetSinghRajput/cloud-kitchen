import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee } from "lucide-react";

// Primary brand color #ff5200
function OrderCard({ order }) {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getElapsedTime = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now - created;
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} min ago`;
  };

  return (
    <Card className="w-full overflow-hidden border border-l-4 border-l-[#ff5200] shadow-md hover:shadow-lg transition-shadow mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">
              Order #{order._id.slice(-4)}
            </h3>
            <div className="text-sm text-muted-foreground">
              {getElapsedTime(order.createdAt)}
            </div>
          </div>
          <Badge className="bg-[#ff5200] hover:bg-[#ff5200]">
            Seat {order.seatNo}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-md mr-2 flex items-center justify-center text-xs font-medium">
                  {item.quantity}
                </div>
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm flex items-center">
                <IndianRupee className="w-3 h-3 mr-1" />
                {item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t flex justify-between">
        <div className="font-semibold">Total</div>
        <div className="flex items-center gap-2">
          <span className="font-semibold flex items-center">
            <IndianRupee className="w-4 h-4 mr-1" />
            {order.totalAmount}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

const Orders = ({orders}) => {
  return (
    <div>
      <div className="grid gap-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
