import React, { useMemo, useState, useEffect } from "react";
import { Drawer, DrawerContent } from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { Loader2 } from "lucide-react";

const SelectCategoryDrawer = ({
  open,
  onOpenChange,
  categories,
  selectedCategories,
  setSelectedCategories,
  getCategoryItemQuantity,
}) => {
  const { updateCategoriesAvailability, loading } = useInventoryStore();

  // Keep track of initial availability from DB
  const [initialSelected, setInitialSelected] = useState([]);

  useEffect(() => {
    // Initialize with categories that are already available
    setInitialSelected(
      categories.filter((c) => c.isAvailable).map((c) => c.id)
    );
    setSelectedCategories(
      categories.filter((c) => c.isAvailable).map((c) => c.id)
    );
  }, [categories, setSelectedCategories]);

  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== category.id)
      );
    } else {
      setSelectedCategories([...selectedCategories, category.id]);
    }
  };

  // Check if there’s any difference from initial state
  const hasChanges = useMemo(() => {
    if (initialSelected.length !== selectedCategories.length) return true;
    const sortedInit = [...initialSelected].sort();
    const sortedNew = [...selectedCategories].sort();
    return JSON.stringify(sortedInit) !== JSON.stringify(sortedNew);
  }, [initialSelected, selectedCategories]);

  const handleDone = async () => {
    // Enable only selected categories, disable the rest
    const selectedIds = new Set(selectedCategories);

    const toEnable = categories
      .filter((c) => selectedIds.has(c.id))
      .map((c) => c.id);

    const toDisable = categories
      .filter((c) => !selectedIds.has(c.id))
      .map((c) => c.id);

    if (toEnable.length > 0) {
      await updateCategoriesAvailability(toEnable, true);
    }
    if (toDisable.length > 0) {
      await updateCategoriesAvailability(toDisable, false);
    }

    // Reset initial to the new state
    setInitialSelected([...selectedCategories]);

    // Close drawer after save
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[70vh]">
        <div className="p-4 max-w-screen-md w-full mx-auto h-full flex flex-col">
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
              {categories.map((cat, index) => {
                const quantity = getCategoryItemQuantity?.(cat.name) || 0;
                return (
                  <div key={index} className="relative">
                    {quantity > 0 && (
                      <Badge className="absolute top-0 right-0 z-10 shadow-md rounded-full bg-[#ff5200] hover:bg-[#ff5200]">
                        {quantity}
                      </Badge>
                    )}

                    <Card
                      className={`border-none overflow-hidden shadow-none hover:brightness-90 cursor-pointer transition-all ${
                        selectedCategories.includes(cat.id)
                          ? "bg-orange-500"
                          : ""
                      }`}
                      onClick={() => handleCategoryClick(cat)}
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-contain"
                      />
                    </Card>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SelectCategoryDrawer;
