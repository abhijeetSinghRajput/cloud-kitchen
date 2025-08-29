import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";
import React from "react";
import EmptySummary from "./empty-state/EmptySummary";
import ImageWithSkeleton from "../ImageWithSkeleton";

const OrderSummaryGrid = ({ orders, className }) => {
  if (orders.length === 0) {
    return <EmptySummary/>
  }

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

  if (accumulatedItems.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-[60vh] text-center text-gray-500",
          className
        )}
      >
        <PackageOpen size={48} className="mb-4 text-gray-400" />
        <img src="/popcorn.svg" className="grayscale max-w-80" />
        <h2 className="text-xl font-semibold">No Pending Orders</h2>
        <p className="text-sm text-muted-foreground">
          All items have been completed.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4 mt-4",
        className
      )}
    >
      {accumulatedItems.map((item) => (
        <div
          key={item.itemId}
          className="relative rounded-2xl overflow-hidden shadow-md group"
        >
          {/* Food Image */}
          <ImageWithSkeleton
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

          {/* Quantity Badge */}
          <Badge className="absolute bottom-0 right-0 z-10 text-4xl rounded-none rounded-tl-2xl">
            {item.totalQuantity}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default OrderSummaryGrid;
