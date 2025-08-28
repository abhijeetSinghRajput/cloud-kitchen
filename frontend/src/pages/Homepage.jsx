import FoodCategory from "@/components/food category/FoodCategory";
import FoodListDrawer from "@/components/FoodListDrawer";
import Navbar from "@/components/Navbar";
import React from "react";

const Homepage = () => {
  
  return (
    <>
      <Navbar />
      <div className="max-w-screen-xl mx-auto p-2 sm:p-4">
        <FoodCategory />
      </div>
    </>
  );
};

export default Homepage;
