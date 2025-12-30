import React from "react";
import { Button } from "./ui/button";
import { IndianRupee } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";

const CartFooter = () => {
  const { cart, getTotalItems, getTotalPrice, clearCart,setOpenCart } =
    useCartStore();

  const isEmpty = Object.keys(cart).length === 0;
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (isEmpty) return null;
  return (
    <footer className="sticky z-[99999] border-t bottom-0 bg-black p-4 shadow-md left-0">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          {!isEmpty && (
            <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
              {totalItems} {totalItems === 1 ? "item" : "items"} added
            </p>
          )}
          <div className="flex items-baseline gap-1">
            <IndianRupee
              className="size-4 sm:size-5 text-orange-500"
              strokeWidth={2.5}
            />
            <p className="font-bold text-xl sm:text-2xl text-orange-500">
              {totalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <Button
          onClick={() => setOpenCart(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold"
          size="lg"
        >
          Cart
        </Button>
      </div>
    </footer>
  );
};

export default CartFooter;
