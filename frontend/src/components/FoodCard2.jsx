import React from "react";
import { Card, CardContent } from "./ui/card";
import ImageWithSkeleton from "./ImageWithSkeleton";
import { CupSoda } from "lucide-react";

const FoodCard2 = ({item, onClick}) => {
  return (
    <Card
      key={item.id}
      className="cursor-pointer min-w-52 overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden bg-muted">
          {item.image ? (
            <ImageWithSkeleton
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="w-full h-full flex items-center justify-center text-muted-foreground"
            style={{ display: item.image ? "none" : "flex" }}
          >
            <CupSoda className="size-8" />
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
              {item.name}
            </h3>
            <span className="font-bold text-primary whitespace-nowrap ml-2">
              ₹{item.price}
            </span>
          </div>

          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {item.description}
            </p>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-secondary px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="text-xs text-muted-foreground px-2 py-1">
                  +{item.tags.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodCard2;
