// FoodCategory.jsx
import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import FoodListDrawer from "../FoodListDrawer";
import { Badge } from "../ui/badge";
import { useCartStore } from "@/stores/useCartStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import FoodCategorySkeleton from "./FoodCategorySkeleton";
import ImageWithSkeleton from "../ImageWithSkeleton";

const FoodCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { getCategoryItemQuantity } = useCartStore();
  const { categories, items, getAllItems, fetchCategoriesWithItems, loading } = useInventoryStore();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setDrawerOpen(true);
  };

  const availableCategories = categories.filter(
    (category) => category.isAvailable
  );

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Categories</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2">
        {loading.fetchCategoriesWithItems ? (
          <FoodCategorySkeleton />
        ) : (
          availableCategories.map((cat, index) => {
            const quantity = getCategoryItemQuantity(cat.name);
            return (
              <div key={index} className="relative">
                {quantity > 0 && (
                  <Badge className="absolute top-0 right-0 z-10 shadow-md rounded-full bg-[#ff5200] hover:bg-[#ff5200]">
                    {quantity}
                  </Badge>
                )}

                <Card
                  className="border-none overflow-hidden aspect-square shadow-none hover:brightness-90 cursor-pointer transition-all"
                  onClick={() => handleCategoryClick(cat)}
                >
                  <ImageWithSkeleton
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                  />
                </Card>
              </div>
            );
          })
        )}
      </div>

      {/* Drawer always mounted, controlled by state */}
      <FoodListDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        categoryName={selectedCategory?.name}
        items={items[selectedCategory?.id] || []}
      />
    </div>
  );
};

export default FoodCategory;
