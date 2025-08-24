import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search, ShoppingCart } from "lucide-react";
import SearchCommand from "./SearchCommand";
import { Badge } from "./ui/badge";
import { useCartStore } from "@/stores/useCartStore";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { getCartItemCount } = useCartStore();
  const count = getCartItemCount();

  return (
    <nav className="sticky z-50 top-0 bg-primary-foreground shadow-md left-0">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-2">
        <h1 className="text-[#ff5200] font-medium">Cloud Kitchen</h1>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            tooltip="search"
            onClick={() => setSearchOpen(true)}
          >
            <Search />
          </Button>
          <Button size="icon" tooltip="cart" className="relative">
            <ShoppingCart />
            {count > 0 && (
              <Badge 
                  className={"absolute top-full left-full -translate-x-1/2 -translate-y-1/2 z-10 shadow-md rounded-full bg-[#ff5200] hover:bg-[#ff5200]"}>
                {count}
              </Badge>
            )}
          </Button>
        </div>
      </div>
      <SearchCommand open={searchOpen} setOpen={setSearchOpen} />
    </nav>
  );
};

export default Navbar;
