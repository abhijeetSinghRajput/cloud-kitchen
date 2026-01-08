import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const GoogleReviewsSkeleton = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-48" />
        </div>

        <Skeleton className="h-11 w-32 rounded-full hidden sm:block" />
      </div>

      {/* Cards */}
      <ScrollArea>
        <div className="flex gap-4 pb-4">
          {[...Array(4)].map((_, i) => (
            <ReviewCardSkeleton key={i} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Mobile button */}
      <Skeleton className="h-12 w-full rounded-full sm:hidden mt-2" />
    </div>
  );
};

const ReviewCardSkeleton = () => {
  return (
    <Card className="w-[350px] flex flex-col gap-3 p-4 rounded-2xl bg-muted/50">
      {/* Header */}
      <CardHeader className="p-0 flex justify-between items-start flex-row">
        <div className="flex gap-3 items-center">
          <Skeleton className="size-9 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <Skeleton className="h-5 w-10 rounded-md" />
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col p-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-0">
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
};

export default GoogleReviewsSkeleton;
