// CartDrawer.jsx - Enhanced Responsive Version
import { useCartStore } from "@/stores/useCartStore";
import { ShoppingCart, X, Trash2, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import FoodCard from "./FoodCard";
import { Drawer, DrawerContent, DrawerClose } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { IndianRupee } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";
import { useOrderStore } from "@/stores/useOrderStore";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

const CartDrawer = ({ open, onOpenChange }) => {
  const [searchParams] = useSearchParams();
  const tableNo = searchParams.get("table");
  const [tableInput, setTableInput] = useState(tableNo || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { cart, getTotalItems, getTotalPrice, clearCart } = useCartStore();

  const { placeOrder } = useOrderStore();
  const isEmpty = Object.keys(cart).length === 0;
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
    if (!tableInput) {
      setErrorMessage("Please enter a valid table number");
      return;
    }

    setIsLoading(true);
    try {
      const items = Object.values(cart)
        .flat()
        .map((item) => ({ id: item.id, quantity: item.quantity }));

      const order = {
        tableNo: parseInt(tableInput),
        items,
      };

      await placeOrder(order);
      clearCart();
      onOpenChange(false);
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setTableInput(e.target.value);
    if (errorMessage) setErrorMessage("");
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[80vh] rounded-t-[20px] border-t-4 border-orange-500">
        <div className="flex flex-col h-full max-w-screen-md w-full mx-auto">
          {/* Header - Fixed */}
          <div className="flex-shrink-0 px-4 sm:px-6 pt-4 pb-3 border-b bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-full">
                  <ShoppingCart
                    className="size-5 sm:size-6 text-orange-500"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="flex items-start gap-4">
                  <div className="whitespace-nowrap">
                    <h3 className="text-lg sm:text-xl font-bold">Your Cart</h3>
                    {!isEmpty && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {totalItems} {totalItems === 1 ? "item" : "items"} added
                      </p>
                    )}
                  </div>
                  <Input
                    type="number"
                    placeholder="Enter table no."
                    className={cn("h-10", errorMessage && "placeholder:text-destructive ring-2 ring-destructive bg-destructive/10")}
                    value={tableInput}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
              </div>

              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                >
                  <X className="size-4 sm:size-5" />
                </Button>
              </DrawerClose>
            </div>
          </div>

          {/* Content - Scrollable */}
          <ScrollArea className="flex-1 px-4 sm:px-6">
            {isEmpty ? (
              <div className="h-full min-h-[300px] flex flex-col gap-4 items-center justify-center text-center py-8">
                <div className="size-32 sm:size-40 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center shadow-inner">
                  <img
                    src="empty-bag.svg"
                    alt="empty cart"
                    className="size-[55%] opacity-80"
                  />
                </div>

                <div className="max-w-sm space-y-2 px-4">
                  <h3 className="font-bold text-lg sm:text-xl">
                    Your Cart is Empty
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Looks like you haven't added anything to your cart yet.
                    Browse our menu and add your favorite dishes!
                  </p>
                </div>

                <Button
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="mt-4 border-orange-500 text-orange-500 hover:bg-orange-50"
                >
                  Browse Menu
                </Button>
              </div>
            ) : (
              <div className="py-4 space-y-3">
                {Object.entries(cart).map(([categoryName, items]) => (
                  <div key={categoryName} className="space-y-3">
                    <div className="flex items-center gap-2 sticky top-0 bg-white py-2 z-[5]">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-100"
                      >
                        {categoryName}
                      </Badge>
                      <Separator className="flex-1" />
                    </div>
                    {items.map((food, idx) => (
                      <FoodCard
                        key={`${categoryName}-${idx}`}
                        food={food}
                        categoryName={categoryName}
                        imageClassName="h-24 aspect-video"
                      />
                    ))}
                  </div>
                ))}
                {/* Bottom padding for scrolling past footer */}
                <div className="h-32" />
              </div>
            )}
          </ScrollArea>

          {/* Footer - Fixed */}
          {!isEmpty && (
            <div className="flex-shrink-0 p-4 mb-4 border-t bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground font-medium">
                    Total Amount
                  </p>
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
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>Place Order</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
