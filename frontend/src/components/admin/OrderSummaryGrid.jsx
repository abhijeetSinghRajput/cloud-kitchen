import { Badge } from "@/components/ui/badge";
import React from "react";

const OrderSummaryGrid = ({orders}) => {
  // Accumulate quantities for each item
  const itemMap = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!itemMap[item.itemId]) {
        itemMap[item.itemId] = {
          ...item,
          totalQuantity: item.quantity,
        };
      } else {
        itemMap[item.itemId].totalQuantity += item.quantity;
      }
    });
  });

  const accumulatedItems = Object.values(itemMap);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4 mt-4">
      {accumulatedItems.map((item) => (
        <div
          key={item.itemId}
          className="relative rounded-2xl overflow-hidden shadow-md group"
        >
          {/* Food Image */}
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-40 object-cover"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-100"></div>

          {/* Text Info */}
          <div className="absolute bottom-2 left-2 right-2 text-white">
            <h3 className="font-semibold text-sm">{item.name}</h3>
          </div>
          <Badge
            className={
              "absolute bottom-0 right-0 z-10 text-4xl rounded-none rounded-tl-2xl"
            }
          >
            {item.totalQuantity}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default OrderSummaryGrid;
