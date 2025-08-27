import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // adjust import path if needed

const FoodCategorySkeleton = () => {
  const size = 20;

  return (
    <>
      {[...Array(size)].map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-xl" />
      ))}
    </>
  );
};

export default FoodCategorySkeleton;
