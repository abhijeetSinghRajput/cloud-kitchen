import React from "react";
import { CupSoda, Gauge, LogOut, Package } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getAvatarFallbackText } from "@/lib/utils";
import { Link, NavLink } from "react-router-dom";

const links = [
  { labl: "Dashboard", path: "/admin/dashboard", icon: Gauge },
  { labl: "Category", path: "/admin/category", icon: CupSoda },
];


const Navbar = () => {
    const authUser = {
        name: "Abhijeet Singh",
        email: "abhijeet62008@gmail.com",
        avatar: "https://avatars.githubusercontent.com/u/134230962",
    }
  return (
    <nav className="sticky z-50 top-0 bg-primary-foreground shadow-md left-0">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 py-2">
        <h1 className="text-[#ff5200] font-semibold">
          <Link to={"/"}>Cloud Kitchen</Link>
        </h1>
        <div className="flex items-center gap-6">
          <ul className="flex gap-4 text-sm text-primary/70">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `transition-colors py-1.5 px-2 rounded-lg flex gap-2 items-center font-semibold ${
                      isActive
                        ? "text-primary-foreground bg-primary"
                        : "text-primary/70 hover:text-primary"
                    }`
                  }
                >
                  <link.icon className="size-5" />
                  {link.labl}
                </NavLink>
              </li>
            ))}
          </ul>

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
                    <AvatarImage src={authUser?.avatar} alt={authUser?.name} />
                    <AvatarFallback>
                      {getAvatarFallbackText(authUser?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {authUser?.name}
                    </span>
                    <span className="truncate text-xs">{authUser?.email}</span>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
