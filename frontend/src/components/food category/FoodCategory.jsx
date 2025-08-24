import { Foodimages } from "@/constants/images";
import React from "react";
import { Card } from "../ui/card";

const FoodCategory = () => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2">
      {Foodimages.map((image, index) => (
        <Card className="border-none shadow-none hover:brightness-90 cursor-pointer transition-all">
          <img src={image} className="w-full h-full object-contain" />
        </Card>
      ))}
    </div>
  );
};

export default FoodCategory;
