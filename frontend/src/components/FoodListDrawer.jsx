// FoodListDrawer.jsx
import { Drawer, DrawerContent } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import { useCartStore } from "@/stores/useCartStore";
import FoodCard from "./FoodCard";


const FoodListDrawer = ({ open, onOpenChange, category }) => {
  if (!category) return null;  

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