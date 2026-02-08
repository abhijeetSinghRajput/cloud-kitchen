// pages/admin/FoodCategoryPage
//.jsx
import SelectCategoryDrawer from "@/components/admin/SelectCategoryDrawer";
import FoodCategorySkeleton from "@/components/food category/FoodCategorySkeleton";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { slug } from "@/lib/utils";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FoodCategoryPage = () => {
  const { categories, fetchCategoriesWithItems, loading } = useInventoryStore();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    fetchCategoriesWithItems();
  }, []);

  const availableCategories = categories.filter((c) => c.isAvailable);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2">
          <TooltipWrapper message="Add Category">
            <Button
              variant="ghost"
              className="border-2 aspect-square rounded-lg border-dashed flex items-center justify-center cursor-pointer hover:bg-muted h-auto"
              onClick={() => setOpenDrawer(true)}
            >
              <Plus className="!size-1/3 text-muted-foreground" />
            </Button>
          </TooltipWrapper>

          {loading.fetchCategoriesWithItems ? (
            <FoodCategorySkeleton />
          ) : (
            availableCategories.map((cat) => (
              <Link
                key={cat.id}
                to={slug(cat.name)}
                className="relative hover:bg-muted aspect-square hover:brightness-90 rounded-lg overflow-hidden"
              >
                {cat.items.length > 0 && (
                  <Badge className="absolute z-10 top-0 right-0 rounded-full">
                    {cat.items.length}
                  </Badge>
                )}
                <ImageWithSkeleton
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain"
                />
              </Link>
            ))
          )}
        </div>
      </div>
      <SelectCategoryDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
    </div>
  );
};

export default FoodCategoryPage;
