// CartDrawer.jsx
import { useCartStore } from "@/stores/useCartStore";
import { ShoppingCart } from "lucide-react";
import React from "react";
import FoodCard from "./FoodCard";
import { Drawer, DrawerContent } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { IndianRupee } from "lucide-react";

const CartDrawer = ({ open, onOpenChange }) => {
  const { cart, getTotalItems, getTotalPrice, clearCart } = useCartStore();

  const isEmpty = Object.keys(cart).length === 0;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[70vh]">
        <div className="p-4 max-w-screen-md w-full mx-auto h-full flex flex-col">
          {/* Header */}
          <h3 className="text-xl font-bold mb-4 flex-shrink-0 flex gap-2 items-center">
            <ShoppingCart className="size-4" />
            Cart
          </h3>

          {/* Scrollable content */}
          <ScrollArea className="flex-1 pr-2">
            {isEmpty ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Your cart is empty 🛒
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
              <Button onClick={clearCart} className="bg-[#ff5200]">
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
