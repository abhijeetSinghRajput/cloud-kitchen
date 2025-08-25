import React, { useState } from "react";
import { Button } from "./ui/button";
import { LogOut, Search, ShoppingCart } from "lucide-react";
import SearchCommand from "./SearchCommand";
import { Badge } from "./ui/badge";
import { useCartStore } from "@/stores/useCartStore";
import CartDrawer from "./CartDrawer";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { getAvatarFallbackText } from "@/lib/utils";
import { Link } from "react-router-dom";

const Navbar = ({ authUser = null }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { getCartItemQuantity } = useCartStore();
  const quantity = getCartItemQuantity();
  const [openCart, setOpenCart] = useState(false);

  return (
    <nav className="sticky z-50 top-0 bg-primary-foreground shadow-md left-0">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-2">
        <h1 className="text-[#ff5200] font-semibold">
          <Link to={"/"}>Cloud Kitchen</Link>
        </h1>
        <div className="flex items-center gap-2">
          {authUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="size-8 border cursor-pointer">
                  <AvatarImage src={authUser?.avatar} />
                  <AvatarFallback>
                    {getAvatarFallbackText(authUser?.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={authUser.avatar} alt={authUser.name} />
                      <AvatarFallback>
                        {getAvatarFallbackText(authUser?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {authUser.name}
                      </span>
                      <span className="truncate text-xs">{authUser.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
      <SearchCommand open={searchOpen} setOpen={setSearchOpen} />
      <CartDrawer open={openCart} onOpenChange={setOpenCart} />
    </nav>
  );
};

export default Navbar;
