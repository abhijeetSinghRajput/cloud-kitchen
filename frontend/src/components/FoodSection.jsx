import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import FoodCard from "./FoodCard";

const FoodSection = ({ categoryName, items }) => {
  return (
    <div>
      <h3 className="font-bold capitalize mb-4 text-muted-foreground text-xl">
        {categoryName}
      </h3>
      <ScrollArea className="flex-1 pr-2 pb-4">
        <div className="space-y-0 flex gap-8">
          {items.map((item, idx) => (
            <FoodCard
              key={idx}
              food={item}
              categoryName={categoryName}
              className="flex-col w-64"
              imageClassName="w-full h-52"
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default FoodSection;
