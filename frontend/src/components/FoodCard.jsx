import React from "react";
import { Card } from "./ui/card";
import { Plus, Minus, IndianRupee } from "lucide-react";
import { Button } from "./ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { cn } from "@/lib/utils";

const FoodCard = ({ food, categoryName, className, imageClassName }) => {
  const { addToCart, removeFromCart, cart } = useCartStore();

  // Find the current item in cart
  const cartItems = cart[categoryName] || [];
  const cartItem = cartItems.find((item) => item.name === food.name);
  const itemQuantity = cartItem ? cartItem.quantity : 0;

  return (
    <Card className={cn("flex gap-2 overflow-hidden", className)}>
      <div className={cn("w-40", imageClassName)}>
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="flex flex-col justify-between flex-1 p-2 space-y-2">
        <div>
          <h4 className="text-base font-bold">{food.name}</h4>
          <p className="text-muted-foreground text-sm">{food.description}</p>
        </div>

        <div className="flex gap-4 justify-between items-center">
          <div className="flex items-center gap-0.5 text-xl font-bold text-orange-500">
            <IndianRupee className="size-3" />
            <span>{food.price}</span>
          </div>

          <div className="bg-[#ff5200] rounded-full overflow-hidden w-max">
            <div className="relative h-10 flex items-center justify-center gap-2">
              <span className="absolute text-primary-foreground font-medium z-10">
                {itemQuantity || "Add"}
              </span>
              <Button
                className="h-full rounded-none bg-[#ff5200] hover:bg-transparent shadow-none"
                onClick={() => removeFromCart(categoryName, food.name)}
                disabled={itemQuantity === 0}
              >
                <Minus />
              </Button>
              <Button
                className="h-full rounded-none bg-[#ff5200] hover:bg-transparent shadow-none"
                onClick={() => addToCart(categoryName, food)}
              >
                <Plus />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FoodCard;
