import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import FoodCard from "./FoodCard";
import { Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import TooltipWrapper from "./TooltipWrapper";

const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-");

const FoodSection = ({ categoryName, items }) => {
  if (items.length === 0) return null;

  const sectionId = slugify(categoryName);

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    navigator.clipboard.writeText(url);
    toast.success("Section link copied!");
  };

  return (
    <section id={sectionId}>
      <div className="relative group mb-4">
        <h2
          onClick={copyLink}
          className="flex items-center gap-2 font-bold capitalize text-xl scroll-mt-[60px] cursor-pointer select-none"
        >
          {categoryName}

          {/* Hover link icon */}
          <span className="opacity-0 group-hover:opacity-100 transition text-muted-foreground">
            <LinkIcon size={18} />
            {/* Simple tooltip text */}
            <span className="absolute -top-8 left-4 whitespace-nowrap px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none">
              Copy link
            </span>
          </span>
        </h2>
      </div>

      <ScrollArea className="flex-1 pb-4">
        <div className="flex gap-2 sm:gap-4">
          {items.map((item, idx) => (
            <FoodCard
              key={idx}
              food={item}
              categoryName={categoryName}
              className="flex-col w-52 sm:w-64"
              imageClassName="w-full h-44 sm:h-52"
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};

export default FoodSection;
