import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, CupSoda, RefreshCw } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FoodItemDialog from "@/components/admin/FoodItemDialog";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { Badge } from "@/components/ui/badge";
import TooltipWrapper from "@/components/TooltipWrapper";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";

const FoodItemPage = () => {
  const { categoryName: slug } = useParams();
  const { getCategoryWithItems, loading, error, clearError } =
    useInventoryStore();

  const [category, setCategory] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Fetch category with items
  const fetchData = useCallback(async () => {
    if (!slug) return;

    try {
      clearError();
      const categoryData = await getCategoryWithItems(slug);
      setCategory(categoryData);
    } catch (err) {
      console.error("Failed to fetch category:", err);
    }
  }, [slug, getCategoryWithItems, clearError]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  // ✅ Handle dialog open/close
  const handleOpenDialog = (item = null) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  // ✅ Handle item updates (add/edit/delete)
  const handleItemUpdated = useCallback(
    async (updatedItem, action = "updated") => {
      if (action === "deleted") {
        console.log("Item deleted successfully");
      } else {
        console.log("Item saved successfully:", updatedItem);
      }

      // Refresh the category data to show latest items
      await fetchData();
    },
    [fetchData]
  );

  // ✅ Manual refresh
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // ✅ Loading state
  if (loading.fetchItems && !category) {
    return (
      <div className="mt-16 flex flex-col gap-6 items-center justify-center">
        <div className="size-16 bg-muted flex rounded-full items-center justify-center animate-pulse">
          <CupSoda className="size-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Loading category...</p>
      </div>
    );
  }

  // ✅ Category not found
  if (!loading.fetchItems && !category) {
    return (
      <div className="mt-16 flex flex-col gap-6 items-center justify-center">
        <div className="size-40 bg-muted flex rounded-full items-center justify-center">
          <CupSoda className="size-1/2 text-muted-foreground" />
        </div>
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Category Not Found</h2>
            <p className="text-muted-foreground text-base">
              No category found for slug{" "}
              <span className="text-primary font-bold">"{slug}"</span>
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="max-w-md">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading.fetchItems}
            >
              <RefreshCw className="size-4 mr-2" />
              Retry
            </Button>
            <Link
              to="/admin/category"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <ChevronLeft className="size-4" />
              Back to Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryItems = category?.items || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <TooltipWrapper message="back to category">
            <Link
              to="/admin/category"
              className="inline-flex hover:bg-accent p-1 rounded-md items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="size-5" />
            </Link>
          </TooltipWrapper>

          <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-bold">{category?.name}</h1>
            {categoryItems.length > 0 && (
              <Badge className={"rounded-full"}>{categoryItems.length}</Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 size-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading.fetchItems}
              >
                <RefreshCw
                  className={`size-4 ${
                    loading.fetchItems ? "animate-spin" : ""
                  }`}
                />
              </Button>
              <Button variant="outline" size="sm" onClick={() => clearError()}>
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Items Grid */}
      <div className="min-h-[200px]">
        {loading.fetchItems ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Loading skeletons */}
            {[...Array(10)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : categoryItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryItems.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                onClick={() => handleOpenDialog(item)}
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
            ))}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="size-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No items yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first food item to this category
            </p>
          </div>
        )}
      </div>

      {/* Item Dialog */}
      <FoodItemDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        categoryId={category?.id}
        item={selectedItem}
        onItemUpdated={handleItemUpdated}
        folder="foodItems"
      />
    </div>
  );
};

export default FoodItemPage;
