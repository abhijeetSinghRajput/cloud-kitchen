import FoodCategory from "@/components/food category/FoodCategory";
import Navbar from "@/components/Navbar";
import React from "react";

const Homepage = () => {
  return (
    <div className="max-w-screen-xl mx-auto border">
      <Navbar />
      <FoodCategory />
    </div>
  );
};

export default Homepage;
