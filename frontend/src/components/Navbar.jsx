import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search, ShoppingCart } from "lucide-react";
import SearchCommand from "./SearchCommand";
import { Badge } from "./ui/badge";
import { useCartStore } from "@/stores/useCartStore";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { getCartItemCount } = useCartStore();
  const count = getCartItemCount();
  const [openCart, setOpenCart] = useState(false);

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
          <Button
            size="icon"
            tooltip="cart"
            className="relative"
            onClick={() => setOpenCart(true)}
          >
            <ShoppingCart />
            {count > 0 && (
              <Badge className="absolute p-0 size-2.5 -bottom-0.5 -right-0.5 z-10 shadow-md rounded-full bg-transparent border-0">
                {/* Background pulse effect */}
                <div className="absolute inset-0 rounded-full bg-[#ff5200] animate-ping" />

                {/* Solid background */}
                <div className="absolute inset-0 rounded-full bg-[#ff5200]" />

                {/* Count text */}
                <span className="relative z-10 text-xs font-bold text-white">
                </span>
              </Badge>
            )}
          </Button>
        </div>
      </div>
      <SearchCommand open={searchOpen} setOpen={setSearchOpen} />
      <CartDrawer open={openCart} onOpenChange={setOpenCart} />
    </nav>
  );
};

export default Navbar;
