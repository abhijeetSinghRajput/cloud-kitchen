// pages/admin/FoodCategoryPage
//.jsx
import TooltipWrapper from "@/components/TooltipWrapper";
import { categories } from "@/constants/category";
import { slug } from "@/lib/utils";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const FoodCategoryPage = () => {

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2">
          <TooltipWrapper message="Add Category">
            <div className="border-2 rounded-lg border-dashed flex items-center justify-center cursor-pointer hover:bg-muted">
              <Plus className="size-1/3 text-muted-foreground" />
            </div>
          </TooltipWrapper>
          {categories.map((cat, index) => {
            return (
                <Link key={index} to={slug(cat.name)} className="hover:bg-muted hover:brightness-90 rounded-lg overflow-hidden">
                  <img
                    src={cat.image}
                    className="w-full h-full object-contain"
                  />
                </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FoodCategoryPage;
