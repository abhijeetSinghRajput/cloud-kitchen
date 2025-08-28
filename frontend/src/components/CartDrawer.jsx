// CartDrawer.jsx
import { useCartStore } from "@/stores/useCartStore";
import { ShoppingCart, Utensils } from "lucide-react";
import React, { useState } from "react";
import FoodCard from "./FoodCard";
import { Drawer, DrawerContent } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { IndianRupee } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";
import { useOrderStore } from "@/stores/useOrderStore";
import { quality } from "@cloudinary/url-gen/actions/delivery";

const CartDrawer = ({ open, onOpenChange }) => {
  const [searchParams] = useSearchParams();
  const tableNo = searchParams.get("table");
  const { cart, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { placeOrder } = useOrderStore();
  const isEmpty = Object.keys(cart).length === 0;

  const handleCheckout = async () => {
    const items = Object.values(cart)
      .flat()
      .map((item) => ({ id: item.id, quantity: item.quantity }));

    const order = {
      tableNo: tableNo ? parseInt(tableNo) : null,
      items,
    };

    await placeOrder(order);
    clearCart();
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[70vh]">
        <div className="p-4 max-w-screen-md w-full mx-auto h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between">
            <h3 className="text-xl font-bold mb-4 flex-shrink-0 flex gap-2 items-center">
              <ShoppingCart className="size-5" strokeWidth={3} />
              Cart
            </h3>
            <Input type="number" className="w-20" value={tableNo} />
          </div>

          {/* Scrollable content */}
          <ScrollArea className="flex-1 pr-2">
            {isEmpty ? (
              <div className="h-full mt-8 flex flex-col gap-2 items-center text-center">
                <div className="bg-muted size-24 rounded-full flex items-center justify-center">
                  <Utensils size={34} strokeWidth={2} className="opacity-50" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">Your Cart is Empty</h3>
                  <p className="text-sm text-muted-foreground">
                    Looks like you haven't added antyhing to your cart yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(cart).map(([categoryName, items]) =>
                  items.map((food, idx) => (
                    <FoodCard
                      key={`${categoryName}-${idx}`}
                      food={food}
                      categoryName={categoryName}
                    />
                  ))
                )}
              </div>
            )}
          </ScrollArea>

          {/* Sticky Footer */}
          {!isEmpty && (
            <div className="p-3 border-t shadow-md sticky bottom-0 bg-white flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  {getTotalItems()} items
                </p>
                <p className="font-bold text-lg flex items-center gap-1 text-orange-500">
                  <IndianRupee className="size-4" />
                  {getTotalPrice()}
                </p>
              </div>
              <Button onClick={handleCheckout} className="bg-[#ff5200]">
                Checkout
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
