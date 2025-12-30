import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // adjust import path if needed

const FoodCategorySkeleton = ({size = 10}) => {
  return (
    <>
      {[...Array(size)].map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-xl" />
      ))}
    </>
  );
};

export default FoodCategorySkeleton;
