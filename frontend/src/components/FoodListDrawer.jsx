// FoodListDrawer.jsx
import { Drawer, DrawerContent } from "./ui/drawer";
import { ScrollArea } from "./ui/scroll-area";
import { useCartStore } from "@/stores/useCartStore";
import FoodCard from "./FoodCard";
import { PackageOpen, Utensils } from "lucide-react";
import CartFooter from "./CartFooter";

const FoodListDrawer = ({ open, onOpenChange, categoryName, items }) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[70vh]">
        <div className="p-4 max-w-screen-md w-full mx-auto h-full flex flex-col">
          <h3 className="text-xl font-bold mb-4 flex-shrink-0">
            {categoryName}
          </h3>

          {/* Scrollable area */}
          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-3">
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <FoodCard
                    key={idx}
                    food={item}
                    categoryName={categoryName}
                    className={"drawer-food-card"}
                    imageClassName="h-24 aspect-video"
                  />
                ))
              ) : (
                <div className="h-full mt-8 flex flex-col gap-2 items-center text-center">
                  <div className="bg-muted size-24 rounded-full flex items-center justify-center">
                    <PackageOpen
                      size={34}
                      strokeWidth={2}
                      className="opacity-50"
                    />
                  </div>

                  <div className="max-w-sm">
                    <h3 className="font-semibold text-lg">Category is Empty</h3>
                    <p className="text-sm text-muted-foreground">
                      We’re still stocking this section. Check back soon or
                      explore other categories!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <CartFooter />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FoodListDrawer;
