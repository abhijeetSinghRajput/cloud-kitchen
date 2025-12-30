import React from "react";
import { Skeleton } from "../ui/skeleton"; // shadcn Skeleton
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

const FoodCardSkeleton = ({ className, imageClassName }) => {
  return (
    <Card
      className={`flex gap-2 overflow-hidden food-card shadow-none border-none ${className}`}
    >
      {/* Image skeleton */}
        <Skeleton className={cn("w-full h-full rounded-md", imageClassName)} />

      {/* Content skeleton */}
      <div className="flex flex-col justify-between flex-1 p-2 space-y-2">
        <div>
          <Skeleton className="h-5 w-32 mb-2" /> {/* food name */}
          <Skeleton className="h-4 w-48" />       {/* description */}
        </div>

        <div className="flex gap-4 justify-between items-center">
          {/* Price skeleton */}
          <Skeleton className="h-6 w-16 rounded" />

          {/* Add/Remove buttons skeleton */}
          <Skeleton className="h-10 w-36 rounded-full overflow-hidden"/>
        </div>
      </div>
    </Card>
  );
};

export default FoodCardSkeleton;
