import AddFoodItemDialog from "@/components/admin/AddFoodDialog";
import { Button } from "@/components/ui/button";
import { categories } from "@/constants/category";
import { slug } from "@/lib/utils";
import { ChevronLeft, CupSoda, Plus } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";

const FoodItemPage = () => {
  const { categoryName } = useParams();
  const category = categories.find(
    (category) => slug(category.name) === categoryName
  );

  if (!category) {
    return (
      <div className="mt-16 flex flex-col gap-6 items-center justify-center">
        <div className="size-40 bg-muted flex rounded-full items-center justify-center">
          <CupSoda className="size-1/2 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-muted-foreground text-base">
            No Category named{" "}
            <span className="text-primary font-bold">{categoryName}</span>
          </p>
          <Link to={"/admin/category"} className="border flex items-center gap-2 w-max mx-auto py-1.5 px-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <ChevronLeft className="size-5"/>
          Back To Category
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold mb-4">{category.name}</h1>
      <AddFoodItemDialog />
    </div>
  );
};

export default FoodItemPage;
