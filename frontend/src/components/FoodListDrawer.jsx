// FoodListDrawer.jsx
import { Drawer, DrawerContent } from "./ui/drawer";
import { Card } from "./ui/card";
import { Plus, Minus, IndianRupee } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useCartStore } from "@/stores/useCartStore";

const FoodCard = ({ food, categoryName, addToCart, removeFromCart, cart }) => {
  // Find the current item in cart
  const cartItems = cart[categoryName] || [];
  const cartItem = cartItems.find(item => item.name === food.name);
  const itemCount = cartItem ? cartItem.count : 0;

  return (
    <Card className="flex gap-2 overflow-hidden">
      <div className="size-24 flex-shrink-0">
        <img src={food.image} className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col justify-between flex-1 p-2 space-y-2">
        <div>
          <h4 className="text-base font-bold">{food.name}</h4>
          <p className="text-muted-foreground text-sm">{food.desc}</p>
        </div>
        <div className="flex gap-4 space-y-4 justify-between items-center">
          <div className="flex items-center gap-0.5 text-xl font-bold text-orange-500">
            <IndianRupee className="size-3" />
            <span>{food.price}</span>
          </div>

          <div className="bg-[#ff5200] rounded-full overflow-hidden w-max">
            <div className="relative h-9 flex items-center justify-center gap-2">
              <span className="absolute text-primary-foreground font-medium z-10">
                {itemCount || "Add"}
              </span>
              <Button
                className="h-full rounded-none bg-[#ff5200] hover:bg-transparent shadow-none"
                onClick={() => removeFromCart(categoryName, food.name)}
                disabled={itemCount === 0}
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

const FoodListDrawer = ({ open, onOpenChange, category }) => {
  if (!category) return null;
  
  // Use the cart store correctly
  const { add, remove, cart } = useCartStore();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[70vh]">
        <div className="p-4 max-w-screen-md w-full mx-auto h-full flex flex-col">
          <h3 className="text-xl font-bold mb-4 flex-shrink-0">
            {category.name}
          </h3>

          {/* Scrollable area */}
          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-3">
              {category.items.map((food, idx) => (
                <FoodCard
                  key={idx}
                  food={food}
                  categoryName={category.name}
                  addToCart={add}
                  removeFromCart={remove}
                  cart={cart}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FoodListDrawer;