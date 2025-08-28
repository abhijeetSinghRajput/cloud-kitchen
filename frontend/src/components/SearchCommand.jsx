import React, { useState, useMemo } from "react";
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

const SearchCommand = ({ open, setOpen }) => {
  const { categories } = useInventoryStore();
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    return categories
      .map((cat) => {
        const filteredItems = term
          ? (cat.items || []).filter(
              (item) =>
                item.tags?.some((tag) => tag.toLowerCase().includes(term)) ||
                item.name?.toLowerCase().includes(term)
            )
          : cat.items || [];
        return { ...cat, items: filteredItems };
      })
      .filter((cat) => cat.items?.length > 0);
  }, [categories, search]);

  const handleSelect = (item, categoryName) => {
    setSelectedItem(item);
    setSelectedCategoryName(categoryName);
    setOpen(false);      // close CommandDialog
    setDialogOpen(true); // open Dialog with FoodCard
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen} className="top-0 translate-y-0">
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput placeholder="Search by tags..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {filteredCategories.map((category) => (
              <div key={category.id}>
                <CommandGroup heading={category.name}>
                  {category.items?.map((item) => (
                    <CommandItem
                      key={item.id}
                      className="cursor-pointer flex gap-2 items-center"
                      onSelect={() => handleSelect(item, category.name)} // <- pass category name
                    >
                      <div className="size-12 rounded-full overflow-hidden flex-shrink-0">
                        <img src={item.image} className="h-full w-full object-cover" alt={item.name} />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-muted-foreground line-clamp-1">{item.description}</p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </div>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
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
