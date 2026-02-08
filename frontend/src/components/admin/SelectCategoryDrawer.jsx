import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Drawer, DrawerContent } from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { Loader2 } from "lucide-react";
import ImageWithSkeleton from "../ImageWithSkeleton";

// ✅ Memoized CategoryCard to avoid unnecessary re-renders
const CategoryCard = React.memo(function CategoryCard({ cat, selected, quantity, onClick }) {
  return (
    <div className="relative">
      {quantity > 0 && (
        <Badge className="absolute top-0 right-0 z-10 shadow-md rounded-full bg-[#ff5200] hover:bg-[#ff5200]">
          {quantity}
        </Badge>
      )}
      <Card
        className={`border-none overflow-hidden shadow-none hover:brightness-90 cursor-pointer transition-all ${
          selected ? "bg-orange-500" : ""
        }`}
        onClick={onClick}
      >
        <ImageWithSkeleton
          src={cat.image}
          alt={cat.name}
          className="w-full h-full object-contain"
        />
      </Card>
    </div>
  );
});

const SelectCategoryDrawer = ({
  open,
  onOpenChange,
  categories,
  selectedCategories,
  setSelectedCategories,
  getCategoryItemQuantity,
}) => {
  const { updateCategoriesAvailability, loading } = useInventoryStore();
  const [initialSelected, setInitialSelected] = useState([]);

  // ✅ Only update when categories change
  useEffect(() => {
    const initiallyAvailable = categories
      .filter((c) => c.isAvailable)
      .map((c) => c.id);
    setInitialSelected(initiallyAvailable);
    setSelectedCategories(initiallyAvailable);
  }, [categories, setSelectedCategories]);

  // ✅ More efficient change detection (Set comparison)
  const hasChanges = useMemo(() => {
    if (initialSelected.length !== selectedCategories.length) return true;
    const initSet = new Set(initialSelected);
    return selectedCategories.some((id) => !initSet.has(id));
  }, [initialSelected, selectedCategories]);

  // ✅ Memoize handler
  const handleCategoryClick = useCallback(
    (id) => {
      setSelectedCategories((prev) =>
        prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
      );
    },
    [setSelectedCategories]
  );

  // ✅ Save changes
  const handleDone = useCallback(async () => {
    const selectedIds = new Set(selectedCategories);

    const toEnable = categories.filter((c) => selectedIds.has(c.id)).map((c) => c.id);
    const toDisable = categories.filter((c) => !selectedIds.has(c.id)).map((c) => c.id);

    if (toEnable.length) await updateCategoriesAvailability(toEnable, true);
    if (toDisable.length) await updateCategoriesAvailability(toDisable, false);

    setInitialSelected([...selectedCategories]);
    onOpenChange(false);
  }, [categories, selectedCategories, updateCategoriesAvailability, onOpenChange]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[70vh]">
        <div className="p-4 pr-0 max-w-screen-md w-full mx-auto h-full flex flex-col">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold mb-4">Select Category</h3>
            <Button
              onClick={handleDone}
              disabled={!hasChanges}
              className="bg-[#ff5200] text-white"
            >
              {loading.updateCategoriesAvailability ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Done"
              )}
            </Button>
          </div>

          <ScrollArea className="flex-1 pr-2">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  quantity={getCategoryItemQuantity?.(cat.name) || 0}
                  selected={selectedCategories.includes(cat.id)}
                  onClick={() => handleCategoryClick(cat.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SelectCategoryDrawer;
