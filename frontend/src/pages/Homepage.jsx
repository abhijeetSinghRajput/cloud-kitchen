import CartFooter from "@/components/CartFooter";
import FoodCategory from "@/components/food category/FoodCategory";
import FoodListDrawer from "@/components/FoodListDrawer";
import FoodSection from "@/components/FoodSection";
import GoogleReviews from "@/components/GoogleReviews";
import Navbar from "@/components/Navbar";
import HomepageSkeleton from "@/components/skeleton/HomepageSkeleton";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/useCartStore";
import { useInventoryStore } from "@/stores/useInventoryStore";
import React, { useEffect } from "react";

const Homepage = () => {
  const { categories, items, getAllItems, fetchCategoriesWithItems, loading } =
    useInventoryStore();
  const availableCategories = categories.filter(
    (category) => category.isAvailable
  );

  useEffect(() => {
    fetchCategoriesWithItems();
    getAllItems();
  }, []);

  return (
    <>
      <Navbar />
      {loading.fetchCategoriesWithItems  || 0 ? (
        <HomepageSkeleton />
      ) : (
        <div className="max-w-screen-xl mx-auto p-2 sm:p-4">
          <GoogleReviews/>
          <Separator className="my-8" />
          <FoodCategory />
          <Separator className="my-8" />
          <div className="space-y-12 mt-8">
            {availableCategories.map((category) => (
              <FoodSection
                categoryName={category?.name}
                items={items[category?.id] || []}
              />
            ))}
          </div>
        </div>
      )}
      <CartFooter />
    </>
  );
};

export default Homepage;
