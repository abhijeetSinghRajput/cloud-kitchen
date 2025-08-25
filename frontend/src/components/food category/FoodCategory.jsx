// FoodCategory.jsx
import React, { useState } from "react";
import { Card } from "../ui/card";
import FoodListDrawer from "../FoodListDrawer";
import { categories } from "@/constants/category";
import { Badge } from "../ui/badge";
import { useCartStore } from "@/stores/useCartStore";

const FoodCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { getCategoryItemQuantity } = useCartStore();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setDrawerOpen(true);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Categories</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2">
        {categories.map((cat, index) => {
          const quantity = getCategoryItemQuantity(cat.name);
          return (
            <div key={index} className="relative">
              {quantity > 0 && (
                <Badge
                  className={"absolute top-0 right-0 z-10 shadow-md rounded-full bg-[#ff5200] hover:bg-[#ff5200]"}
                >
                  {quantity}
                </Badge>
              )}
              <Card
                className="border-none overflow-hidden shadow-none hover:brightness-90 cursor-pointer transition-all"
                onClick={() => handleCategoryClick(cat)}
              >
                <img src={cat.image} className="w-full h-full object-contain" />
              </Card>
            </div>
          );
        })}
      </div>

      {/* Drawer always mounted, controlled by state */}
      <FoodListDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        category={selectedCategory}
      />
    </div>
  );
};

export default FoodCategory;
