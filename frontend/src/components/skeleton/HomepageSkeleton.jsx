import React from "react";
import FoodCategorySkeleton from "../food category/FoodCategorySkeleton";
import { Separator } from "../ui/separator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import FoodCardSkeleton from "./FoodCardSkeleton";
import { Skeleton } from "../ui/skeleton";
import GoogleReviewsSkeleton from "./GoogleReviewsSkeleton";

const HomepageSkeleton = () => {
  return (
    <div className="max-w-screen-xl mx-auto p-4">
      {/* <GoogleReviewsSkeleton />
      <Separator className="my-8" /> */}
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2">
        <FoodCategorySkeleton />
      </div>
      <Separator className="my-8" />
      <div className="space-y-12 mt-8">
        {[...Array(10)].map((_, idx) => (
          <FoodSectionSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
};

export const FoodSectionSkeleton = () => {
  return (
    <div>
      <Skeleton className="mb-4 h-7 w-32" />
      <ScrollArea className="flex-1 pb-4">
        <div className="space-y-0 flex gap-4 sm:gap-8">
          {[...Array(10)].map((_, idx) => (
            <FoodCardSkeleton
              key={idx}
              className="flex-col w-52 sm:w-64"
              imageClassName="w-full h-44 sm:h-52"
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default HomepageSkeleton;
