import React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

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
import { categories } from "@/constants/category";

const SearchCommand = ({open, setOpen}) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="top-0 translate-y-0">
      <Command className="rounded-lg border shadow-md md:min-w-[450px]">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {categories.map((category) => (
            <div key={category.name}>
              <CommandGroup heading={category.name}>
                {category.items.map((item) => (
                  <CommandItem key={item.name}>
                    <div className="size-12 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-muted-foreground line-clamp-1">
                        {item.desc}
                      </p>
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
  );
};

export default SearchCommand;
