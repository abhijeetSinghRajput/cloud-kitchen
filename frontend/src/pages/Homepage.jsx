import FoodCategory from "@/components/food category/FoodCategory";
import FoodListDrawer from "@/components/FoodListDrawer";
import FoodSection from "@/components/FoodSection";
import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import { useInventoryStore } from "@/stores/useInventoryStore";
import React from "react";

const Homepage = () => {
  const { categories, items, getAllItems, fetchCategoriesWithItems, loading } =
    useInventoryStore();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setDrawerOpen(true);
  };

  const availableCategories = categories.filter(
    (category) => category.isAvailable
  );

  return (
    <>
      <Navbar />
      <div className="max-w-screen-xl mx-auto p-2 sm:p-4">
        <FoodCategory />
        <Separator className="my-8"/>
        <div className="space-y-12 mt-8">
          {availableCategories.map((category) => (
            <FoodSection
              categoryName={category?.name}
              items={items[category?.id] || []}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Homepage;
