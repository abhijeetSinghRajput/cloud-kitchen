// FoodCategory.jsx
import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import FoodListDrawer from "../FoodListDrawer";
import { Badge } from "../ui/badge";
import { useCartStore } from "@/stores/useCartStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import FoodCategorySkeleton from "./FoodCategorySkeleton";
import ImageWithSkeleton from "../ImageWithSkeleton";
import { Ban } from "lucide-react";
import { cn } from "@/lib/utils";

const FoodCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { getCategoryItemQuantity } = useCartStore();
  const { categories, items, loading } = useInventoryStore();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setDrawerOpen(true);
  };

  const availableCategories = categories.filter((c) => c.isAvailable);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2">
        {loading.fetchCategoriesWithItems ? (
          <FoodCategorySkeleton />
        ) : (
          availableCategories.map((cat, index) => {
            const cartQuantity = getCategoryItemQuantity(cat.name);
            const isEmpty = cat.items.length === 0;
            return (
              <div
                key={index}
                className={cn("relative", isEmpty && "opacity-70")}
              >
                {cartQuantity > 0 && (
                  <Badge className="absolute top-0 right-0 z-10 shadow-md rounded-full bg-[#ff5200] hover:bg-[#ff5200]">
                    {cartQuantity}
                  </Badge>
                )}

                {isEmpty && (
                  <Badge className="rounded-full absolute top-0 left-0 gap-1 z-10">
                    <Ban size={12} />
                    empty
                  </Badge>
                )}

                <Card
                  className="border-none overflow-hidden aspect-square shadow-none hover:brightness-90 cursor-pointer transition-all"
                  onClick={() => handleCategoryClick(cat)}
                >
                  <ImageWithSkeleton
                    src={cat.image}
                    alt={cat.name}
                    loading={index < 3 ? "eager" : "lazy"} // top 3 eager, rest lazy
                    fetchpriority={index < 3 ? "high" : "auto"} // LCP boost for top images
                    width={300}
                    height={300}
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
