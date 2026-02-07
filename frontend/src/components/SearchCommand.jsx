import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useInventoryStore } from "@/stores/useInventoryStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FoodCard from "./FoodCard";
import { DialogTitle } from "@radix-ui/react-dialog";

const SearchCommand = ({ open, setOpen }) => {
  const { categories } = useInventoryStore();
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // ✅ Prepare flat list of items with category info
  const allItems = useMemo(() => {
    return categories.flatMap((category) =>
      (category.items || []).map((item) => ({
        ...item,
        categoryId: category.id,
        categoryName: category.name,
      }))
    );
  }, [categories]);

  // ✅ Configure Fuse.js with weighted priorities
  const fuse = useMemo(() => {
    return new Fuse(allItems, {
      keys: [
        { name: "name", weight: 3 },           // Highest priority
        { name: "tags", weight: 2 },           // Medium priority
        { name: "description", weight: 1 },    // Lowest priority
      ],
      threshold: 0.4,        // 0 = perfect match, 1 = match anything
      distance: 100,         // Max distance for fuzzy match
      minMatchCharLength: 2, // Minimum characters to start searching
      includeScore: true,    // Include match score
      useExtendedSearch: true, // Enable exact match bonus
    });
  }, [allItems]);

  // ✅ Perform fuzzy search with exact match bonus
  const searchResults = useMemo(() => {
    if (!search.trim()) {
      // Show all items grouped by category when no search
      return categories
        .filter((cat) => cat.items?.length > 0)
        .map((cat) => ({
          category: cat,
          items: cat.items.map((item) => ({
            item: { ...item, categoryName: cat.name },
            score: 1,
          })),
        }));
    }

    const term = search.trim().toLowerCase();
    
    // Perform fuzzy search
    const fuseResults = fuse.search(term);

    // ✅ Boost exact matches
    const boostedResults = fuseResults.map((result) => {
      let scoreBoost = 0;
      const item = result.item;

      // Exact match bonuses
      if (item.name.toLowerCase() === term) scoreBoost += 10;
      else if (item.name.toLowerCase().includes(term)) scoreBoost += 5;

      if (item.tags?.some(tag => tag.toLowerCase() === term)) scoreBoost += 3;
      else if (item.tags?.some(tag => tag.toLowerCase().includes(term))) scoreBoost += 1.5;

      if (item.description?.toLowerCase().includes(term)) scoreBoost += 0.5;

      return {
        ...result,
        boostedScore: result.score - scoreBoost, // Lower score = better match
      };
    });

    // Sort by boosted score
    boostedResults.sort((a, b) => a.boostedScore - b.boostedScore);

    // Group by category
    const grouped = boostedResults.reduce((acc, result) => {
      const categoryId = result.item.categoryId;
      if (!acc[categoryId]) {
        const category = categories.find((c) => c.id === categoryId);
        acc[categoryId] = {
          category,
          items: [],
        };
      }
      acc[categoryId].items.push({
        item: result.item,
        score: result.boostedScore,
      });
      return acc;
    }, {});

    return Object.values(grouped);
  }, [search, fuse, categories]);

  const handleSelect = (item, categoryName) => {
    setSelectedItem(item);
    setSelectedCategoryName(categoryName);
    setOpen(false);
    setDialogOpen(true);
    setSearch(""); // Clear search after selection
  };

  return (
    <>
      <CommandDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setSearch(""); // Clear on close
        }}
        className="top-0 translate-y-0"
      >
        <Command className="rounded-lg border shadow-md md:min-w-[450px]" shouldFilter={false}>
          <CommandInput
            placeholder="Search by name, tags, or description..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {searchResults.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              searchResults.map(({ category, items }) => (
                <div key={category.id}>
                  <CommandGroup heading={category.name}>
                    {items.map(({ item, score }) => (
                      <CommandItem
                        key={item.id}
                        value={item.id} // Use ID as value since we're not using built-in filtering
                        className="cursor-pointer flex gap-2 items-center"
                        onSelect={() => handleSelect(item, item.categoryName)}
                      >
                        <div className="size-14 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            className="h-full w-full object-cover"
                            alt={item.name}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-muted-foreground line-clamp-1 text-sm">
                            {item.description}
                          </p>
                          {item.tags?.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {item.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </div>
              ))
            )}
          </CommandList>
        </Command>
      </CommandDialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle className="sr-only">{selectedItem?.name}</DialogTitle>
          {selectedItem && (
            <FoodCard
              food={selectedItem}
              categoryName={selectedCategoryName}
              className="flex-col"
              imageClassName="w-full"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchCommand;