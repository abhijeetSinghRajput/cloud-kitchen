import CartFooter from "@/components/CartFooter";
import FoodCategory from "@/components/food category/FoodCategory";
import FoodSection from "@/components/FoodSection";
import GoogleReviews from "@/components/GoogleReviews";
import Navbar from "@/components/Navbar";
import HomepageSkeleton, {
  FoodSectionSkeleton,
} from "@/components/skeleton/HomepageSkeleton";
import { Separator } from "@/components/ui/separator";
import { useInventoryStore } from "@/stores/useInventoryStore";
import React, { useEffect } from "react";

const Homepage = () => {
  const { categories, items, getAllItems, fetchCategoriesWithItems, loading } =
    useInventoryStore();

  // Fetch data
  useEffect(() => {
    fetchCategoriesWithItems();
    getAllItems();
  }, []);

  // Scroll to hash on page load / refresh
  useEffect(() => {
    const hash = window.location.hash.slice(1); // remove #
    if (!hash) return;

    const el = document.getElementById(hash);
    if (el) {
      // Smooth scroll respecting scroll-margin-top
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-screen-xl mx-auto p-4">
        <FoodCategory />
        <Separator className="my-8" />

        <GoogleReviews />
        <Separator className="my-8" />

        {loading.fetchCategoriesWithItems ? (
          <div className="space-y-12 mt-8">
            {[...Array(10)].map((_, idx) => (
              <FoodSectionSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="space-y-12 mt-8">
            {categories.map((category) => (
              <FoodSection
                key={category?.id}
                categoryName={category?.name}
                items={items[category?.id] || []}
              />
            ))}
          </div>
        )}
      </main>
      <CartFooter />
    </>
  );
};

export default Homepage;
