import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronRight, LogOut, Search, ShoppingCart } from "lucide-react";
import SearchCommand from "./SearchCommand";
import { Badge } from "./ui/badge";
import { useCartStore } from "@/stores/useCartStore";
import CartDrawer from "./CartDrawer";
import { Link } from "react-router-dom";
import WhatsappButton, { whatsappInfo } from "./WhatsappButton";

const Navbar = ({ authUser = null }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { getCartItemQuantity } = useCartStore();
  const quantity = getCartItemQuantity();
  const { isCartOpen, setOpenCart } = useCartStore();
  const { whatsappNumber, fullNumber, message } = whatsappInfo;

  const whatsappUrl = `https://wa.me/${fullNumber}?text=${message}`;
  return (
    <nav className="sticky z-50 top-0 bg-primary-foreground shadow-md left-0">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-2">
        <h1 className="text-[#ff5200] font-semibold">
          <Link to={"/"} className="flex gap-1 items-center">
            <img
              src="/logo-mini.svg"
              alt="cloud kitchen logo"
              className="h-10"
            />
            <img
              src="/logo.svg"
              alt="cloud kitchen logo"
              className="h-[18px] logo"
            />
          </Link>
        </h1>
        <div className="flex items-center gap-3">
          {/* <Link to="/subscription">
            <Button className="rounded-full bg-orange-500 hover:bg-orange-400">
              Get Subscription
            </Button>
          </Link> */}

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Whatapp contact link">
              <div className="size-9 aspect-square">
                <img
                  src="/whatsapp-logo.svg"
                  className="w-full h-full object-contain"
                  alt="Whatapp logo"
                />
              </div>
          </a>

          <Button
            size="icon"
            tooltip="search"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search />
          </Button>
          <Button
            size="icon"
            tooltip="cart"
            aria-label="Open cart"
            className="relative"
            onClick={() => setOpenCart(true)}
          >
            <ShoppingCart />
            {quantity > 0 && (
              <Badge className="absolute p-0 size-2.5 -bottom-0.5 -right-0.5 z-10 shadow-md rounded-full bg-transparent border-0">
                {/* Background pulse effect */}
                <div className="absolute inset-0 rounded-full bg-[#ff5200] animate-ping" />

                {/* Solid background */}
                <div className="absolute inset-0 rounded-full bg-[#ff5200]" />

                {/* Quantity text */}
                <span className="relative z-10 text-xs font-bold text-white"></span>
              </Badge>
            )}
          </Button>
        </div>
      </div>
      <SearchCommand open={searchOpen} setOpen={setSearchOpen} />
      <CartDrawer open={isCartOpen} onOpenChange={setOpenCart} />
    </nav>
  );
};

export default Navbar;
